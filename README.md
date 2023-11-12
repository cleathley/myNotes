
# myNote

This is a simple [**REACT NATIVE**](https://reactnative.dev) project which shows off a basic note taking application using context to store the notes.

The following major libraries where used for Navigation/UX;

- [React Native Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Hook Form](https://www.react-hook-form.com/)

## Environment

### React Native

- [Getting Started](https://reactnative.dev/docs/environment-setup) - **overview** of React Native and how setup your environment.

   >**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

   > The project assumes the use of [Yarn](https://classic.yarnpkg.com/) as the packagae manager.

### Project

Install all the node dependencies.

```bash
yarn install
```

Install the CoccoPods (only required for iOS development)

```bash
yarn pod:install
```

## Running the application

### For Android

```bash
yarn android
```

### For iOS

```bash
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.
