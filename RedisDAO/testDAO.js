/**
 * Created by yijaejun on 08/12/2016.
 */
var TestDAO = {};

TestDAO.query = function (reqCache, callback) {
	return reqCache.get('KEY:HC:AGENTALL', callback);
};

TestDAO.create = function (reqCache, value, callback) {
	return reqCache.set('KEY:HC:AGENTALL', value, callback);
};

module.exports = TestDAO;