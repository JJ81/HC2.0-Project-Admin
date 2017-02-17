/**
 * Created by cheese on 2017. 2. 15..
 */
'use strict';
requirejs(
	[
		'common',
		'jquery',
	],
  (Common, $) => {
	const btn_channel_ungroup = $('.btn_channel_ungroup');
    
    
	btn_channel_ungroup.on('click', function () {
		const data = {
			channel_id: $(this).attr('data-channel-id')
		};
      
		Common.AjaxSubmit('channel/group', data, 'PUT', (err, result)=>{
			if (!err) {
				alert(result.msg);
				location.reload();
			} else {
				alert(result.msg);
			}
		});
	});
});