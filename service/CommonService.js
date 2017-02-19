/**
 * Created by cheese on 2017. 2. 3..
 */
const
	mysql_dbc = require('../commons/db_conn')(),
	connection = mysql_dbc.init(),
	QUERY = require('../database/query'),
	bcrypt = require('bcrypt'),
	Common = {};


Common.login = (admin_id, password, callback) => {
	connection.query(QUERY.Common.SearchAdminById, [admin_id], (err, result) => {
		if (!err) {
			if (result.length === 1) {
				if (!bcrypt.compareSync(password, result[0].password)) {
					callback(err, {success: false, msg: '비밀번호가 일치하지 않습니다. 비밀번호를 확인하세요'});
				} else {
					callback(null, {
						success: true, admin_info: {admin_id: result[0].admin_id}, msg: '로그인에 성공했습니다.',
					});
				}
			} else {
				callback(err, {success: false, msg: '등록된 계정이없습니다. 계정을 확인하세요'});
			}
		} else {
			callback(err, {success: false, msg: '문제가 발생했습니다. 잠시 후에 다시 시도해주세요.'});
		}
	});
};

module.exports = Common;