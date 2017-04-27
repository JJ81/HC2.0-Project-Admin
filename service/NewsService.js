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

      UploadService.formidable(req, (err, files, fields) => { // 이 때 에러가 나도 캐치를 할 수가 없다!
        if(err){
	        console.log(err);
        }
        callback(err, files, fields);
      });
    },
    
    (files, fields, callback) => {
      UploadService.optimize(files, (err) => {
        callback(err, files, fields)
      });
    },
    
    (files, fields, callback) => {
      UploadService.s3(files, UploadService.S3KYES.NEWS, (err, file_name) => {
        callback(err, file_name, fields)
      })
    },

    (file_name, fields, callback) => {
      console.log('fields data');
      // console.log(fields);

      var direction = (fields.direction === 'external') ? 'EX' : 'IN';

      console.log(direction);

      const values = {
        title: fields.title,
        sub_title: fields.sub_title,
        desc: fields.desc,
        contents: fields.contents,
        thumbnail: file_name.S3_FILE_NAME,
        link: fields.link,
        direction
      };

      connection.query(QUERY.News.Register, values, (err, result) => {
        if(!err){
	        callback(null, result);
        }else{
          console.error(err);
	        callback(err, null);
        }
      });
    }
  ];
  
  async.waterfall(tasks, (err, result) => {
    if(!err){
	    callback(null, result);
    }else{
      console.error(err);
	    callback(err, null);
    }
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

News.modify = (req, callback) =>{
  const method = (req.body.active === undefined) ? false : active(req, callback);
};

function active(req, callback) {
  connection.query(QUERY.News.ActiveById, [req.body.active, req.body.id], (err, result)=>{
    callback(err, result);
  });
}

module.exports = News;