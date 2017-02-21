'use strict';
const formidable = require('formidable');
const md5 = require('md5');
const async = require('async');
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new S3Instance();
const Upload = {};

function S3Instance() {
  'use strict';
  let instance;
  S3Instance = function () {
    return instance;
  };
  instance = new AWS.S3();
  return instance
}



/**
 * AWS S3 세부 설정은
 */

const form = new formidable.IncomingForm({
	encoding: 'utf-8',
	multiples: true,
	keepExtensions: false //확장자 제거
});


/*S3 버킷 설정*/
let params = {
	Bucket: 'holdemclub',
	Key: null,
	ACL: 'public-read',
	Body: null
};

Upload.S3KYES = {
	CALENDAR: 'broadcast/calendar/',
	EVENT_RESULT: 'event/result/',
	EVENT: 'event/',
	CHANNEL: 'channel/test/',
  NEWS: 'news/'
};

Upload.formidable = (req, callback) => {
	let field;
  
	form.parse(req, (err, fields) => {
		field = fields;
	});
  
	form.on('end', function () {
		callback(null, this.openedFiles, field);
	});
  
	form.on('error', function (err) {
		callback('form.on(error) :' + err, null);
	});
  
	form.on('aborted', function () {
		callback('form.on(aborted)', null);
	});
};

Upload.s3 = (files, key, callback) => {
  
	const s3_file_name = makeS3FilesName(files);
	params.Key = key + s3_file_name;
	params.Body = require('fs').createReadStream(files[0].path);
  
  s3.upload(params, function (err, result) {
		callback(err, result, s3_file_name);
	});
};

Upload.s3Multiple = (files, key, callback) => {
	async.each(files, (file, cb) => {
		params.Key = key + file.name;
		params.Body = require('fs').createReadStream(file.path);
    
    s3.upload(params, (err, result) => {
			cb(err, result);
		});
	}, (err, result) => {
		callback(err, result);
	});
};


function makeS3FilesName(files) {
	return (md5(files[0].name + files[0].lastModifiedDate));
}
module.exports = Upload;