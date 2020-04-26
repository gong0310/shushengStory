module.exports={
  devServer: {
      proxy: {
        "/api/chapter": {
          target: "https://chapter2.zhuishushenqi.com",
          changeOrigin: true,
          pathRewrite: {
            "^/api": ""
          }
        },
        "/api": {
          target: 'http://api.zhuishushenqi.com',
          changeOrigin: true,
          pathRewrite: {
            "^/api": ""
          }
        }
      }
    },

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
