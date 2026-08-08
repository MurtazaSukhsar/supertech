import path from 'node:path'

import { jsonError, jsonOk, withAdmin } from '@/lib/server/api'
import { uploadImage } from '@/lib/server/media'
import { slugify } from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 10 * 1024 * 1024

/**
 * Allowed types are checked against the file's magic bytes, not the
 * browser-supplied MIME type or extension — both of which a caller controls.
 */
const SIGNATURES: { ext: string; test: (b: Buffer) => boolean }[] = [
  {
    ext: 'webp',
    test: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP',
  },
  { ext: 'png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { ext: 'jpg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: 'gif', test: (b) => b.subarray(0, 3).toString() === 'GIF' },
  { ext: 'svg', test: (b) => b.subarray(0, 512).toString().trimStart().startsWith('<svg') },
]

export const POST = withAdmin(async (request) => {
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return jsonError('No file was uploaded.')
  if (file.size === 0) return jsonError('That file is empty.')
  if (file.size > MAX_BYTES) return jsonError('Images must be 10 MB or smaller.')

  const buffer = Buffer.from(await file.arrayBuffer())
  if (!SIGNATURES.some((sig) => sig.test(buffer))) {
    return jsonError('Unsupported file. Use WebP, PNG, JPG, GIF, or SVG.')
  }

  const name = slugify(path.parse(file.name).name) || 'image'
  const stored = await uploadImage(buffer, name)

  return jsonOk({ path: stored.url, publicId: stored.publicId })
})
