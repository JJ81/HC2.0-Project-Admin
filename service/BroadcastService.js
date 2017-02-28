/**
 * Created by cheese on 2017. 2. 2..
 */
const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const async = require('async');
const Upload = require('../service/UploadService');
const Broadcast = {};

Broadcast.onLive = (link, callback) => {
  const _obj = {
    start_dt: new Date(),
    end_dt: null,
    status: 1,
    link: link
  };
  connection.query(QUERY.Broadcast.LiveOn, _obj, (err) => {
    callback(err);
  });
};

Broadcast.endLive = (id, callback) => {
  connection.query(QUERY.Broadcast.LiveEnd, [new Date(), id], (err) => {
    callback(err);
  });
};

Broadcast.getLiveList = (callback) => {
  connection.query(QUERY.Broadcast.LiveGetList, (err, result) => {
    callback(err, result);
  });
};

Broadcast.getCalendarList = (callback) => {
  connection.query(QUERY.Broadcast.CalendarList, (err, result) => {
    callback(err, result);
  });
  
};

Broadcast.registerCalendar = (req, callback) => {
  
  const tasks = [
    (callback) => {
      Upload.formidable(req, (err, files, fields) => {
        callback(err, files, fields);
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
    		created_dt :new Date()
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

Broadcast.deleteCalendar = (id, callback) => {
  /*TODO 추후에 S3삭제 로직 추가*/
  connection.query(QUERY.Broadcast.CalendarDelete, [id], (err, result) => {
    callback(err, result);
  });
};


module.exports = Broadcast;