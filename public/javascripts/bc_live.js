'use strict';
requirejs(
	[
		'common',
		'jquery',
    
	],
    function (Common, $) {
        
	const
		submit_bc_live_on = $('#submit_bc_live_on'),
		form_bc_live_on = $('#form_bc_live_on'),
		btn_bc_live_off = $('.btn_bc_live_off'),
		btn_bc_live_modify = $('.btn_bc_live_modify');
        
        /**
         * 생방송 등록
         */
	submit_bc_live_on.on('click', function () {
		Common.AjaxFormSubmit(form_bc_live_on, (err, result) => {
			if (!err) {
				alert(result.msg);
				location.reload();
			} else {
				alert(result.msg);
			}
		});
	});
        
        /**
         * 생방송 종료
         */
	btn_bc_live_off.on('click', function () {
		const data = {
			id: $(this).attr('data-bc-id')
		};
		Common.AjaxSubmit('broadcast/live', data, 'PUT', (err, result) =>{
			if(!err){
				alert(result.msg);
				location.reload();
			}else{
				alert(result.msg);
			}
		});
	});
        
        /**
         * 생방송 수정
         */
        
});