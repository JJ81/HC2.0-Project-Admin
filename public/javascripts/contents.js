'use strict';
requirejs(
  [
    'common',
    'jquery',
    'lodash'
  
  ],
  function (Common, $, _) {
    
    const
      form_content_register = $('#form_content_register'),
      btn_content_register_submit = $('#btn_content_register_submit'),
      btn_content_modify_submit = $('#btn_content_modify_submit'),
      form_content_modify = $('#form_content_modify'),
      btn_content_delete = $('.btn_content_delete'),
      search_title = $('.search_title'),
      btn_content_modify = $('.btn_content_modify');
    let video_list = [];
    
    
    /**
     * 컨텐츠 등록
     */
    btn_content_register_submit.on('click', function () {
      Common.AjaxFormSubmit(form_content_register, (err, result) => {
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      });
    });
    
    /**
     * 컨텐츠 수정
     */
    btn_content_modify.on('click', function () {
      const
        content_id = $(this).attr('data-id'),
        modal_id = $('#modifyContent');
      
      modal_id.find('#content_id').val(content_id);
    });
    
    
    btn_content_modify_submit.on('click', function () {
      Common.AjaxFormSubmit(form_content_modify, (err, result) => {
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      });
    });
    
    /**
     * 컨텐츠 삭제
     */
    btn_content_delete.on('click', function () {
      const data = {
        id: $(this).attr('data-id')
      };
      Common.AjaxSubmit('contents', data, 'delete', (err, result) => {
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      });
    });
  
    /**
     * Get Video List By Video Title
     */
    
    search_title.on('keyup', _.debounce(function () {
      const video_title = search_title.val();
  
      getVideoListByTitle(video_title, (err, result)=>{
        if(!err){
          if(result.length !== 0){
            makeVideoListToHTML(result);
          }else{
            alert('조회한 결과가 없습니다. 입력값을 확인해보세요');
            search_title.val('');
          }
        }else{
          alert('다시 시도 해주세요')
        }
      });
    }, 1000));
  
    function getVideoListByTitle (title, callback) {
      Common.getAPIData(`video/title/${title}`, (err, data) => {
        if (!err && data.success) {
          callback(null, data.result);
        } else {
          callback(err, null);
        }
      });
    }
  
    $('.btn_active').on('click', function () {
      const data = {
        id: $(this).attr('data-id'),
        active: $(this).attr('data-active'),
        target: 'video_id'
      };
    
      Common.AjaxSubmit('contents/active', data, 'PUT', (err, result) => {
        if (!err) {
          alert(result.msg);
          location.reload();
        } else {
          alert(result.msg);
        }
      });
    });
    
  
    function makeVideoListToHTML(video_list) {
      const len = video_list.length;
      let html = '';
    
      for(let i = 0; i < len; i++){
      
        html = html +
          '<div class="col-lg-6">'+
          '<div class="input-group">'+
          '<span class="input-group-addon"><input type="radio" name="ref_id" value="'+[video_list[i].channel_id , video_list[i].video_id]+'" aria-label="..."></span>'+
          '<input type="text" class="form-control" aria-label="..." value="'+video_list[i].title+'" readonly>'+
          '</div><!-- /input-group -->'+
          '</div><!-- /.col-lg-6 -->'
      }
      $('.find_list').empty().append(html);
    }
  
  });