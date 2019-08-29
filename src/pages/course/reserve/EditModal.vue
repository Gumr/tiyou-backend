<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">手动添加预约记录</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <h4 class="form-section font-green">标签信息</h4>
          <!-- 预约日期 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>预约日期：</label>
                <div class="col-md-6">
                  <input type="text" placeholder="请选择预约日期" autocomplete="off" class="form-control input input-inline datetime_input" id="j_startDate" name="scheduleDate"
                    v-model="searchScheduformObj.scheduleDate">
                </div>
              </div>
            </div>
            <!-- 教学点 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>教学点：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="searchScheduformObj.teachPlaceId" @change="getCourseScheduleSelect($event)">
                    <option value=''>请选择教学点</option>
                    <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- 选择排课 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>选择排课：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.scheduleId">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in courseScheduleList" :value="item.scheduleId">{{item.courseName}} ({{item.classBeginTime}} - {{item.classEndTime}})</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- 支付方式 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>支付方式：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.payType">
                    <option value="1" selected="selected">课币</option>
                    <option value="2">体验卡</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- 预约用户 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>预约用户：</label>
                <div class="col-md-6 input-group second input_and_select">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入手机号搜索用户" v-model="phone" />
                  <span class="input-group-btn">
                    <button class="btn green" type="button" @click="searchUserList($event)"><i class="fa fa-search" style="padding-right:5px;"></i>搜索用户</button>
                  </span>
                </div>
                <div class="input_and_select ">
                  <select class="form-control " style="" name="userId" v-model="formObj.userId" @change="getStudentSelect($event)">
                    <option selected="selected" value>请选择预约用户</option>
                    <option id="userId" v-for="item in userList" :value="item.userId">{{item.nickName}}</option>
                  </select>
                </div>

                <!-- select模糊搜索待完善--2019-8-16 -->
                <!-- <div class="input_and_select select2-bootstrap-prepend">
                  <select id="single-prepend-text-user" v-select2="" v-model="formObj.userId" required="required" class="form-control select2">
                    <option value="">请选择预约用户</option>
                    <option v-for="item in userList" :value="item.userId">{{item.nickName}} {{item.userId}}</option>
                  </select>
                </div> -->
              </div>
            </div>
            <!-- 选择宝宝 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>选择宝宝：</label>
                <div class="col-md-6 " style="display:flex;">
                  <select class="form-control " v-model="formObj.studentId" style="width:162px;">
                    <option selected="selected" value="">请选择上课学生</option>
                    <option v-for="item in studentList" :value="item.studentId">{{item.studentName}}</option>
                  </select>
                  <button v-show="checkPermissions(['createStudent'])" type="button" class="btn green" @click="onStudentEditForm($event)"><i class="fa fa-plus-square"
                      style="padding-right:5px;"></i>新增宝宝</button>
                </div>

                <!-- <div class="col-md-6 input-group input_and_select select2-bootstrap-prepend">
                  <select id="single-prepend-text" v-select2="" v-model="formObj.studentId" required="required" class="form-control select2">
                    <option value="">请选择</option>
                    <option v-for="item in studentList" :value="item.studentId">{{item.studentName}}</option>
                  </select>
                  <button v-show="checkPermissions(['createStudent'])" type="button" class="btn green" @click="onStudentEditForm($event)"><i class="fa fa-plus-square"
                      style="padding-right:5px;"></i>新增宝宝</button>
                </div> -->
              </div>
            </div>
          </div>
          <div class="row">
            <!-- 备注 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">备注：</label>
                <div class="col-md-6">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="" name="minAge" v-model="formObj.remark" />
                  </div>
              </div>
            </div>
          </div>

        <!-- 新增宝宝信息弹窗 -->
          <div class="add-classroomConfig-modal">
            <div class="modal fade" id="j_addStudentModal" tabindex="-2" data-width="600" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">添加宝宝</h4>
                  </div>
                  <div class="modal-body">
                    <form action class="form-horizontal" id="classroomConfig_editForm">
                      <div class="form-body">
                        <div class="form-group">
                          <label class="col-md-3 control-label text-center">姓名：</label>
                          <div class="col-md-6">
                            <input type="search" class="form-control input input-inline  max_width" placeholder="请输入宝宝姓名"  v-model="studentformObj.studentName">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-md-3 control-label text-center">性别：</label>
                          <div class="col-md-6">
                            <select class="form-control max_width" v-model="studentformObj.sex">
                                <option selected="selected" value="">请选择</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-md-3 control-label text-center">生日：</label>
                          <div class="col-md-6">
                            <input type="search" class="form-control input input-inline max_width" autocomplete="off" placeholder="请选择日期" id="j_endTime" name="birthday" v-model="studentformObj.birthday">
                          </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label text-center">亲属关系：</label>
                            <div class="col-md-6">
                                <input type="text" class="form-control max_width" autocomplete="off" placeholder="请输入亲属关系"  v-model="studentformObj.relation" />
                            </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn green" @click="addStudent($event)">保存</button>
                    <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消</button>
                  </div>
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
                  <button type="button" class="btn green" @click="onSubmit($event)">创建</button>
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

      editForm: null,         // 表单对象
      isAdd: false,           // 是否是新增
      formObj: {},            // 手工预约记录表单对象
      searchScheduformObj: {},// 查询排课数据表单对象
      studentformObj: {},     // 宝宝数据表单对象
      studentList: [],        // 上课学生下拉框数据
      courseScheduleList: [], // 排课下拉框数据
      userList: [],           // 用户下拉框数据
      phone: '',              // 用户电话
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        userId: '',             //用户id            
        scheduleId: '',         // 排课id
        studentId: '',          // 学生id
        payType: '',            // 支付方式
        remark: '',             //备注
      };
    },
    initSearchScheduformObj: function () {
      this.searchScheduformObj = {
        scheduleDate: '',       // 预约日期
        teachPlaceId: '',       // 教学点id
      };
    },
    initStudentformObj: function () {
      this.studentformObj = {
        studentName: '',       // 学生姓名
        sex: '',               // 性别(1=男，2=女)
        birthday: '',          // 生日("2019-05-02")
        userId: '',            // 家长用户ID
        relation: '',          // 亲属关系(非必填)

      };
    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.formObj.scheduleId) {
        bootbox.alert('请选择排课!');
        return
      }
      if (!self.formObj.payType) {
        bootbox.alert('请选择支付方式!');
        return
      }
      if (!self.formObj.userId) {
        bootbox.alert('请选择预约用户!');
        return
      }
      if (!self.formObj.studentId) {
        bootbox.alert('请选择上课学生!');
        return
      }
      $.ajax({
        url: '/api/course/createReserve',
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

    // 提交表单
    addStudent: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.formObj.userId) {
        bootbox.alert('请先选择预约用户!');
        return
      }
      if (!self.studentformObj.studentName) {
        bootbox.alert('请输入宝宝姓名!');
        return
      }
      if (!self.studentformObj.sex) {
        bootbox.alert('请选择宝宝性别!');
        return
      }
      if (!self.studentformObj.birthday) {
        bootbox.alert('请选择宝宝出生日期!');
        return
      }
      self.studentformObj.userId = self.formObj.userId;
      $.ajax({
        url: '/api/user/createStudent',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(self.studentformObj)
      }).done(resp => {
        if (resp.code == '0000') {
          toastr.success(resp.msg);
          $("#j_addStudentModal").modal('hide');
          setTimeout(() => {
            self.getStudentSelect();
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
    // 初始化时间插件
    initTimePicker: function () {
      let self = this;
      let _start = $("#j_startDate");   //预约日期
      let _birthday = $("#j_endTime");   //宝宝生日
      _start.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2
      });
      _birthday.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2
      });
      //隐藏时绑定数据
      _start.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.searchScheduformObj.scheduleDate = _start.val();
      });
      _birthday.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.studentformObj.birthday = _birthday.val();
      });
    },
    // 打开添加宝宝表单的Modal弹窗
    onStudentEditForm: function (event, obj) {
      event.preventDefault();
      if (!this.formObj.userId) {
        bootbox.alert('请先选择预约用户!');
        return
      }
      this.$root.$emit("openClassRoomConfModal", obj == null ? {} : obj);
    },
    //获取学生下拉框
    getStudentSelect: function (_this) {
      this.studentList = [];
      this.studentList = basicData.getStudentSelect((this.formObj.userId));
      //   this.$forceUpdate();

    },
    //获取用户下拉框
    searchUserList: function (event) {
      this.userList = [];
      this.userList = basicData.getUserSelect(this.phone);
    },

    //获取排课下拉框
    getCourseScheduleSelect: function (event) {
      this.courseScheduleList = [];
      this.courseScheduleList = basicData.getCourseScheduleSelect(this.searchScheduformObj);
    },
  },

  watch: {
    //监听日期选择实时获取排课数据
    searchScheduformObj: {
      handler: function (val, oldval) {
        if (val.scheduleDate) {
          this.getCourseScheduleSelect();
        }
      },
      deep: true//对象内部的属性监听，也叫深度监听
    },
    //监听用户下拉选择数据
    formObj: {
      handler: function (val, oldval) {
        if (val.userId) {
          this.getStudentSelect();
        }
      },
      deep: true//对象内部的属性监听，也叫深度监听
    },



  },

  created: function () {
    this.$root.$on('openAddEditModal', obj => {
      //初始化select2插件
      $("#single-prepend-text").select2({
        placeholder: '请选择上课宝宝',
        allowClear: true
      });
      //初始化select2插件
      $("#single-prepend-text-user").select2({
        placeholder: '请选择预约用户',
        allowClear: true
      });
      this.userList = [];
      this.clearErrmsg();
      this.initFormObj();
      this.initSearchScheduformObj();
      this.initStudentformObj();
      this.getCourseScheduleSelect(this.scheduleDate, this.teachPlaceId);
    //   this.searchUserList();
      this.formObj.payType = 1;
      $('#j_modal').modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });

    //教室配置信息弹窗数据
    this.$root.$on("openClassRoomConfModal", objs => {
      $("#j_addStudentModal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
    // 初始化表单对象和表单参数校验规则
    this.editForm = $('#j_editForm');
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
  padding: 0 94px 0 12px !important;
}
.input_and_select {
  width: 266px;
  margin-left: 166px;
}
.max_width {
  width: 200px !important;
}
.select2-container {
  width: 166px !important;
}
</style>
