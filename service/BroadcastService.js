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
    if (!err) {
      callback(null, {success: true, msg: '생방송 등록 완료'});
    } else {
      callback(err, {success: false, msg: '다시 시도해주세요'});
    }
  });
};

Broadcast.endLive = (id, callback) => {
  connection.query(QUERY.Broadcast.LiveEnd, [new Date(), id], (err) => {
    if (!err) {
      callback(null, {success: true, msg: '생방송 종료 완료'});
    } else {
      callback(err, {success: false, msg: '다시 시도해주세요'});
    }
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

Broadcast.uploadCalendar = (req, callback) => {
  
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
    (file_name, field, callback) => {
    	const _obj = {
    		title: field.link,
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