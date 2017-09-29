module.exports = {
  entry : './index.ts',
  output: {
    filename: './index.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
}
