<template>
  <div id="j_updateStatusModal" class="portlet light bordered modal fade" tabindex="-1" data-width="600">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">编辑</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <h4 class="form-section font-green">基础信息</h4>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>状态：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.status" >
                    <option value="1">上架</option>
                    <option value="0">下架</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>有效时间：</label>
                <div class="col-md-9">
                  <input type="text" placeholder="请选择开始日期" autocomplete="off" class="form-control input input-inline input_maxWidth" id="j_beginTime1" name="beginTime" v-model="beginTime"> -
                  <input type="text" placeholder="请选择结束日期" autocomplete="off" class="form-control input input-inline input_maxWidth" id="j_stopTime1" name="stopTime" v-model="stopTime">
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 保存与取消按钮 -->
        <div class="form-actions">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-offset-10 col-md-9">
                  <button type="button" class="btn green" @click="onSubmit($event)">保存</button>
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
import base from "common/js/utils/base.js";
import basicData from 'common/js/basicData.js'


export default {
  data: function () {
    return {
      editForm: null,               // 表单对象
      formObj: {},                  // 活动基础信息表单对象
      isAdd: false,                 // 是否新增活动基础信息
      beginTime: '',                //开始日期
      stopTime: '',                  //结束日期
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        status: "",      //状态
        startTime: "",  //开始时间,格式 yyyy-MM-dd 00:00:00
        endTime: "",    //过期时间,格式 yyyy-MM-dd 23:59:59
        batchId: "",    //批次ID
      };
    },

    // 新增兑换码信息提交
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      self.formObj.startTime = (self.beginTime + ' ' + '00' + ':' + '00' + ':' + '00');
      self.formObj.endTime = (self.stopTime + ' ' + '23' + ':' + '59' + ':' + '59');
    //   console.log('self.formObj.startTime:', self.formObj.startTime)
      //   return
      if(self.formObj.startTime > self.formObj.endTime) {
          bootbox.alert('开始时间不能大于结束时间，请重新选择!')
          return
      }
      $.ajax({
        url: "/api/redeemcode/updateRedeemCodeBatch",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self.formObj)
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          setTimeout(() => {
            window.location.reload(true);
          }, 800)
        } else {
          toastr.error(resp.msg);
        }
      });
    },

    // 清空错误提示
    clearErrmsg: function () {
      this.editForm
        .find(".has-error")
        .closest("span")
        .remove();
      this.editForm.find(".has-error").each(function () {
        $(this).removeClass("has-error");
      });
    },

    // 初始化时间插件
    initTimePicker: function () {
      let self = this;
      let _start = $("#j_beginTime1");   //开始日期元素
      let _end = $("#j_stopTime1");       //结束日期元素
      _start.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2
      });
      _end.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2
      });
      //隐藏时绑定数据
      _start.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.beginTime = _start.val();
      });
      _end.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.stopTime = _end.val();
      });
    },
  },

  created: function () {
    let that = this;
    //兑换码基础信息弹窗数据
    this.$root.$on("openUpdateStatusModal", obj => {
      //   that.clearErrmsg();
      that.initFormObj();
      that.beginTime = '';
      that.stopTime = '';
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.formObj = base.assignObj(this.formObj, obj);
        that.beginTime = String(obj.startTime).substring(0, 10);
        that.stopTime = String(obj.endTime).substring(0, 10);
        that.formObj.batchId = obj.batchId;
        // if (obj.status == 0) {
        //   that.formObj.status = 1;
        // } else if (obj.status == 1) {
        //   that.formObj.status = 0;
        // }
      }
      $("#j_updateStatusModal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },
  updated: function () {

  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
    // 初始化表单对象和表单参数校验规则
    // this.editForm = $("#j_updateStatusModal");
    // this.editForm.validate({
    //   rules: {
    //   }
    // });
  }
};
</script>
<style>
/* 时间有效期input框宽度设置 */
.input_maxWidth {
  width: 125px;
}
</style>