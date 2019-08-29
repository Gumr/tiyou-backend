<template>
  <div id="edit_scheduleModal" class="portlet light bordered modal fade" tabindex="-1" data-width="1000">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">编辑排课</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_scheduleForm">
        <div class="form-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>上课日期：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control input input-inline" autocomplete="off" id="scheduleDate" name="scheduleDate" v-model="formObj.scheduleDate">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>开课时间：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control input input-inline" id="classBeginTime" autocomplete="off" name="classBeginTime" v-model="formObj.classBeginTime">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>下课时间：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control input input-inline" id="classEndTime" autocomplete="off" name="classEndTime" v-model="formObj.classEndTime">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>截止预约时间：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control input input-inline" id="reserveEndTime" autocomplete="off" name="reserveEndTime" v-model="formObj.reserveEndTime">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>关联老师：</label>
                <div class="input-group select2-bootstrap-prepend col-md-6 edit_width">
                  <select id="single-prepend-text" v-select2="" v-model="formObj.teacherId" name="teacherId" required="required" class="form-control select2">
                    <option value="">请选择</option>
                    <option v-for="item in $root.teacherSelect" :value="item.teacherId">{{item.teacherName}}</option>
                  </select>
                </div>
                <!-- <div class="col-md-6">
                  <select class="form-control" v-model="formObj.teacherId" style="width:185px;" name="teacherId">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in $root.teacherSelect" :value="item.teacherId">{{item.teacherName}}</option>
                  </select>
                </div> -->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>最少开班人数：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control input input-inline" autocomplete="off" name="minPeople" v-model="formObj.minPeople">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>最大开班人数：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control input input-inline" autocomplete="off" name="maxPeople" v-model="formObj.maxPeople">
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
import basicData from 'common/js/basicData.js';
import Vue from 'vue';
//注册select2组件
Vue.directive('select2', {
  inserted: function (el, binding, vnode) {
    let options = binding.value || {};
    $(el).select2(options).on("select2:select", (e) => {
      // v-model looks for
      // - an event named "change"
      // - a value with property path "$event.target.value"
      el.dispatchEvent(new Event('change', { target: e.target }));
    });
  },
  update: function (el, binding, vnode) {
    for (var i = 0; i < vnode.data.directives.length; i++) {
      if (vnode.data.directives[i].name == "model") {
        $(el).val(vnode.data.directives[i].value);
      }
    }
    $(el).trigger("change");
  }
});

