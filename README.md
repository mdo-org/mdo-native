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

### Running the app on a virtual iOS device

1. Install [Xcode through the Apple App Store](https://apps.apple.com/app/xcode/id497799835)
2. Open a simulator from `Xcode -> Open Developer Tool -> Simulator`
3. On the terminal tab where you started the expo server, type `i`. The expo server will then install Expo on the virtual device and start your app.

### Debugging

Follow Expo's instructions for [Debugging Redux](https://docs.expo.io/versions/v33.0.0/workflow/debugging/#debugging-redux).

### Linting / Formatting Code

This project is configured to run [prettier](https://github.com/prettier/prettier) when you do a `git add` (using [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged)), so you don't need to worry about formatting code.

However, we still use [eslint](https://eslint.org/) to capture syntax errors. The `.eslintrc.json` file is set to extend [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier), so eslint will only report on syntax errors instead of enforcing formatting.

Note:  
Some editors will fail to load eslint from a pacakage's subdirectory, and will
default to the global eslint - which might not have all the plugins you need.

If that happens, you'll need to manually specify the path to the correct `eslint`.

In my case, I had to create a local `.vimrc` file with:

```
let g:syntastic_javascript_eslint_exec='/path/to/mdo-native/node_modules/.bin/eslint'
```

## UI Library

MDo Native is using [React Native Paper](https://callstack.github.io/react-native-paper/) as the UI library.

## Architecture

MDoNative is built as a Redux app, using the [Redux Starter Kit](https://redux-starter-kit.js.org)

We use the following folder structure

```
src/                    // top-level directory for javascript files
  components/           // all "presentational components" (no redux) live here
  lib1/                 // non-redux libraries live in their own directory below `src/`
  lib2/                 // example: "Dropbox/", "MDo/"
  redux/
      reducer.js        // this is your "root" reducer. Runs `combineReducer()` on your other reducers.
      containers/       // all "container components" live here. They have the same name as their "presentational" counterpart.
      slice1/           // every "slice" owns a field in the redux state tree. The dir name should match the field name.
      slice2/           // slice folders should export: a single `reducer`, one or more actions, and one or more selectors
```

Some rules we follow:

- Presentational components have no concept of Redux, they receive all data as props.
- Container components are not allowed to query the Redux state directly. They should always use selectors.
  This allows modifying the state structure without breaking components.

## Publishing the app

I'm using the expo cli to publish the app.

More info: https://docs.expo.io/versions/v33.0.0/distribution/building-standalone-apps/

The first step is to generate the APK:

```
expo build:android
```

Once the APK is installed on a device, updates can be pushed by running:

```
expo publish
```

Once a new version is published, users will download the new JS the next time
they open the app.

Note: On the first build, Expo generated a keystore for signing the app. I copied
the generated `mdo.jks` to my [dotfiles repo](https://github.com/alexishevia/.dotfiles/blob/master/encrypted.sh)
in case I ever need it. I also copied the "Keystore password", "Key alias", and
"Key password" values to my LastPass vault.
