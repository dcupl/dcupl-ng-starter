# Dcupl Angular Starter

## Intro
This project is an Angular starter template integrating [dcupl](https://docs.dcupl.com) for client-side data filtering. It uses data and models from the **"Product Catalog"** console project. You can start by exploring the provided data and models and even create your own console project based on the Starter Catalog to update data and models as needed.

## Getting Started

Requirements: Node.js `^22.22.3`, `^24.15.0` or `>=26` (what Angular 22 supports) and npm.

```bash
npm install
npm start
```

Then open `http://localhost:4200/`. The Angular CLI ships with the project, so `npx ng <command>` (or the `npm run` scripts) works without a global install.

## Commands

* `npm start`: dev server at `http://localhost:4200/`, reloads on every change.
* `npm test`: unit tests with [Vitest](https://vitest.dev) in watch mode; `npx ng test --watch=false` runs them once.
* `npm run build`: production build into `dist/`.

## Make it yours

Point the starter at your own console project and model in four places:

1. **Project:** `src/app/services/dcupl.service.ts`. Replace `projectId` and `apiKey` in `new Dcupl({ config })` with your project's values from the [dcupl Console](https://console.dcupl.com). `applicationKey: 'default'` picks the loader configuration to load.
2. **Model:** `src/app/pages/page-catalog/page-catalog.component.ts`. Set `modelKey` in `dcupl.lists.create()` to your model. The `projection` right below resolves the `vendorId` reference for the table; name your own references there, or drop it. `PAGE_SIZE` is in `src/app/paging.ts`.
3. **Filters:** `filterDefinitions` in `src/app/components/filter-bar/filter-bar.component.ts`. One entry per filter: the `attribute`, a `label` and a `type`, either `'text'` (search within the attribute) or `'checkbox'` (one checkbox per value, with facet counts).
4. **Columns:** `columns` in `src/app/components/product-table/product-table.component.ts`. Each column has a header `label` and a `value` accessor; a missing value renders "—". Adjust the `Article` type above the component to your item shape, and the empty-state text in `product-table.component.html` to your filters.

* [dcupl Console](https://console.dcupl.com)
* [dcupl Docs](https://docs.dcupl.com)
* [dcupl.com](https://dcupl.com)

## Look and Feel

The screen uses the look of the dcupl console, built with Tailwind CSS only:

* `src/styles.css` holds:
  * the console palette as Tailwind theme tokens prefixed `dcu-`, next to Tailwind's default palette: `dcu-black-*` is an alpha scale (`-50` is solid black, `-100` to `-700` run from 4 % to 80 %), `dcu-white-50` is white, and the console's status colours `dcu-blue-*`, `dcu-yellow-*`, `dcu-green-*` and `dcu-red-*` are there for your own UI;
  * the focus ring;
  * small classes named like their console counterparts: `dcu-panel` (the card), `dcu-panel-header` (its tinted header strip), `dcu-scroll-x` (the horizontally scrolling table region), `dcu-button`, `dcu-button-black`, `dcu-button-outline`, `dcu-button-clear` and `dcu-tag`.
* The font is [Inter](https://rsms.me/inter/), self-hosted from the `@fontsource-variable/inter` package, as an open-source stand-in for the console font.
* Everything else is Tailwind utilities in the component templates.