export default {
  data: function () {
    return {
      isAdd: false,           // 是否是新增
      editForm: null,          // 表单元素
      formObj: {},             // 表单对象
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        classBeginTime: '',     //开课时间,时分秒
        classEndTime: '',       //下课时间,时分秒
        reserveEndTime: '',     //停止预约时间,时分秒
        scheduleDate: '',       //开课日期,年月日
        minPeople: '',          //最少开班人数
        maxPeople: '',          //最大开班人数
        scheduleId: '',         //排课ID
        teacherId: '',          //老师id
      };
    },

    // 初始化时间插件
    initDatePicker: function () {
      let self = this;
      let _classBeginTime = $("#classBeginTime");     //开课时间
      let _classEndTime = $("#classEndTime");         //下课时间
      let _reserveEndTime = $("#reserveEndTime");     //停止预约时间
      let _scheduleDate = $("#scheduleDate");         //开课日期

      //   _classBeginTime.timepicker({
      //     // defaultTime: String(new Date()).substring(16, 24), //默认时间
      //     minuteStep: 15,         //分钟加减步数
      //     secondStep: 15,         //秒加减步数
      //     appendWidgetTo: 'body', //允许自定义放置小部件
      //     showSeconds: true,      //显示秒
      //     showMeridian: false,    //24小时制
      //     explicitMode: true,     //用户可以输入“123”将时间设置为“1:23”或“12345”将时间设置为“1:23:45”。
      //   });

      _classBeginTime.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "hh:ii:ss",
        startView: 1,
        // minView: 0
      });
      _classEndTime.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "hh:ii:ss",
        startView: 1,
        // minView: 0
      });
      _reserveEndTime.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "hh:ii:ss",
        startView: 1,
        // minView: 0
      });
      _scheduleDate.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2
      });

      //隐藏时绑定数据
      //   _classBeginTime.timepicker().on("hide", function (ev) {
      //     self.formObj.classBeginTime = _classBeginTime.val();
      //   });

      _classBeginTime.datetimepicker().on("hide", function (ev) {
        self.formObj.classBeginTime = _classBeginTime.val();
      });
      _classEndTime.datetimepicker().on("hide", function (ev) {
        self.formObj.classEndTime = _classEndTime.val();
      });
      _reserveEndTime.datetimepicker().on("hide", function (ev) {
        self.formObj.reserveEndTime = _reserveEndTime.val();
      });
      _scheduleDate.datetimepicker().on("hide", function (ev) {
        self.formObj.scheduleDate = _scheduleDate.val();
      });
    },

    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      let minP = Number(self.formObj.minPeople);
      let maxP = Number(self.formObj.maxPeople);
      let years = new Date().getFullYear();
      let months = new Date().getMonth() + 1;
      let days = new Date().getDate();
      let data = {
        classBeginTime: new Date(years + '-' + months + '-' + days + ' ' + self.formObj.classBeginTime).getTime(),
        classEndTime: new Date(years + '-' + months + '-' + days + ' ' + self.formObj.classEndTime).getTime(),
        reserveEndTime: new Date(years + '-' + months + '-' + days + ' ' + self.formObj.reserveEndTime).getTime(),
        scheduleDate: new Date(self.formObj.scheduleDate).getTime(),
        maxPeople: self.formObj.maxPeople,
        minPeople: self.formObj.minPeople,
        scheduleId: self.formObj.scheduleId,
        teacherId: self.formObj.teacherId,
      };
      //   if (self.editForm.valid()) {
      if (!self.formObj.scheduleDate) {
        bootbox.alert("上课日期不能为空，请选择上课日期!");
        return
      }
      if (!self.formObj.classBeginTime) {
        bootbox.alert("开课时间不能为空，请选择开课时间!");
        return
      }
      if (!self.formObj.classEndTime) {
        bootbox.alert("下课时间不能为空，请选择下课时间!");
        return
      }
      if (!self.formObj.reserveEndTime) {
        bootbox.alert("截止预约时间不能为空，请选择截止预约时间!");
        return
      }
      if (!self.formObj.teacherId) {
        bootbox.alert("关联老师不能为空，请选择关联老师!");
        return
      }
      if (!self.formObj.minPeople) {
        bootbox.alert("开班最小少数不能为空，请输入开班最小少数!");
        return
      }
      if (!self.formObj.maxPeople) {
        bootbox.alert("开班最大人数不能为空，请输入开班最大人数!");
        return
      }
      if (self.formObj.reserveEndTime >= self.formObj.classBeginTime) {
        bootbox.alert("截止预约时间不能大于或者等于上课时间，请重新选择!");
        return
      }
      if (self.formObj.classBeginTime >= self.formObj.classEndTime) {
        bootbox.alert("开课时间不能大于或者等于下课时间，请重新选择!");
        return
      }
      if (minP >= maxP) {
        bootbox.alert("最小开班人数不能大于或者等于最大开班人数，请重新输入!");
        return
      } else {
        $.ajax({
          url: "/api/schedule/updateSchedule",
          type: "POST",
          data: data
        }).done(resp => {
          if (resp.code == "0000") {
            toastr.success(resp.msg);
            setTimeout(() => {
              window.location.reload(true);
            }, 500);
          } else {
            toastr.error(resp.msg);
          }
        });
      }
      //   }
    },


    // 清空错误提示
    clearErrmsg: function () {
      this.editForm.find(".has-error").closest("span").remove();
      this.editForm.find(".has-error").each(function () {
        $(this).removeClass("has-error");
      });
    },
  },

  created: function () {
    let that = this;
    this.$root.$on("openSingleScheduleModal", obj => {
      //初始化select2插件
      $("#single-prepend-text").select2({
        placeholder: '请选择',
        allowClear: true
      });
      that.clearErrmsg();
      that.initFormObj();
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.formObj = base.assignObj(that.formObj, obj);
      };
      $("#edit_scheduleModal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    //挂载时初始化时间插件
    this.initDatePicker();
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_scheduleForm");
    this.editForm.validate({
      rules: {
        classBeginTime: {
          required: true
        },
        classEndTime: {
          required: true
        },
        reserveEndTime: {
          required: true
        },
        scheduleDate: {
          required: true
        },
        maxPeople: {
          required: true
        },
        minPeople: {
          required: true
        },
        teacherId: {
          required: true
        },
      }
    });
  }
};
</script>
<style>
.edit_width {
  width: 186px !important;
  margin-left: 260px !important;
}
.select2-container {
  width: 186px !important;
}
</style>
