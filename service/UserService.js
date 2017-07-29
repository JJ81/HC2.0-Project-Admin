const mysql_dbc = require('../commons/db_conn')();
const connection = mysql_dbc.init();
const QUERY = require('../database/query');
const async = require('async');
const UserService = {};

UserService.getCustomerList = (cb) => {
	connection.query(QUERY.DATA.getCustomerList, (err, rows) => {
		if(!err){
			cb(null, rows);
		}else{
			console.error(err);
			cb(err, null);
		}
	});
};

module.exports = UserService;