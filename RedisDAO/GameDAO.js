/**
 * Created by yijaejun on 13/12/2016.
 */
var GameDAO = {};

GameDAO.QueryByDateWithKey = function (reqCache, key, callback) {
	return reqCache.get(key, callback);
};

GameDAO.CacheWithDateKey = function (reqCache, key, value, callback) {
	return reqCache.set(key, value, callback);
};

module.exports = GameDAO;