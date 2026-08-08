import { v2 as cloudinary } from 'cloudinary'

/**
 * Image storage, isolated behind one module.
 *
 * Everything above this file deals in plain URL strings, so swapping providers
 * later means rewriting only these four functions.
 *
 * Uploads are signed server-side rather than using an unsigned preset: an
 * unsigned preset is a public write endpoint that anyone who views the page
 * source can post to.
 */

const FOLDER = process.env.CLOUDINARY_FOLDER ?? 'super-tech/products'

let configured = false

function client() {
  if (!configured) {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
    const api_key = process.env.CLOUDINARY_API_KEY
    const api_secret = process.env.CLOUDINARY_API_SECRET

    if (!cloud_name || !api_key || !api_secret) {
      throw new Error(
        'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.',
      )
    }

    cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
    configured = true
  }
  return cloudinary
}

export function isMediaConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )
}

export type StoredImage = {
  url: string
  publicId: string
  width: number
  height: number
  bytes: number
}

/**
 * Build a delivery URL with automatic format and quality.
 *
 * `f_auto` serves AVIF/WebP to browsers that accept them and `q_auto` picks a
 * quality level per image, which is the main reason for using Cloudinary over
 * plain file storage.
 */
export function deliveryUrl(publicId: string, width?: number): string {
  const transforms = ['f_auto', 'q_auto']
  if (width) transforms.push(`w_${width}`, 'c_limit')
  return client().url(publicId, { transformation: [{ raw_transformation: transforms.join(',') }] })
}

export async function uploadImage(buffer: Buffer, filename: string): Promise<StoredImage> {
  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    client()
      .uploader.upload_stream(
        {
          folder: FOLDER,
          public_id: filename,
          // Never silently replace an existing image — a name collision would
          // swap the picture on whatever product already points at it.
          overwrite: false,
          unique_filename: true,
          resource_type: 'image',
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(new Error(error?.message ?? 'Upload failed.'))
          else resolve(uploaded as unknown as Record<string, unknown>)
        },
      )
      .end(buffer)
  })

  const publicId = String(result.public_id)
  return {
    url: deliveryUrl(publicId),
    publicId,
    width: Number(result.width ?? 0),
    height: Number(result.height ?? 0),
    bytes: Number(result.bytes ?? 0),
  }
}

export async function listImages(limit = 500): Promise<StoredImage[]> {
  const result = await client().api.resources({
    type: 'upload',
    prefix: FOLDER,
    max_results: Math.min(limit, 500),
  })

  return ((result.resources ?? []) as Record<string, unknown>[]).map((resource) => {
    const publicId = String(resource.public_id)
    return {
      url: deliveryUrl(publicId),
      publicId,
      width: Number(resource.width ?? 0),
      height: Number(resource.height ?? 0),
      bytes: Number(resource.bytes ?? 0),
    }
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  const result = await client().uploader.destroy(publicId, { resource_type: 'image' })
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Cloudinary refused the delete: ${result.result}`)
  }
}

/**
 * Recover the public id from a delivery URL.
 *
 * The public id is the only stable identity a Cloudinary image has. The same
 * picture can be referenced by URLs that differ in transformation segment,
 * version, extension, or the `?_a=` analytics parameter Cloudinary appends —
 * so anything comparing two image references has to compare ids, never the
 * raw strings. Comparing strings is how an in-use image once slipped past the
 * delete guard.
 *
 * Returns null for anything that isn't a Cloudinary delivery URL, such as a
 * local `/images/...` path left over from before the migration.
 */
export function publicIdFromUrl(url: string): string | null {
  const withoutQuery = url.split(/[?#]/)[0]
  const match = withoutQuery.match(/\/upload\/(?:[^/]+\/)*?v\d+\/(.+?)(?:\.[a-z0-9]+)?$/i)
  return match ? match[1] : null
}

/**
 * True when two image references point at the same stored image.
 *
 * Falls back to an exact comparison for local paths, which have no public id.
 */
export function isSameImage(a: string, b: string): boolean {
  const idA = publicIdFromUrl(a)
  const idB = publicIdFromUrl(b)
  if (idA && idB) return idA === idB
  return a.split(/[?#]/)[0] === b.split(/[?#]/)[0]
}
