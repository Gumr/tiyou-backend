<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">新建兑换码批次</span>
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
            <!-- 批次名称 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>批次名称:</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入批次名称" v-model="formObj.batchName" />
                </div>
              </div>
            </div>
            <!-- 有效时间 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>有效时间:</label>
                <div class="col-md-9">
                  <input type="text" placeholder="请选择开始日期" autocomplete="off" class="form-control input input-inline input_maxWidth" id="j_beginTime" name="beginTime" v-model="beginTime"> -
                  <input type="text" placeholder="请选择结束日期" autocomplete="off" class="form-control input input-inline input_maxWidth" id="j_stopTime" name="stopTime" v-model="stopTime">
                </div>
              </div>
            </div>
            <!-- 所属商户 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="control-label col-md-3"><span class="required">*</span>所属商户:</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.merchantId">
                    <option selected="selected" value>请选择商户</option>
                    <option v-for="item in $root.merchantSelect" :value="item.merchantId">{{item.merchantName}}</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- 来源渠道 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="control-label col-md-3"><span class="required">*</span>来源渠道:</label>
                <div class="col-md-6">
                  <!-- <input type="text" class="form-control" autocomplete="off" placeholder="请输入渠道号" v-model="formObj.channelNo" /> -->
                  <select class="form-control" v-model="formObj.channelNo">
                    <option selected="selected" value>请选择来源渠道</option>
                    <option v-for="item in $root.channelSelect" :value="item.channelNo">{{item.channelName}}</option>
                  </select> 
                </div>
              </div>
            </div>
            <!-- 兑换类型 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="control-label col-md-3"><span class="required">*</span>兑换类型:</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.redeemCodeType">
                    <option selected="selected" value>请选择兑换类型</option>
                    <option value="1">课币</option>
                    <option value="2">体验卡</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- 可兑换课时、可兑换体验卡 -->
            <div class="col-md-6">
              <div class="form-group" v-if="toggleCodeType1">
                <label class="col-md-3 control-label"><span class="required">*</span>可兑课时:</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" v-model="formObj.lcoin" autocomplete="off" placeholder="请输入可兑课时" />
                </div>
              </div>
              <div class="form-group" v-if="toggleCodeType2">
                <label class="col-md-3 control-label"><span class="required">*</span>可兑体验卡:</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" v-model="formObj.experienceCard" autocomplete="off" placeholder="请输入可兑体验卡" />
                </div>
              </div>
            </div>
            <!-- 兑换码数量 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>兑换码数量:</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" v-model="formObj.redeemCodeNum" autocomplete="off" placeholder="请输入0-10000张" />
                </div>
              </div>
            </div>
            <!-- 备注 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">备注:</label>
                <div class="col-md-6">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
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
      toggleCodeType1: false,        //课币
      toggleCodeType2: false,        //体验卡

    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        batchName: "",          //批次名称
        merchantId: "",         //商户id
        channelNo: "",          //渠道号
        redeemCodeNum: "",      //兑换码数量
        redeemCodeType: "",     //兑换码类型: 1=课币 2=体验卡
        lcoin: "",              //可兑课时
        experienceCard: "",     //可兑换体验卡
        startTime: "",          //开始时间,格式 yyyy-MM-dd 00:00:00
        endTime: "",            //过期时间,格式 yyyy-MM-dd 23:59:59
        remark: "",             //备注
      };
    },

    // 新增兑换码信息提交
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      self.formObj.startTime = (self.beginTime + ' ' + '00' + ':' + '00' + ':' + '00');
      self.formObj.endTime = (self.stopTime + ' ' + '23' + ':' + '59' + ':' + '59');
      //   console.log('self.formObj.startTime:',self.formObj.startTime)
      //   return
      if (!self.formObj.batchName) {
        bootbox.alert('批次名称不能为空，请输入批次名称!');
        return
      }
      if (!self.beginTime) {
        bootbox.alert('开始时间不能为空，请选择开始时间!');
        return
      }
      if (!self.stopTime) {
        bootbox.alert('结束时间不能为空，请选择结束时间!');
        return
      }
      if (new Date(self.formObj.startTime).getTime() > new Date(self.formObj.endTime).getTime()) {
        bootbox.alert('开始时间不能大于结束时间，请重新选择!');
        return
      }
      if (!self.formObj.merchantId) {
        bootbox.alert('所属商户不能为空，请选择商户!');
        return
      }
      if (!self.formObj.channelNo) {
        bootbox.alert('渠道号不能为空，请选择渠道号!');
        return
      }
      if (!self.formObj.redeemCodeType) {
        bootbox.alert('兑换码类型不能为空，请选择兑换码类型!');
        return
      }
      if (self.formObj.redeemCodeType == 1) {
        if (!self.formObj.lcoin) {
          bootbox.alert('可兑换课时不能为空，请输入可兑换课时!');
          return
        }
      } else if (self.formObj.redeemCodeType == 2) {
        if (!self.formObj.experienceCard) {
          bootbox.alert('可兑换体验卡不能为空，请输入可兑换体验卡数量!');
          return
        }
      }
      if (!self.formObj.redeemCodeNum) {
        bootbox.alert('兑换码数量不能为空，请输入兑换码数量!');
        return
      }
      
      $.ajax({
        url: "/api/redeemcode/createRedeemCodeBatch",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self.formObj)
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          window.location.reload(true);
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
      let _start = $("#j_beginTime");   //开始日期元素
      let _end = $("#j_stopTime");       //结束日期元素
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
        console.log('self.beginTime', self.beginTime)
      });
      _end.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.stopTime = _end.val();
      });
    },
    
  },

  //兑换类型切换时显示课币或者体验卡
  watch: {
    formObj: {
      handler: function (val, oldval) {
        let that = this;
        if (val.redeemCodeType == 1) {
          this.toggleCodeType1 = true;
          this.toggleCodeType2 = false;
        } else if (this.formObj.redeemCodeType == 2) {
          this.toggleCodeType2 = true;
          this.toggleCodeType1 = false;
        } else {
          this.toggleCodeType2 = false;
          this.toggleCodeType1 = false;
        }
      },
      deep: true//对象内部的属性监听，也叫深度监听
    },
  },

  created: function () {
    let that = this;
    //兑换码基础信息弹窗数据
    this.$root.$on("openAddEditModal", obj => {
      //   that.clearErrmsg();
      that.initFormObj();
      that.beginTime = '';
      that.stopTime = '';
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.beginTime = String(obj.startTime);
        that.stopTime = String(obj.endTime);
        that.formObj = base.assignObj(this.formObj, obj);
      }
      //   that.formObj.redeemCodeType = 1;
      //   that.toggleCodeType1 = true;
      $("#j_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });


  },
  updated: function () {

  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
  }
};
</script>
<style>
/* 时间有效期input框宽度设置 */
.input_maxWidth {
  width: 125px;
}
</style>