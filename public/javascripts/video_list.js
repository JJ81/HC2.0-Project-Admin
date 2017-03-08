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
    const
      btn_video_modify = $('.btn_video_modify'),
      modal_modify_id = $('#modifyVideo'),
      submit_video_modify = $('#submit_video_modify'),
      submit_video_upload = $('#submit_video_upload'),
      form_video_upload = $('#form_video_upload'),
      btn_video_active = $('.btn_video_active'),
      form_video_modify = $('#form_video_modify');
    
  
    btn_video_modify.on('click', function () {
      const
        video_id = $(this).attr('data-video-id'),
        video_title = $(this).attr('data-video-title'),
        video_link = $(this).attr('data-video-link');
      
      modal_modify_id.find('#video_id').val(video_id);
      modal_modify_id.find('#title').val(video_title);
      modal_modify_id.find('#link').val(video_link);
    });
  
    submit_video_modify.on('click', function () {
      Common.AjaxFormSubmit(form_video_modify, (err, result)=>{
        if(result.success){
          alert(result.msg);
          location.reload();
        }else{
          alert(result.msg);
        }
      });
    });
  
  
    submit_video_upload.on('click', function () {
      Common.AjaxFormSubmit(form_video_upload, (err, result)=>{
        if(result.success){
          alert(result.msg);
          location.reload();
        }else{
          alert(result.msg);
        }
      });
    });
  
    btn_video_active.on('click', function () {
      const data = {
        video_id : $(this).attr('data-id'),
        active: $(this).attr('data-active')
      };
      
      Common.AjaxSubmit('video/active', data, 'PUT', (err, result)=>{
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      });
    });
    
  });