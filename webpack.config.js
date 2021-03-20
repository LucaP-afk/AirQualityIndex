  const Dotenv = require('dotenv-webpack')
  const path = require('path')

  module.exports = (env, argv) => {
    const entryPath = argv.mode === 'development' ? './src/JS/index_dev.js' : './src/JS/index.js'
    return {
      entry: {
        main: path.resolve(__dirname, entryPath),
      },
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      },
      module: {
            rules: [
              {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
              },
            ],
          },
      devServer: {
        contentBase: './dist',
        open: true
      },
      plugins: [
        new Dotenv()
      ],
    }
};