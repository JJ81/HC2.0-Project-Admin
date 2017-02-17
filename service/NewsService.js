/**
 * Created by cheese on 2017. 2. 16..
 */
const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	News = {};

News.register = (values, callback) => {
	let test = connection.query(QUERY.News.Register, values, (err, result) => {
		console.log(test.sql);
		callback(err, result);
	});
};

News.delete = (id, callback) => {
	connection.query(QUERY.News.DeleteById, id, (err, result) => {
		callback(err, result);
	});
};

News.getListAll = (callback) => {
	connection.query(QUERY.News.ListAll, (err, result) => {
		callback(err, result);
	});
};

module.exports = News;
