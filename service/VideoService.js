/**
 * Created by cheese on 2017. 2. 14..
 */
const
  mysql_dbc = require('../commons/db_conn')(),
  connection = mysql_dbc.init(),
  QUERY = require('../database/query'),
  async = require('async'),
  Upload = require('../service/UploadService'),
  CommonDAO = require('../RedisDAO/CommonDAO'),
  uuid = require('node-uuid'),
  Video = {};


Video.getList = (channel_id, callback) => {
  connection.query(QUERY.Video.List, channel_id, (err, result) => {
    callback(err, result);
  });
};

Video.getListByTitle = (title, callback) => {
  connection.query(QUERY.Video.ListByTitle, `%${title}%`, (err, result) => {
    callback(err, result);
  });
};

Video.view = (video_id, callback) => {
  connection.query(QUERY.Video.View, video_id, (err, result) => {
    callback(err, result);
  });
};

Video.active = (video_id, active, callback) =>{
  connection.query(QUERY.Video.Active, [active, video_id], (err, result)=>{
    callback(err, result);
  });
};

Video.register = (req, callback) => {

  // 넘어온 데이터를 확인한다

	var info = {
		channel_id : req.body.channel_id,
		title : req.body.title,
		link : req.body.link
	};


  const video_id = uuid.v1();
  const tasks = [
    (callback) => {
      Upload.formidable(req, (err, files, field) => {
        callback(err, files, field);
      });
    },
    
    (files, field, callback) => {
      Upload.optimize(files, (err) => {
        callback(err, files, field);
      });
    },
    
    (files, field, callback) => {
      Upload.s3Multiple(files, `${Upload.S3KYES.CHANNEL + field.channel_id}/${video_id}/`, (err) => {
        callback(err, field);
      });
    },
    
    (field, callback) => {

  	  console.log('check link');
  	  console.log(field);

      const values = {
        channel_id: field.channel_id,
        video_id,
        title: field.title,
        link: field.link,
				type : 'Y',
				active : true
      };
      
      connection.query(QUERY.Video.Register, values, (err, result) => {
        callback(err, result);
      });
    }
  ];
  
  async.waterfall(tasks, (err, result) => {
    // 업로드된 파일을 제거
	  Upload.RemovieFile();
    callback(err, result);
  });
};


Video.registerTest = (req, callback) => {
	// 넘어온 데이터를 확인한다

	// var info = {
	// 	channel_id : req.body.channel_id,
	// 	title : req.body.title,
	// 	link : req.body.link
	// };

	// const video_id = uuid.v1();
	//
	// console.info('check first file');
	// console.info(req);

	const tasks = [
		(callback) => {
			Upload.formidable(req, (err, files, field) => {
				console.info('formidable files');
				console.info(files);
				console.info(field);

				callback(err, files, field);
			});
		},

		(files, field, callback) => {
			Upload.optimize(files, (err) => {
				console.info('optimizing files');
				console.info(files);
				console.info(field);
				callback(err, files, field);
			});
		},

		(files, field, callback) => {
			Upload.s3(files, `${Upload.S3KYES.TEST}`, (err) => {
				console.info('upload files into S3 TEST folder : ' + Upload.S3KYES.TEST);
				console.info(files);
				console.info(field);
				callback(err, field);
			});
		}

		// ,(field, callback) => {
		//
		// 	console.log('check link');
		// 	console.log(field);
		//
		//
		//
		// 	// const values = {
		// 	// 	channel_id: field.channel_id,
		// 	// 	video_id,
		// 	// 	title: field.title,
		// 	// 	link: field.link,
		// 	// 	type : 'Y',
		// 	// 	active : true
		// 	// };
		// 	//
		// 	// connection.query(QUERY.Video.Register, values, (err, result) => {
		// 	// 	callback(err, result);
		// 	// });
		// }
	];

	async.waterfall(tasks, (err, result) => {
		// 업로드 파일을 제거
		Upload.RemovieFile();
		callback(err, result);
	});
};

Video.modify = (req, callback) => {
  
  const tasks = [
    
    (callback) => {
      Upload.formidable(req, (err, files, fields) => {
        callback(err, files, fields);
      })
    },
    
    (files, fields, callback) => {
      Upload.optimize(files, (err) => {
        callback(err, files, fields);
      });
    },
    
    (files, fields, callback) => {
      Upload.s3Multiple(files, `${Upload.S3KYES.CHANNEL + fields.channel_id}/${fields.video_id}/`, (err) => {
        callback(err, fields);
      });
    },
    
    (fields, callback) => {
      connection.query(QUERY.Video.Modify, [fields.title, fields.video_id], (err, result) => {
        callback(err, result);
      })
    }
  ];
  
  async.waterfall(tasks, (err, result) => {
    callback(err, result);
  });
};

module.exports = Video;