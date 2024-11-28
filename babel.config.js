module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['module:@react-native/babel-preset', {jsxImportSource: 'nativewind'}],
      'nativewind/babel',
    ],
    plugins: [
      '@babel/plugin-transform-export-namespace-from',
      'react-native-reanimated/plugin',
      // [
      //   'module:react-native-dotenv',
      //   {
      //     path: '.env',
      //     moduleName: '@env',
      //   },
      // ],
    ],
  };
};
