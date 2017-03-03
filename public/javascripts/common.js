/**
 * Created by yijaejun on 14/12/2016.
 */

'use strict';

define(
  [
    'jquery',
    'jqueryForm',
    'bootstrap',
    // 'bootstrapProgressbar',
    'custom',
  ], function ($) {
    // 로직 설명
    
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