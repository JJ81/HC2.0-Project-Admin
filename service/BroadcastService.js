/**
 * Created by cheese on 2017. 2. 2..
 */
const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	async = require('async'),
	Upload = require('../service/UploadService'),
	Broadcast = {};



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

Broadcast.getCalendarList = (callback) =>{
	connection.query(QUERY.Broadcast.CalendarList, (err, result) => {
		callback(err, result);
	});
    
};

Broadcast.uploadCalendar = (req, callback) => {
    /**
     * @tasks_작업_순서
     *      1.formidable 파일 업로드
     *      2.S3 업로드 (formidable 업로드한 파일을 다시 S3에 업로드)
     *      3. 데이터베이스에 저장
     *
     */
	const tasks = [
		(callback) => {
			Upload.formidable(req, (err, files, field) => {
				callback(err, files, field);
			});
		},
		(files, field, callback) => {
			Upload.s3(files, Upload.S3KYES.CALENDAR, (err, result, s3_file_name) => {
				callback(err, s3_file_name, field);
			});
		},
		(s3_file_name, field, callback) => {
			const _obj = {
				title: field.link,
				img_name: s3_file_name,
				created_dt :new Date()
			};
			connection.query(QUERY.Broadcast.CalendarWrite, _obj, (err, result) => {
				callback(err, result);
			});
		}
	];
    
	async.waterfall(tasks, (err) => {
		if (!err) {
			callback(null, {success: true, msg: '방송표 업로드 완료'});
		} else {
			callback(err, {success: false, msg: '다시 시도해주세요'});
		}
	});
};

Broadcast.deleteCalendar = (id, callback) => {
    /*TODO 추후에 S3삭제 로직 추가*/
	connection.query(QUERY.Broadcast.CalendarDelete, [id], (err, result)=>{
		callback(err, result);
	});
};




module.exports = Broadcast;