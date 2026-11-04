<div align="center">

<h1>react-native-shadery</h1>

[![npm version](https://img.shields.io/npm/v/react-native-shadery.svg?style=flat-square)](https://www.npmjs.com/package/react-native-shadery)
[![npm downloads](https://img.shields.io/npm/dm/react-native-shadery.svg?style=flat-square)](https://www.npmjs.com/package/react-native-shadery)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

GPU shader components for React Native: animated orbs, backgrounds, borders and effects,
rendered at 60fps with Skia shaders and Reanimated. Each component is its own entry point,
so your app only ships the ones it imports.

</div>

> **Status: early development.** No components yet; the shared shader core, example gallery and
> test harness are in place. The first components are on their way.

## 📦 Prerequisites

This library requires the following peer dependencies to be installed in your project:

- [`@shopify/react-native-skia`](https://shopify.github.io/react-native-skia/) — provides the GPU-accelerated canvas and shader runtime
- [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) — drives the per-frame animation loop at 60fps
- [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/) — required by Reanimated 4 to run the animation on the UI thread

Tested with Expo SDK 58, React Native 0.88, Skia 2.14, Reanimated 4.7 and Worklets 0.13.

## 🔧 Installation

### Expo

```sh
npx expo install react-native-shadery @shopify/react-native-skia react-native-reanimated react-native-worklets
```

`npx expo install` picks the Skia, Reanimated and Worklets versions that match your Expo SDK. No extra setup is needed: `babel-preset-expo` already configures Reanimated. It works in Expo Go as well as in development builds.

### Bare React Native

```sh
npm install react-native-shadery @shopify/react-native-skia react-native-reanimated react-native-worklets
```

Add the Worklets Babel plugin to `babel.config.js`. It must be the last plugin:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};
```

Then install the iOS pods and rebuild the app:

```sh
cd ios && pod install
```

## 🧩 Components

Import each component from its own entry point (e.g. `react-native-shadery/<name>`), or
everything from `react-native-shadery`.

| Component | Import | Description |
|---|---|---|

_None yet._

## 🤝 Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Adding a component](CONTRIBUTING.md#adding-a-component)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
