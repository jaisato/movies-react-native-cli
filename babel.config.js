module.exports = api => {
  const production = api.env('production');

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ...(production ? ['react-native-paper/babel'] : []),
      // Reanimated 2 requires its plugin to be the last one in the list,
      // after every other plugin, the production-only one above included.
      'react-native-reanimated/plugin',
    ],
  };
};
