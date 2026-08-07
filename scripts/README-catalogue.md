# Regenerating the product catalogue PDF

The catalogue is built from the live product data in `lib/products.ts`, so it
never drifts from the website. Regenerating is two steps.

## 1. Export the data

`lib/products.ts` is TypeScript, so it can't be read by Python directly. Node
can strip the types and export the real objects:

```bash
mkdir -p /tmp/cat/lib
cp lib/products.ts lib/product-storage.ts /tmp/cat/lib/

# Node's ESM resolver needs explicit extensions, and a value import of a
# type-only symbol has to be split out.
sed -i "s#from './product-storage'#from './product-storage.ts'#" /tmp/cat/lib/products.ts
sed -i "s#import { products as staticProducts, Product } from './products'#import { products as staticProducts } from './products.ts'\nimport type { Product } from './products.ts'#" /tmp/cat/lib/product-storage.ts

cat > /tmp/cat/extract.mjs <<'JS'
import fs from 'node:fs'
const { products, categories, contactInfo } = await import('./lib/products.ts')
fs.writeFileSync('/tmp/cat/data.json', JSON.stringify({ contactInfo, categories, products }, null, 2))
console.log(`${products.length} products, ${categories.length} categories`)
JS

cd /tmp/cat && node --experimental-strip-types extract.mjs
```

## 2. Build the PDF

```bash
pip install reportlab pillow          # once
python3 scripts/build-catalogue-pdf.py /tmp/cat/data.json Super-Tech-Product-Catalogue.pdf
```

## Layout

| Element | Detail |
|---|---|
| Page size | A4 portrait |
| Structure | Cover → one section per category → back cover |
| Grid | 4 products per page (2 × 2) |
| Per product | Photo, brand chip, name, description, up to 4 specs |
| Branding | Navy `#00267C` / red `#EE0009`, sampled from the logo |

## Notes

- **Images are downsampled to 700px and re-encoded as JPEG.** Embedding the
  originals produced a 45 MB file; this keeps it under 3 MB, which matters
  because the catalogue is meant to be emailed. Print quality is unaffected —
  a card photo is only about 75mm wide.
- **Spec tables are anchored to the bottom of each card**, not flowed from the
  description. Products carry between 2 and 4 specs, and flowing them left a
  different amount of dead space under every card.
- **The `Brand` spec is skipped** in the table because it already appears as
  the chip above the product name.
- Long names, descriptions and spec values are truncated on a word boundary
  rather than shrunk, so type size stays consistent across the document.
