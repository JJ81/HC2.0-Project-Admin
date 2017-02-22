'use strict';
requirejs(
  [
    'common',
    'jquery',
  
  ],
  function (Common, $) {
  
    const
      btn_channel_modify = $('.btn_channel_modify'),
      btn_channel_modify_submit = $('#btn_channel_modify_submit'),
      form_channel_modify = $('#form_channel_modify');
  
  
    btn_channel_modify.on('click', function () {
      const id = $(this).attr('data-id');
      const title = $(this).attr('data-title');
      const modal_id = $('#modifyChannel');
      console.log(form_channel_modify);
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
    
  });