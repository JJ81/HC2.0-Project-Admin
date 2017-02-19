/**
 * Created by yijaejun on 15/12/2016.
 */
var QUERY = require('../../database/query');
var CommonDAO = require('../../RedisDAO/CommonDAO');
var UTIL = require('../../util/util');

module.exports = {
	/**
	 * 에이전트를 Layer로 쿼리하여 정렬된 에이전트로 가공한 후에 레디스에 캐싱하는 메서드
	 * @param reqCache
	 * @param connection
	 * @param agentCode
	 * @param agentLayer
	 * @param callback
	 * @constructor
	 */
	GetAgentList : function (reqCache, connection, agentCode, agentLayer, callback){
		var _agent = agentCode;
		var _layer = agentLayer;
		var _agentList = [];
		var REDIS_KEY = 'AMS:COMMON:' + _agent +':AGENTLIST';

		CommonDAO.QueryDataByKeyName(reqCache, REDIS_KEY, function (err, cached) {
			if(err){
				callback(err, null);
			}else{
				if(cached !== null){
					console.log('From Redis');
					callback(null, JSON.parse(cached));
				}else{
					connection.query(QUERY.AGENT.GetAgentListByLayer, [_layer, _agent], function (err, data) {
						if(err){
							callback(err, null);
						}else{

							console.info('From MySQL Data Agent List');
							console.info(data);

							var _self = data[0];
							for(var i = 0, len = data.length; i < len; i++){
								_agentList.push({
									code : data[i].code,
									layer : data[i].layer,
									parent_id : data[i].parent_id,
									balance : data[i].balance,
									suspend : data[i].suspend,
									player_count : data[i].player_count
								});
							}

							console.log('==== Organized Data ======');
							// console.info(data);
							console.info(_agentList);
							console.log('====  End Organized Data ======');


							// 결과값을 캐싱한다.
							var ret = UTIL.RearrangeAgentList(_agentList, _layer, _agent);

							console.info('Check restructured Data!!');
							console.info(ret);


							ret.splice(0, 0, {
								code : _self.code,
								layer : _self.layer,
								balance : _self.balance,
								parent_id : _self.parent_id,
								suspend : _self.suspend,
								player_count : _self.player_count
							});

							console.log('check final data');
							console.log(ret);

							// todo 현재 레디스에 캐시하기 전 로직에 문제가 발생한 것을 보인다.



							CommonDAO.CacheWithKeyName(reqCache, REDIS_KEY, JSON.stringify(ret), function (err, result) {
								if(err){
									callback(err, null);
								}else{
									console.log('AMS ORDERED LIST stored in Redis and return from MySQL');
									callback(null, ret);
								}
							});
						}
					});
				}
			}
		});
	},

	/**
	 * @Deprecated
	 * @param reqCache
	 * @param connection
	 * @param agentList
	 * @constructor
	 */
	GetAgentPlayersCount: function (reqCache, connection, agentList, callback) {
		var REDIS_KEY = 'AMS:AGENT:LIST:UNDER:' + agentList[0].code;
		var tmp = [];

		CommonDAO.QueryDataByKeyName(reqCache, REDIS_KEY, function(err, cached){
			if(err){
				callback(err, null);
			}	else{
				if(cached !== null){
					console.info('Return Agent\'s player count from REDIS');
					callback(null, JSON.parse(cached));
				}else{
					console.info('Query Agent\'s player count from MySQL');

					console.info('Request Agent in GetCount ');
					console.info(agentList); // 11개

					for(var i = 0,len=agentList.length;i<len;i++){
						console.info('------');
						console.log(i);
						console.info(agentList[i].code);
						console.info('------');


						var param = agentList[i].code;
						connection.query(QUERY.PLAYER.GetPlayerCountByAgentName, [param], function (err, rows) {
							console.info(param);
							if(err){
								console.error(err);
								callback(err, null);
							}else{

								console.info('--- result --- ');
								console.info(rows[0].player);

								if(rows[0].player !== null){
									tmp.push(rows[0].player);
								}

								if(i === len){
									CommonDAO.CacheWithKeyName(reqCache, REDIS_KEY, JSON.stringify(tmp), function (err, result) {
										if(err){
											callback(err, null);
										}else{
											console.info('Cached agent\'s player count in REDIS');
											callback(null, tmp);
										}
									});
								}
							}
						});
					}
				}
			}
		});
	},


	/**
	 *
	 * @param connection
	 * @param agent_code
	 * @param cb
	 * @constructor
	 */
	GetAgentBalance: function (connection, agent_code, cb) {
		connection.query(QUERY.AGENT.GetAgentBalance, [agent_code], function (err, rows) {
			if(err){
				console.error(err);
				cb(err, null);
			}else{
				cb(null, rows);
			}
		});
	}
};