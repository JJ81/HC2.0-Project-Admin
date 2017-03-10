const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const async = require('async');
const Upload = require('../service/UploadService');
const Banner = {};

Banner.register = (req, callback) => {
  const tasks = [
    (callback) => {
      Upload.formidable(req, (err, files, fields) => {
        callback(err, files, fields);
      });
    },
    
    (files, fields, callback) => {
      Upload.optimize(files, (err) => {
        callback(err, files, fields)
      });
    },
    
    (files, fields, callback) => {
      Upload.s3(files, Upload.S3KYES.CALENDAR, (err, file_name) => {
        
        callback(err, file_name, fields);
      });
    },
    (file_name, fields, callback) => {
      const _obj = {
        title: fields.link,
        img_name: file_name.S3_FILE_NAME,
        created_dt: new Date()
      };
      connection.query(QUERY.Broadcast.CalendarWrite, _obj, (err, result) => {
        callback(err, result);
      });
    }
  ];
  
  async.waterfall(tasks, (err, result) => {
    callback(err, result);
  });
};
