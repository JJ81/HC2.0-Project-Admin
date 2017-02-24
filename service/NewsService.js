/**
 * Created by cheese on 2017. 2. 16..
 */
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const async = require('async');
const UploadService = require('../service/UploadService');
const News = {};

News.register = (req, callback) => {
  
  const tasks = [
    (callback) => {
      UploadService.formidable(req, (err, files, fields) => {
        callback(err, files, fields);
      });
    },
    
    (files, fields, callback) => {
      UploadService.s3(files, UploadService.S3KYES.NEWS, (err, file_name)=>{
        callback(err, file_name, fields)
      })
    },
    (file_name, fields, callback)=>{
      const values ={
        title : fields.title,
        sub_title : fields.sub_title,
        desc : fields.desc,
        contents : fields.contents,
        thumbnail : file_name.S3_FILE_NAME,
      };
      connection.query(QUERY.News.Register, values, (err, result) => {
        callback(err, result);
      });
    }
  ];
  
  async.waterfall(tasks, (err, result)=>{
    callback(err, result);
  });
  
};

News.delete = (id, callback) => {
  connection.query(QUERY.News.DeleteById, id, (err, result) => {
    callback(err, result);
  });
};

News.getListAll = (callback) => {
  connection.query(QUERY.News.ListAll, (err, result) => {
    callback(err, result);
  });
};

module.exports = News;