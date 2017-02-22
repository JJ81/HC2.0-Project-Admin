/**
 * Created by cheese on 2017. 2. 14..
 */

const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const async = require('async');
const Upload = require('../service/UploadService');
const uuid = require('node-uuid');
const CommonDAO = require('../RedisDAO/CommonDAO');
const Channel = {};


Channel.getListAll = (callback) => {
  connection.query(QUERY.Channel.ListAll, (err, result) => {
    callback(err, result);
  });
};

Channel.getListSpecial = (callback) => {
  connection.query(QUERY.Channel.ListSpecial, (err, result) => {
    callback(err, result);
  });
};

Channel.getListGeneral = (callback) => {
  connection.query(QUERY.Channel.ListGeneral, (err, result) => {
    callback(err, result);
  });
};

Channel.getListUnder = (callback) => {
  connection.query(QUERY.Channel.ListUnder, (err, result) => {
    callback(err, result);
  });
};

Channel.register = (req, callback) => {
  const channel_id = uuid.v1();
  const tasks = [
    
    (callback) => {
      Upload.formidable(req, (err, files, field) => {
        callback(err, files, field);
      });
    },
    
    (files, field, callback) => {
      Upload.s3Multiple(files, `${Upload.S3KYES.CHANNEL + channel_id}/`, (err) => {
        callback(err, field);
      });
    },
    
    (field, callback) => {
    	const values = {
    		channel_id: channel_id,
    		title: field.title,
    		type: field.type,
    		created_dt: new Date()
    	};
    	connection.query(QUERY.Channel.Register, values, (err, result) => {
    		callback(err, result);
    	});
    },
    
    // TODO 레디스 키 정책 나오면 진행
    // (callback) => {
    // 	CommonDAO.DeleteByKeyPattern(req.cache, 'RedisKey', (err, result)=>{
    // 		callback(err, result);
    // 	});
    // }
  ];
  
  async.waterfall(tasks, (err, result) => {
    callback(err, result);
  });
};

Channel.modify = (req, callback)=>{
  
  const tasks = [
    (callback) => {
      Upload.formidable(req, (err, files, field) => {
        // files.S3_FILE_NAME = S3_FILE_NAME;
        callback(err, files, field);
      });
    },
    
    (files, field, callback) => {
      Upload.s3Multiple(files, `${Upload.S3KYES.CHANNEL + field.channel_id}/`, (err) => {
        callback(err, field);
      });
    },
    
    (field, callback) => {
      const values = [field.title, field.type, field.channel_id];
      connection.query(QUERY.Channel.Modify, values, (err, result) => {
        callback(err, result);
      });
    },
    
    // TODO 레디스 키 정책 나오면 진행
    // (callback) => {
    // 	CommonDAO.DeleteByKeyPattern(req.cache, 'RedisKey', (err, result)=>{
    // 		callback(err, result);
    // 	});
    // }
  ];
  
  async.waterfall(tasks, (err, result) => {
    callback(err, result);
  });
  
};
Channel.registerGroup = (group_id, channel_id_list, callback) => {
  async.each(channel_id_list, (item, cb) => {
    connection.query(QUERY.Channel.RegisterGroup, ['U', group_id, item], (err, result) => {
      cb(err, result);
    });
  }, (err, result) => {
    callback(err, result);
  });
};

Channel.deleteGroup = (channel_id, callback) => {
  connection.query(QUERY.Channel.DeleteGroup, [null, 'G', channel_id], (err, result) => {
    callback(err, result);
  });
};

module.exports = Channel;