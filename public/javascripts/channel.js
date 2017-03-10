'use strict';
requirejs(['common', 'jquery',], function (Common, $) {
  const
    btn_channel_modify = $('.btn_channel_modify'),
    btn_channel_modify_submit = $('#btn_channel_modify_submit'),
    submit_channel_upload = $('#submit_channel_upload'),
    form_channel_modify = $('#form_channel_modify'),
    btn_channel_active = $('.btn_channel_active'),
    form_channel_upload = $('#form_channel_upload');
  
  btn_channel_modify.on('click', function () {
    const id = $(this).attr('data-id');
    const title = $(this).attr('data-title');
    const modal_id = $('#modifyChannel');
    modal_id.find('#channel_id').val(id);
    modal_id.find('#title').val(title);
  });
  
  btn_channel_modify_submit.on('click', function () {
    Common.AjaxFormSubmit(form_channel_modify, (err, result) => {
      if (!err) {
        alert(result.msg);
        location.reload();
      } else {
        alert(result.msg);
      }
    });
  });
  
  submit_channel_upload.on('click', function () {
    Common.AjaxFormSubmit(form_channel_upload, (err, result) => {
      if (!err) {
        alert(result.msg);
        location.reload();
      } else {
        alert(result.msg);
      }
    });
  });
  
  btn_channel_active.on('click', function () {
    const data = {
      channel_id : $(this).attr('data-id'),
      active: $(this).attr('data-active')
    };
    
    console.log(data);
    
    Common.AjaxSubmit('channel/active', data, 'PUT', (err, result)=>{
      if (!err) {
        alert(result.msg);
        location.reload();
      } else {
        alert(result.msg);
      }
    });
    
  });
});