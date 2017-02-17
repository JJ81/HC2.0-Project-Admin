/**
 * s3에 대한 접근 권한 및 설정은 root/.aws/credentials 에서 확인
 */

const
	AWS = require('aws-sdk'),
	s3 = new AWS.S3(),
	S3Service = {};

AWS.config.region = 'ap-northeast-2'; //리존 서울 설정

const params = {
	Bucket: 'holdemclub',
	Key: null,
	ACL: 'public-read',
	Body: null
};

S3Service.s3Upload = (file_path, key, callback) => {
	params.Key = key;
	params.Body = require('fs').createReadStream(file_path);
    
	s3.upload(params, function(err, data){
		callback(err, data);
	});
};


module.exports = S3Service;