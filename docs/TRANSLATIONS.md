# Arabic / English — how the bilingual site works

The site runs at `/en/...` and `/ar/...`. English is the source of truth; Arabic
is layered on top. Anything not yet translated **falls back to English** rather
than rendering blank, so the site never breaks when new content is added.

## Where things live

| What | English | Arabic |
| --- | --- | --- |
| UI strings (nav, buttons, headings, forms) | `lib/i18n/dictionaries/en.ts` | `lib/i18n/dictionaries/ar.ts` |
| Products (names, descriptions, specs) | `lib/products.ts` | `lib/products-ar.ts` |
| Categories & subcategories | `lib/products.ts` | `lib/products-ar.ts` |
| FAQs & blog posts | `lib/content.ts` | `lib/content-ar.ts` |
| Chatbot replies & keyword matching | `lib/chatbot-content.ts` (both locales in one file) |

Supporting files:

- `lib/i18n/config.ts` — locale list, text direction, URL helpers
- `lib/catalog.ts` — merges the English catalogue with the Arabic translations
- `lib/content-i18n.ts` — picks the right FAQ/blog set for a locale
- `components/i18n-provider.tsx` — gives client components `t`, `locale`, `href()`
- `components/language-switcher.tsx` — the toggle in the header
- `proxy.ts` — redirects `/` to the visitor's language

## Adding a new product

1. Add it to `lib/products.ts` as usual (English).
2. Add a matching entry to `productTranslationsAr` in `lib/products-ar.ts`, keyed
   by the **same `id`**:

```ts
'my-new-product': {
  name: 'الاسم بالعربية',
  description: 'الوصف بالعربية',
  specs: {
    // keys are the ENGLISH spec keys from products.ts
    Material: 'الخامة بالعربية',
    Sizes: '1/4", 1/2"',   // measurements stay in Western digits
  },
},
```

If you skip step 2 the product still appears on the Arabic site — just in
English — so it's safe to ship and translate later.

## Adding a new UI string

Add the key to `en.ts` first. TypeScript will then **fail the build** until you
add the same key to `ar.ts`, which is deliberate — it stops half-translated
releases from shipping.

## Translation conventions

- Brand names stay in Latin: `Fischer`, `Shurtape`, `Aeroduct`, `GoFlex`.
- Standards codes stay in Latin: `ASTM B280`, `BS 4568`, `IEC 60900`.
- Sizes and part numbers stay in Western digits (`1/4"`, `41x41mm`) — that's what
  Kuwaiti trade documents and technicians actually use.
- Phone numbers, emails and URLs are wrapped in `.ltr-embed` so they render
  left-to-right inside Arabic text.

## RTL layout rules

- Use logical Tailwind utilities: `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
  `text-start`/`text-end`, `border-s`/`border-e`.
- Avoid `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left` unless the
  element is genuinely centered or symmetric.
- Directional icons (arrows, chevrons) need the `rtl-flip` class so they mirror.
- Arabic-specific typography lives at the bottom of `app/globals.css` under
  "Arabic / RTL support".

## SEO

Handled automatically — don't hand-maintain these:

- `hreflang` alternates (`en`, `ar`, `x-default`) on every page
- Per-locale canonical URLs
- `sitemap.xml` lists both locales with `xhtml:link` alternates
- JSON-LD schema is emitted in the page's language with `inLanguage`

## Adding a third language

1. Add the code to `locales` in `lib/i18n/config.ts` and fill in `localeConfig`.
2. Create `lib/i18n/dictionaries/<code>.ts` typed as `Dictionary`.
3. Register it in the `dictionaries` map in `lib/i18n/index.ts`.
4. Add catalogue/content translation files following the Arabic pattern.

Routing, sitemap, and hreflang pick the new locale up automatically.
