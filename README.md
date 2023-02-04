# [Studio Vuetify ]( https://github.com/donghyuck/studio-vuetify )
![version](https://img.shields.io/badge/version-0.0.2-blue.svg)

This project using A free Vuetify 3 theme.
**Vite Theme Free** is a beautiful resource built over [Vite](https://vitejs.dev/guide/), [Vuetify 3](https://next.vuetifyjs.com/en/) and [Vuejs 3](https://vuejs.org/). It will help you get started and quickly developing your Vuetify 3 Vite applications in no time. Using the Vite theme is pretty simple but requires basic knowledge of Javascript, [Vuejs](https://vuejs.org/v2/guide/) and [Vite](https://vitejs.dev/guide/).

## Getting Started

- Install Nodejs from the official [Nodejs page](https://nodejs.org/en/)
- Install Yarn from the official [Yarn installation page](https://classic.yarnpkg.com/en/docs/install/#windows-stable).
- Run `yarn install` to install the project's dependencies
- Run `yarn dev` to start a local development server

You can also run additional tasks such as

- `yarn run build` to build your app for production
- `yarn run serve` to serve your production app
- `yarn run lint` to run linting.

## Vuetify

Vuetify is an Open Source UI Library that is developed exactly according to Material Design spec. Every component is handcrafted to bring you the best possible UI tools to your next great app. The development doesn't stop at the core components outlined in Google's spec. Through the support of community members and sponsors, additional components will be designed and made available for everyone to enjoy.

The documentation for **Vuetify** is hosted [here](https://vuetifyjs.com/).

***Not all components that are available in this project are part of the theme and may be a default Vuetify component***

## Vite

Vite is a build tool that significantly improves the front-end development experience. You can use Vite to set up a development environment for frameworks like Vue and React, and even for a vanilla JavaScript app with a dev server and hot reloading in just three commands. It also easily integrates with [TypeScript](https://vitejs.dev/guide/features.html#typescript).

## Vue-cli

We use the latest 3.x [Vue CLI](https://github.com/vuejs/vue-cli) which aims to reduce project configuration
to as little as possible. Almost everything is inside `package.json` + some other related files such as
`.babel.config.js`, `.eslintrc.js` and `.postcssrc.js`.

Let us know what you think and what we can improve below. And good luck with development!

## Table of Contents
 
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [File Structure](#file-structure)
- [Browser Support](#browser-support)
- [Resources](#resources)
- [Reporting Issues](#reporting-issues)
- [Technical Support or Questions](#technical-support-or-questions)
- [Licensing](#licensing)
- [Useful Links](#useful-links)

 
## File Structure

Within the download you'll find the following directories and files:

<details>

```txt
studio-vuetify/

┣ public/
┃ ┗ favicon.ico
┣ script/
┃ ┗ postversion.cjs
┣ src/
┃ ┗ assets/
┃ ┃ ┗ img/
┃ ┃    ┗  no-avatar.png
┃ ┣ layouts/
┃ ┃ ┣  footers/
┃ ┃ ┃  ┗ FooterDefault.vue
┃ ┃ ┗  navvers/
┃ ┃ ┃  ┣ NavbarDefault.vue
┃ ┃ ┃  ┣ ThemeToggle.vue
┃ ┃ ┃  ┗ UserProfileMenu.vue
┃ ┣ plugins/
┃ ┃ ┃  index.ts
┃ ┃ ┃  vuetify.ts
┃ ┃ ┗  webfontloader.ts
┃ ┣ router/
┃ ┃ ┣  accounts.router.ts
┃ ┃ ┗  index.ts
┃ ┣ store/
┃ ┃ ┣  alert.store.ts 
┃ ┃ ┣  auth.store.ts 
┃ ┃ ┣  prefs.store.ts 
┃ ┃ ┣  unsplash.ts
┃ ┃ ┗  user.store.ts
┃ ┣ util/
┃ ┃ ┗  helpers.ts
┃ ┣ views/
┃ ┃ ┣  Index.vues
┃ ┃ ┣  Login.vues
┃ ┃ ┗  Today.vue
┃ ┣ App.vue
┃ ┗ main.js
┣ .editorconfig
┣ .gitignore
┣ index.html
┣ package.json
┣ README.md
┣ tsconfig.app.json
┣ tsconfig.config.json
┣ tsconfig.json
┣ tsconfig.vitest.json
┣ vite.config.js
┗ yarn.lock
```

</details>

## Browser Support

| Browser | Status |
| - | - |
| Chromium (Chrome, Edge) | ✅ Supported * |
| Firefox | ✅ Supported * |
| Safari 15.4+ | ✅ Supported |
| Safari 13. | ❗ Requires polyfill |
| Edge <79 | ⛔ Not supported |
| Internet Explorer | ⛔ Not supported |

## Resources
 
- Product Page: [Product](https://github.com/donghyuck/studio-vuetify)
- Vuetify Documentation is [Here](https://vuetifyjs.com/)
- License Agreement: [License](https://store.vuetifyjs.com/licenses)
- Issues: [Github Issues Page](https://github.com/donghyuck/studio-vuetify/issues)

## Reporting Issues

We use GitHub Issues as the official bug tracker for the **Studio Vuetify**. Here is some advice for our users that want to report an issue:

1. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
2. Some issues may be browser specific, so specifying what browser you encountered the issue will be helpful.

## Technical Support or Questions

If you have questions or need help integrating the product please reach out in file an issue [here](https://github.com/donghyuck/studio-vuetify/issues).

## Licensing
- Copyright 2022 Vuetify <https://vuetifyjs.com>
- Vuetify [License Information](https://github.com/vuetifyjs/vuetify/blob/master/LICENSE.md)

## Useful Links
- [Vuetify Documentation](https://vuetifyjs.com/) 
