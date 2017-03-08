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
      btn_content_modify = $('.btn_content_modify'),
      search_title = $('.search_title');
    
    let channel_list;
    
    
    (function () {
      Common.getAPIData('channel', (err, data) => {
        if (!err && data.success) {
          
          channel_list = data.result;
        } else {
          console.log(err);
        }
      });
      
    })();
    
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
    
    /**
     * Active / Inactive
     */
    $('.btn_active').on('click', function () {
      const data = {
        id: $(this).attr('data-id'),
        active: $(this).attr('data-active'),
        target: 'ref_id'
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
    
    
    search_title.on('keyup', _.debounce(function () {
      const channel_title = search_title.val();
      const channel_list_info = findChannelListByTitle(channel_title, channel_list);
      makeChannelList(channel_list_info);
      
    }, 1000));
    
    function findChannelListByTitle(title, channel_list) {
      const len = channel_list.length;
      let find_channel_list = [];
      
      for (let i = 0; i < len; i++) {
        
        if (channel_list[i].title.indexOf(title) !== -1) {
          find_channel_list.push(channel_list[i])
        }
      }
      return (find_channel_list.length === 0) ? false : find_channel_list;
    }
    
    
    function makeChannelList(channel_list_info) {
      const len = channel_list_info.length;
      let html = '';
      
      for (let i = 0; i < len; i++) {
        
        html = html +
          '<div class="col-lg-6">' +
          '<div class="input-group">' +
          '<span class="input-group-addon"><input type="radio" name="ref_id" value="' + channel_list_info[i].channel_id + '" aria-label="..."></span>' +
          '<input type="text" class="form-control" aria-label="..." value="' + channel_list_info[i].title + '" readonly>' +
          '</div><!-- /input-group -->' +
          '</div><!-- /.col-lg-6 -->'
      }
      $('.find_list').empty().append(html);
    }
  });