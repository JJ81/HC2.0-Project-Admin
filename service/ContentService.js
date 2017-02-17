/**
 * Created by cheese on 2017. 2. 7..
 */
const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	Contents = {};

Contents.getRepresentativeList = (callback) => {
	connection.query(QUERY.Contents.RepresentativeList, (err, result) => {
		callback(err, result);
	});
};

Contents.getEducationList = (callback) => {
	connection.query(QUERY.Contents.EducationList, (err, result) => {
		callback(err, result);
	});
};
Contents.getSummaryList = (callback) => {
	connection.query(QUERY.Contents.SummaryList, (err, result) => {
		callback(err, result);
	});
};
Contents.getRecommendList = (callback) => {
	connection.query(QUERY.Contents.RecommendList, (err, result) => {
		callback(err, result);
	});
};

Contents.register = (ref_id, type, callback) => {
	const _values = {
		ref_id: ref_id,
		type: type,
		created_dt: new Date(),
		priority: null,
		active: 0
	};
	connection.query(QUERY.Contents.Register, _values, (err, result) => {
		callback(err, result);
	});
};

Contents.delete = (id, callback) => {
	connection.query(QUERY.Contents.Delete, id, (err, result) => {
		callback(err, result);
	});
};

Contents.update = (id, ref_id, type, callback) => {
	connection.query(QUERY.Contents.Update, [ref_id, type, id], (err, result) => {
		callback(err, result);
	});
};
module.exports = Contents;