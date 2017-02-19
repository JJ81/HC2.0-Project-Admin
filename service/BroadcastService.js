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
	connection.query(QUERY.Broadcast.LiveOn, _obj, (err, result) => {
		if (!err) {
			callback(null, {success: true, msg: '생방송 등록 완료'});
		} else {
			callback(err, {success: false, msg: '다시 시도해주세요'});
		}
	});
};

Broadcast.endLive = (id, callback) => {
	connection.query(QUERY.Broadcast.LiveEnd, [new Date(), id], (err, result) => {
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
     *     TODO 4. 업로드된 파일삭제(S3 파일이 정상적으로 업로드되면 로컬에 남아있는 파일을 삭제한다.) 이건 공통로직이니 Common Server 에 작성해야 될까???
     *     TODO 추가 작업 이미지 최적화 작업
     *
     */
	const tasks = [
		(callback) => {
			Upload.formidable(req, (err, files, field) => {
				callback(err, files, field);
			});
		},
		(files, field, callback) => {
			Upload.s3(files, Upload.s3Keys.calendar, (err, result, s3_file_name) => {
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
    
	async.waterfall(tasks, (err, result) => {
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