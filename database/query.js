const QUERY = {};

QUERY.HOME = {
	GetNavList: 'select v.`created_dt`as updated_dt, ch.`channel_id`, ch.`title`, ch.`created_dt`, sum(v.`hits`)as hits, ch.`group_id`, ch.`active`, ch.`priority` from `channel`as ch left join (select *from `video` where `active`=true order by `created_dt` desc) as v on ch.`channel_id` = v.`channel_id` where ch.`active` =1 and not exists (select *from `group` where `title` = ch.`title`) group by ch.`channel_id` order by ch.`priority` asc;'
  , GetRecomList: 'select * from `recommend_channel` as rc ' +
  'where rc.active = true ' +
  'order by `priority` desc ' +
  'limit 3;'
  , GetNavAllList: 'select ' +
  'if(g.title is null, c.title, g.title) as title, ' +
  'if(count(g.`group_id`)=0,\'single\',\'group\') as type, ' +
  'group_concat(c.`channel_id` order by c.priority asc) as group_channel_id, ' +
  'group_concat(c.title order by c.priority asc) as group_channel_title, ' +
  'if(g.group_id is null, c.title ,g.group_id) as group_id ' +
  'from `channel` as c ' +
  'left join `group` as g ' +
  'on c.group_id = g.group_id ' +
  'where c.active=true ' +
  'group by group_id ' +
  'order by c.priority asc;' // todo 우선순위에 대한 로직은 asc가 아니라 desc가 되어야 한다
};

QUERY.USER = {
	Login: 'select `user_id`, `password`, `nickname`, `name`, `email`, `login_fail_count`, `banned`, `market_code` from `user` where `user_id`=?;',
	FailToLogin: 'update `user` set `login_fail_count`=`login_fail_count`+1 where `user_id`=?;',
	ClearFailedCount: 'update `user` set `login_fail_count`=0  where `user_id`=?;',
	UpdateGameLog: 'insert into `log_access_game` set `user_id` = ?, `last_login_dt` = ?;',
	SignUp: 'insert into `user` set ?;',
	DuplicateByUserId: 'select `user_id` from `user` where `user_id` = ?;',
	DuplicateByNickname: 'select `nickname` from `user` where `nickname` = ?;',
	DuplicateByEmail: 'select `email` from `user` where `email` = ?;',
};

QUERY.Reply = {
	Write: 'insert into `reply_video` set ?;',
	Modify: 'update `reply_video` set `comment` =? where `id` = ?;',
	Remove: 'delete from `reply_video` where `id` =?'
};

QUERY.ReReply = {
	Write: 'insert into `reply_video` set ?;',
	Modify: 'update `reply_video` set `comment` =? where `id` = ?;',
	Remove: 'delete from `reply_video` where `id` =?'
};

QUERY.Common = {
	SearchAdminById: 'select *from `admin` where `admin_id` = ?;'
};

QUERY.Broadcast = {
	LiveOn: 'insert into `broadcast` set ?;',
	LiveEnd: 'update `broadcast` set `end_dt` = ?, `status` = 0 where `id` = ?',
	LiveGetList: 'select *from `broadcast` where `status` = 1;',
	CalendarWrite: 'insert into `broadcast_calendar` set ?;',
	CalendarList: 'select *from `broadcast_calendar` order by `created_dt` desc limit 1;',
	CalendarDelete: 'delete from `broadcast_calendar` where `id` =?;'
};

QUERY.Event = {
	ResultRegister: 'insert into `event_result` set ?;',
	ResultDelete: 'delete from `event_result` where `event_id` = ?;',
	StatusChange: 'update `event` set `status` =?, `ref_id` =? where `id`=?;',
	ResultList: 'select e.`id`, e.`title`, e.`thumbnail`,e.`type`, e.`ref_id`, e.`status`, ' +
  'e.`description`, e.`created_dt`, e.`end_dt`,er.`result_img` ' +
  'from `event` as e left join (select *from `event_result`) as er on e.`id` = er.`event_id` order by e.`created_dt` desc;',
	LIST: 'select * from `event` ' +
  'order by `created_dt` desc ;',
	Register: 'insert into `event`set ?',
};

QUERY.Contents = {
	RepresentativeList: 'select * from `contents` ' +
  'where `type`=\'RT\' ' +
  'order by `priority` desc, `created_dt` desc; ',
	EducationList: 'select * from `contents` ' +
  'where `type`=\'E\' ' +
  'order by `priority` desc, `created_dt` desc ;',
	SummaryList: 'select * from `contents` ' +
  'where `type`=\'S\' ' +
  'order by `priority` desc, `created_dt` desc ;',
	RecommendList: 'select * from `contents` ' +
  'where `type`=\'R\' ' +
  'order by `priority` desc, `created_dt` desc ;',
  
	Register: 'insert into `contents` set ?;',
	Delete: 'delete from `contents`where `id`= ?',
	Update: 'update `contents` set `ref_id` = ?, `type` = ? where `id` =?;',
	ListGet: 'select *from `contents`;'
};


// Special(대표채널), General(단독채널), Under(S채널에 종속
QUERY.Channel = {
	ListAll: 'select *from `channel_new`;',
	ListSpecial: 'select *from `channel_new` where `type` = \'S\';',
	ListGeneral: 'select *from `channel_new` where `type` = \'G\';',
	ListUnder: 'select *from `channel_new` where `type` = \'U\';',
	Register: 'insert into `channel_new` set ? ;',
	RegisterGroup: 'update `channel_new` set `type` = ? , `group_id`= ? where `channel_id` =?;',
	DeleteGroup: 'update `channel_new` set `group_id`= ?, `type`= ? where `channel_id`= ?;'
};

QUERY.Video = {
	List: 'select *from `video` where `channel_id`= ? order by `created_dt` desc;',
	View: 'select * from `video` where `video_id`= ?',
	Register: 'insert into `video` set ?;'
};

QUERY.News = {
	ListAll: 'select *from `news`;',
	SearchById: 'select *from `news` where `id`= ?;',
	Register: 'insert into `news` set ?;',
	DeleteById: 'delete from `news` where `id` = ? ;'
};
module.exports = QUERY;