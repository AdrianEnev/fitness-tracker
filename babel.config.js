module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
              'module-resolver',
              {
                alias: {
                    '@app': './app',
                    '@components': './app/components',
                    '@config': './config',
                    "@screens": './app/screens',
                    "@use/*": '@use',
                    "@modals/*": './app/modals',
                    "@assets/*": 'assets',
                }
              }
            ]
        ]
    };
  };