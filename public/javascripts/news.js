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
      submit_news_upload = $('#submit_news_upload'),
      form_news_upload = $('#form_news_upload'),
      btn_news_delete = $('.btn_news_delete');
  
  
    submit_news_upload.on('click', function () {
      Common.AjaxFormSubmit(form_news_upload, (err, result)=>{
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      });
    });
    $('#parent1').clone().children().remove().end().text();
    btn_news_delete.on('click', function () {
      const data = {
        id: $(this).attr('data-news-id')
    };
      
      Common.AjaxSubmit('news', data, 'DELETE', (err, result) => {
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      })
    });
  });