module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  project: {
    android: {
      sourceDir: './android',
      // manifestPath: './android/app/src/main/AndroidManifest.xml',
    },
  },
  assets: ['./src/assets/fonts/'],
};
