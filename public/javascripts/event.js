/**
 * Created by cheese on 2017. 2. 6..
 */
'use strict';
requirejs(
	[
		'common',
		'jquery',
	],
    function (Common, $) {
        
	const
		submit_event_upload = $('#submit_event_upload'),
		form_event_upload = $('#form_event_upload'),
		btn_event_result_register = $('.btn_event_result_register'),
		btn_event_start = $('.btn_event_start'),
		btn_event_result_delete = $('.btn_event_result_delete');
        
        /**
         * 이벤트 결과 업로드시 진행중인 이벤트와 결과 이벤트 event_id 참조
         */
	btn_event_result_register.on('click', function () {
		const
			event_id = $(this).attr('data-event-id'),
			modal_id = $('#registerEvent');
            
		modal_id.find('.event_id').val(event_id);
	});
        
        /**
         * 이벤트 결과 이미지 업로드
         */
	submit_event_upload.on('click', function () {
            
		Common.AjaxFormSubmit(form_event_upload, (err, result) => {
			if (!err) {
				alert(result.msg);
				location.reload();
			} else {
				alert(result.msg);
			}
		});
	});
    
	btn_event_start.on('click', function () {
		const data = {
			event_id : $(this).attr('data-event-id')
		};
            
		Common.AjaxSubmit('event', data, 'PUT', (err, result)=>{
			if (!err) {
				alert(result.msg);
				location.reload();
			} else {
				alert(result.msg);
			}
		});
	});
});