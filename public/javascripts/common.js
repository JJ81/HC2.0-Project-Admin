/**
 * Created by yijaejun on 14/12/2016.
 */

'use strict';

define(
	[
		'jquery',
		'jqueryForm',
		'bootstrap',
		'bootstrapProgressbar',
		'custom',
		'npPogress',
		'iCheck',
		'fastclick',
		'jqueryForm'
  
	], function ($) {
    // 로직 설명
    /**
     * todo
     * 현재 브라우저 사이즈를 체크하여 좌측 네비게이션이 노출되는지 여부를 체크한다.
     * 네비가 켜져 있을 경우 좌상단 버튼을 누르면, 닫혀진다
     * 네비가 닫혀 있을 경우 좌상단 버튼을 누르면 열린다
     * 이 때 화면 사이즈가 일정 비율 이하일 경우 드롭다운으로 보여주고,
     * 일정비율 이상일 경우 좌측에서 있는 네비를 노출시킨다.
     *
     * 1. 전체 브라우저가 1450 이하일 경우, 상단에 기본 메뉴가 노출된다
     * 2. 1450이상일 경우 좌측 메뉴가 자동으로 노출된다.
     *
     */
      
      // TODO 일단 여기에 작성하고 어디로 뺄지 결정하자
	const
		HOST = 'http://localhost:3002/',
		HOST_API = `${HOST}api/v1/`;
    
	const utils = {
      
      
      /*POST, DELETE, PUT 전솜을 담당(Form 전송 외 모두 담당)*/
		AjaxSubmit: function (url, data, type, callback) {
			$.ajax({
				url: HOST_API + url,
				type: type,
				data: data,
				success: function (data) {
					callback(null, data);
				},
				error: function (jqXHR, textStatus) {
					callback(textStatus, null);
				}
			});
		},
      
      /*Form 전송은 이곳에서 전부 담당한다.*/
		AjaxFormSubmit: function (form, callback) {
			form.ajaxForm({
				url: form.attr('action'),
				type: $(form).find('.method').val() || form.method,
				data: form.serialize(),
				success: function (data) {
					callback(null, data);
				},
				error: function (jqXHR, textStatus) {
					callback(textStatus, null);
				}
			});
		},
      
	};
    /*모달 close시 입력값 초기화*/
	$('.modal').on('hidden.bs.modal', function () {
		$(this).find('form')[0].reset();
	});
    
    
	window.util = utils;
    
	return utils;
    
    
});