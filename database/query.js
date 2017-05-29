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


QUERY.Common = {
	SearchAdminById: 'select * from `admin` where `admin_id` = ?;'
};

QUERY.Broadcast = {
	LiveOn: 'insert into `broadcast` set ?;',
	LiveEnd: 'update `broadcast` set `end_dt` = ?, `status` = 0 where `id` = ?',
	LiveGetList: 'select *from `broadcast` where `status` = 1;',
	CalendarWrite: 'insert into `broadcast_calendar` set ?;',
	CalendarList: 'select *from `broadcast_calendar` order by `created_dt` desc limit 1;',
	CalendarDelete: 'delete from `broadcast_calendar` where `id` =?;',
  ActiveByCalendar: 'update `broadcast_calendar` set `active` = ? where `id`= ?'
};

QUERY.Event = {
	ResultRegister: 'insert into `event_result` set ?;',
	//ResultDelete: 'delete from `event_result` where `event_id` = ?;',
	//StatusChange: 'update `event` set `status` =?, `ref_id` =? where `id`=?;', // todo
	ResultList: 'select e.`id`, e.`title`, e.`thumbnail`,e.`type`, e.`ref_id`, e.`status`, ' + // todo
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
	EducationList:
	`
	select * from contents
	where type='E'
	order by priority desc, created_dt desc;
	`,
  // 'select * from `contents` ' +
  // 'where `type`=\'E\' ' +
  // 'order by `priority` desc, `created_dt` desc ;'

	SummaryList:
	`
	select id, channel_id, video_id, priority, active from contents
	where type='S'
	order by priority desc, created_dt desc;
	`,
  // 'select * from `contents` ' +
  // 'where `type`=\'S\' ' +
  // 'order by `priority` desc, `created_dt` desc ;',
	RecommendList:
	`
	select id, channel_id, video_id, type, priority, active from contents
	where type='R'
	order by priority desc, created_dt desc;
	`,
  // 'select * from `contents` ' +
  // 'where `type`=\'R\' ' +
  // 'order by `priority` desc, `created_dt` desc ;',
	Register: 'insert into `contents` set ?;',
	Delete: 'delete from `contents`where `id`= ?',

	// Update: 'update `contents` set `ref_id` = ?, `type` = ? where `id` =?;', // todo
	ListGet: 'select * from `contents`;',
  ActiveRT : 'update `contents` set `active`=? where `channel_id`=?;',
  ActiveOther : 'update `contents` set `active` =? where `video_id` =?;'
};

// todo grouping과 관련된 쿼리문은 어디에?
// Special(대표채널), General(단독채널), Under(S채널에 종속
QUERY.Channel = {
	ListAll: 'select * from `channels` order by `created_dt` desc;',
	ListSpecial: 'select * from `channels` where `type` = \'S\' order by `created_dt` desc;',
	ListGeneral: 'select * from `channels` where `type` = \'G\' order by `created_dt` desc;',
	ListUnder: 'select * from `channels` where `type` = \'U\' order by `created_dt` desc;',
	Register: 'insert into `channels` set ? ;',
  Modify : 'update `channels` set `title`= ?, `type` =? where `channel_id`= ?;',
	// todo 채널 그룹화를 한 후에 channel_group 테이블에 그룹 아이디를 만들어 저장하는 로직이 필요하다
	RegisterGroup: 'update `channels` set `type` = ? , `group_id`= ? where `channel_id` =?;',
	DeleteGroup: 'update `channels` set `group_id`= ?, `type`= ? where `channel_id`= ?;',
  Active : 'update `channels` set `active`= ? where `channel_id`= ?',
	getListWithoutRepresentative : `select * from channels where type != 'S' order by priority asc;`
};

QUERY.Video = {
	List: 'select *from `video` where `channel_id`= ? order by `created_dt` desc;',
  ListByTitle :
	  //'select * from `video` where `title` like ? order by `title` asc;' ,
  `select * from video where title like ? and active=true order by title asc;`,
	View: 'select * from `video` where `video_id`= ?',
	Register: 'insert into `video` set ?;',
  Modify :'update `video` set `title` =? where `video_id`= ?;',
  Active: 'update `video` set `active`= ? where `video_id`= ?',
};

QUERY.News = {
	ListAll :
		'select * from `news` ' +
		'order by `created_dt` desc ' +
		'limit 1000;',
	SearchById: 'select *from `news` where `id`= ?;',
	Register: 'insert into `news` set ?;',
	DeleteById: 'delete from `news` where `id` = ? ;',
  ActiveById :'update `news` set  `active`= ? where `id`= ?'
};

QUERY.Notice = {
	List :
		`
		select * from notice
		order by created_dt desc
		limit 0, 1000;
		`,
	GetContentById :
		`
		select * from notice
		where id=? and user_id=?;
		`,
	GetContentByOnlyId :
		`
		select * from notice where id=?;
		`,
	CreateContent :
		`
		insert into notice (title, content, user_id) values (?,?,?);
		`,
	UpdateById :
		`
		update notice set title=?, content=?, user_id=? where id=? and user_id=?;
		`,
	ActivateById :
		`
		update notice set active=? where id=?;
		`

};

module.exports = QUERY;