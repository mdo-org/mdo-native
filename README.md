# MDoNative

React Native app for [MDo](https://mdo-org.github.io/mdo/).

## Getting Started

1. Install [Node.js](https://nodejs.org/) (v10.15.0 preferred)
2. Start the expo server with `npm install && npm start`.

### Running the app on your phone

1. Install the [Expo app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) on your phone.
2. Using the Expo app on your phone, scan the provided QR code and wait until the app is loaded.

### Running the app on a virtual android device

1. Install [Android Studio](https://developer.android.com/studio)
2. Open "AVD Manager" from `Android studio > Configure > AVD Manager`
3. Create and start a new Virtual Device
4. On the terminal tab where you started the expo server, type `a`. The expo server will then install Expo on the virtual device and start your app.

Note: to "shake" your android virtual device, press `Ctrl + m` (on Linux). You'll see the React Native dev menu pop up.

### Linting / Formatting Code

This project is configured to run [prettier](https://github.com/prettier/prettier) when you do a `git add` (using [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged)), so you don't need to worry about formatting code.

However, we still use [eslint](https://eslint.org/) to capture syntax errors. The `.eslintrc.json` file is set to extend [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier), so eslint will only report on syntax errors instead of enforcing formatting.

Note:  
Some editors will fail to load eslint from a pacakage's subdirectory, and will default to the global eslint - which might not have all the plugins you need.

If that happens, you'll need to manually specify the path to the correct `eslint`.

In my case, I had to create a local `.vimrc` file with:

```
let g:syntastic_javascript_eslint_exec='/path/to/mdo-native/node_modules/.bin/eslint'
```
