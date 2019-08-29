<template>
  <div id="j_EditStatusModal" class="portlet light bordered modal fade" tabindex="-2" data-width="600">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">手工修改预约状态</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_editStatusForm">
        <div class="form-body">
          <h4 class="form-section font-green">标签信息</h4>
          <div class="row">
            <!-- 状态变更 -->
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>状态变更：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.status">
                    <option value="20" selected="selected">已上课</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <!-- 备注 -->
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>备注：</label>
                <div class="col-md-6">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入销课备注"  v-model="formObj.remark" />
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-offset-10 col-md-9">
                  <button type="button" class="btn green" @click="onSubmit($event)">确认修改</button>
                  <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import base from 'common/js/utils/base.js';
import basicData from 'common/js/basicData.js'

export default {

  data: function () {
    return {
      editForm: null,         // 表单对象
      formObj: {},            // 手工预约记录表单对象
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        status: '',            // 状态
        remark: '',            //备注
        reserveId: '',         //预约ID
      };
    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.formObj.status) {
        bootbox.alert('请选择修改状态!');
        return
      }
      if (!self.formObj.remark) {
        bootbox.alert('请输入销课备注!');
        return
      }
      $.ajax({
        url: '/api/course/updateReserveStatus',
        type: 'POST',
        data: self.formObj
      }).done(resp => {
        if (resp.code == '0000') {
          toastr.success(resp.msg);
          setTimeout(() => {
            window.location.reload(true);
          }, 500);
        } else {
          toastr.error(resp.msg);
        }
      });
    },
    // 清空错误提示
    clearErrmsg: function () {
      this.editForm.find('.has-error').closest('span').remove();
      this.editForm.find('.has-error').each(function () {
        $(this).removeClass('has-error');
      });
    },

  },

  created: function () {
    this.$root.$on('openEditStatusModal', obj => {
      this.clearErrmsg();
      this.initFormObj();
      this.isAdd = $.isEmptyObject(obj);
      this.formObj.status = 20;
      if (!this.isAdd) {
        this.formObj = base.assignObj(this.formObj, obj);
        this.formObj.reserveId = obj.reserveId;
      };

      $('#j_EditStatusModal').modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $('#j_editStatusForm');
    this.editForm.validate({
      rules: {

      }
    });
  }
}
</script>
<style>
#templ {
  display: flex;
  justify-content: center;
}
.datetime_input {
  padding: 0 54px;
}
</style>
