const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const async = require('async');
const NoticeService = {};


NoticeService.GetList = (info, cb) => {
	connection.query(QUERY.Notice.List, [], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};

NoticeService.GetContent = (info, cb) => {
	connection.query(QUERY.Notice.GetContentById, [info.id, info.user_id], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};

NoticeService.GetContentById = (id, cb) => {
	connection.query(QUERY.Notice.GetContentByOnlyId, [id], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};

NoticeService.CreateContent = (info, cb) => {
	connection.query(QUERY.Notice.CreateContent, [info.title, info.content, info.user_id], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};

NoticeService.UpdateById = (info, cb) => {
	connection.query(QUERY.Notice.UpdateById, [info.title, info.content, info.admin_id, info.id, info.user_id], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};


NoticeService.ActivateById = (info, cb) => {
	var active = null;

	console.info(typeof info.active);

	if(info.active === '1'){
		active = false;
	}else{
		active = true;
	}

	connection.query(QUERY.Notice.ActivateById, [active, info.id], (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};



module.exports = NoticeService;