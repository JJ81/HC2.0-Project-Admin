/**
 * Created by yijaejun on 13/12/2016.
 */
var AgentDAO = {};


// TODO CommonDAO와 중복 소스
AgentDAO.QueryAgentListByName = function (reqCache, key, callback) {
	return reqCache.get(key, callback);
};

AgentDAO.CacheWithAgentName = function (reqCache, key, value, callback) {
	return reqCache.set(key, value, callback);
};

AgentDAO.DeleteByKey = function (reqCache, key, callback) {
	return reqCache.del(key, callback);
};

AgentDAO.GetKeysWithPrefix = function (reqCache, key, callback) {
	return reqCache.keys(key, callback);
};

module.exports = AgentDAO;