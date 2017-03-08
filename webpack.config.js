'use strict';
const webpack = require('webpack');
const entry_js_path = `${__dirname}/public/javascripts/`;
const entry_com_path = `${__dirname}/public/components/`;
// const entry_gentelella = `${__dirname}/public/components/gentelella/`;

module.exports = {
  entry: {
    app: `${entry_js_path}app.js`,
    require: `${entry_com_path}requirejs/require.js`,
    bc_calendar: `${entry_js_path}bc_calendar.js`,
    bc_live: `${entry_js_path}bc_live.js`,
    channel: `${entry_js_path}channel.js`,
    channel_group: `${entry_js_path}channel_group.js`,
    // common: `${entry_js_path}common.js`,
    contents: `${entry_js_path}contents.js`,
    contents_rt: `${entry_js_path}contents_rt.js`,
    event: `${entry_js_path}event.js`,
    event_result: `${entry_js_path}event_result.js`,
    news: `${entry_js_path}news.js`,
    video_list: `${entry_js_path}video_list.js`,
    video_view: `${entry_js_path}video_view.js`,
    // jquery: `${entry_gentelella}vendors/jquery/dist/jquery.js`,
    // bootstrap: `${entry_gentelella}vendors/bootstrap/dist/js/bootstrap.js`,
    // custom: `${entry_gentelella}build/js/custom.js`,
    // jqueryForm: `${entry_com_path}jquery-form/jquery.form.js`,
    // videoJS : `${entry_com_path}video.js/dist/video.js`,
    // videoJSYoutube : `${entry_com_path}videojs-youtube/dist/Youtube.js`
  },
  output: {
    filename: '[name].js',
    path: './public/dist',
  },
  
  resolve: {
    extensions: ['', '.js', '.css']
  },
  
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunks: 3,
      chunks: []
    })
  ],
  module: {
    // preLoaders: [
    //   {
    //     test: /\.js$/,
    //     loader: 'eslint',
    //     exclude: /(node_modules|bower_components)/
    //   }
    // ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        },
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  },
  
  

// devServer: {
//   contentBase: './',
//   compress: true,
//   port: 9000
// },
}
;