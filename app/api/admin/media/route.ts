import { jsonError, jsonOk, withAdmin } from '@/lib/server/api'
import { deleteImage, isSameImage, listImages, publicIdFromUrl } from '@/lib/server/media'
import { getBlog, getCategories, getProducts, getSite } from '@/lib/server/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Everything in the Cloudinary folder, for the "choose existing" picker. */
export const GET = withAdmin(async () => {
  const stored = await listImages()
  return jsonOk({ images: stored.map((image) => image.url) })
})

/**
 * Delete an image, but only if nothing on the site still points at it.
 *
 * Every place an image can be referenced has to be checked here, or the panel
 * hands the user a button that silently breaks a page: products, categories,
 * site settings, and blog post headers all hold image paths.
 */
export const DELETE = withAdmin(async (request) => {
  const target = new URL(request.url).searchParams.get('path')
  if (!target) return jsonError('Missing image path.')

  const [products, categories, site, blogEn, blogAr] = await Promise.all([
    getProducts(),
    getCategories(),
    getSite(),
    getBlog('en'),
    getBlog('ar'),
  ])

  // Compared by public id, not by URL string: the same image is referenced by
  // URLs that differ in transformation, version, and the `?_a=` parameter
  // Cloudinary appends, so a string match would let an in-use image through.
  const usedByProduct = products.find((product) =>
    product.images.some((image) => isSameImage(image, target)),
  )
  if (usedByProduct) return jsonError(`Still used by the product "${usedByProduct.name}".`)

  const usedByCategory = categories.find((category) => isSameImage(category.image, target))
  if (usedByCategory) return jsonError(`Still used by the category "${usedByCategory.name}".`)

  if (Object.values(site.images ?? {}).some((image) => isSameImage(image, target))) {
    return jsonError('Still used in site settings.')
  }

  const usedByPost = [...blogEn, ...blogAr].find((post) => isSameImage(post.image, target))
  if (usedByPost) return jsonError(`Still used by the blog post "${usedByPost.title}".`)

  const publicId = publicIdFromUrl(target)
  if (!publicId) {
    return jsonError(
      'That image is a local file, not a Cloudinary upload — delete it from public/images instead.',
    )
  }

  await deleteImage(publicId)
  return jsonOk({ deleted: target })
})
