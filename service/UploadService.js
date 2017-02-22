'use strict';
const formidable = require('formidable');
const md5 = require('md5');
const async = require('async');
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new S3Instance();
const form = new FormidableInstance();
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


function FormidableInstance() {
  'use strict';
  let instance;
  FormidableInstance = function () {
    return instance;
  };
  instance = new formidable.IncomingForm({
    encoding: 'utf-8',
    multiples: true,
    keepExtensions: false //확장자 제거
  });
  
  return instance
}

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
  let _fields;
  
  form.parse(req, function (err, fields, files) {
    // _fields = fields
    // callback(err, fields, files);
  });
  
  
  // Form File의 Name 값으로 S3_FILE_NAME  값을 결정하다. (체널 업로드, 비디오 업로드에 사용)
  // form.on('file', (name, file) => {
  //   file.S3_FILE_NAME = name
  // });
  
  // form.on('progress', (bytesReceived, bytesExpected) => {
  //   let percent = (bytesReceived / bytesExpected * 100) | 0;
  //   // console.log(percent);
  // });
  
  // form.on('error', function(err) {
  //   callback(err, null, null);
  // });
  
  form.on('end', function () {
    callback(null, this.openedFiles, null);
  });
};

Upload.s3 = (files, key, callback) => {
  
  const s3_file_name = makeS3FilesName(files[0].name);
  params.Key = key + s3_file_name;
  params.Body = require('fs').createReadStream(files[0].path);
  
  
  s3.upload(params, function (err, result) {
   result.S3_FILE_NAME = s3_file_name;
  	callback(err, result);
  });
};

Upload.s3Multiple = (files, key, callback) => {
  async.each(files, (file, cb) => {
    params.Key = key + file.S3_FILE_NAME;
    params.Body = require('fs').createReadStream(file.path);
    
    s3.upload(params, (err, result) => {
      cb(err, result);
    });
  }, (err, result) => {
    callback(err, result);
  });
};


function makeS3FilesName(file_name) {
  return (md5(file_name + new Date()));
}
module.exports = Upload;