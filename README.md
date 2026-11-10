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

## Loading Your Own Data
To load data from the dcupl CDN, open the `dcupl.service.ts` file. You’ll find the **projectId** and **apiKey** fields there, which are used to configure and authenticate the data load process. Update these fields with your own project's **projectId** and **apiKey** once you've set up a new console project.

* [dcupl Console](https://console.dcupl.com)
* [dcupl Docs](https://docs.dcupl.com)
* [dcupl.com](https://dcupl.com)

## Look and Feel

The screen uses the look of the dcupl console, built with Tailwind CSS only:

* `src/styles.css` holds the console palette as Tailwind theme tokens prefixed `dcu-`, next to Tailwind's default palette (`dcu-black-*` is an alpha scale with `-50` as solid black, plus `dcu-white-50` and the status colours `dcu-blue-*`, `dcu-yellow-*`, `dcu-green-*`, `dcu-red-*`), the focus ring and five small classes named like their console counterparts (`dcu-button`, `dcu-button-black`, `dcu-button-outline`, `dcu-button-clear`, `dcu-tag`).
* The font is [Inter](https://rsms.me/inter/), self-hosted from the `@fontsource-variable/inter` package, as an open-source stand-in for the console font.
* Everything else is Tailwind utilities in the component templates.

# Angular Readme Part

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 18 and updated to Angular 22 (zoneless) with dcupl SDK 2.1.

## Development server

Run `npm start` (or `npx ng serve`) for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `npx ng generate component component-name` to generate a new component. You can also use `npx ng generate directive|pipe|service|class|guard|interface|enum`.

## Build

Run `npm run build` (or `npx ng build`) to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests with [Vitest](https://vitest.dev) (`npx ng test --watch=false` for a single run).

## Further help

To get more help on the Angular CLI use `npx ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
