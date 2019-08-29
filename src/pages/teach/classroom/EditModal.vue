<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">新增|编辑</span>
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
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center"><span class="required">*</span>教室名称：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入教室名称" name="classroomName" v-model="formObj.classroomName" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center"><span class="required">*</span>所属教学点：</label>
                <div class="col-md-6">
                  <select class="form-control" name="teachPlaceId" v-model="formObj.teachPlaceId">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label text-center"><span class="required">*</span>最低开班人数：</label>
              <div class="col-md-6">
                <input type="text" class="form-control" autocomplete="off" placeholder="请输入最低开班人数" name="minPeople" v-model="formObj.minPeople" />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label text-center"><span class="required">*</span>最多容纳人数：</label>
              <div class="col-md-6">
                <input type="text" class="form-control" autocomplete="off" placeholder="请输入最多容纳人数" name="maxPeople" v-model="formObj.maxPeople" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label text-center"><span class="required">*</span>关联默认老师：</label>
              <div class="col-md-6 input-group input_and_select">
                <input type="text" class="form-control" autocomplete="off" placeholder="请输入手机号搜索老师" v-model="contactPhone" v-on:input="searchTeacherList($event)" />
                <span class="input-group-btn">
                  <button type="button" class="btn green " @click="searchTeacherList($event)"><i class="fa fa-search" style="padding-right:5px;"></i>搜索老师</button>
                </span>
              </div>
              <div class="input_and_select input_and_select select2-bootstrap-prepend">
                <select id="single-prepend-text-user" v-select2="" v-model="formObj.teacherId" name="teacherId" required="required" class="form-control select2">
                  <option value="">请选择关联老师</option>
                  <option v-for="item in teacherList" :value="item.teacherId">{{item.teacherName}}  {{item.teacherId}}</option>
                </select>
              </div>
              <!-- <div class="input_and_select">
                <select class="form-control" name="teacherId" v-model="formObj.teacherId">
                  <option selected="selected" value>请选择关联老师</option>
                  <option v-for="item in teacherList" :value="item.teacherId">{{item.teacherName}}</option>
                </select>
              </div> -->
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label text-center">排序：</label>
              <div class="col-md-6">
                <input type="text" class="form-control" v-model="formObj.sort" autocomplete="off" placeholder="值越小权重越高" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label">备注：</label>
              <div class="col-md-6">
                <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
                </div>
              </div>
            </div>
          </div>
        <h4 class="form-section font-green">排课时间段</h4>
        <div class="row row_margin">
          <div class="form-group">
            <a v-show="checkPermissions(['addClassRoomConfig'])" v-if="classRoomId != null" @click="onClassRoomConfEditForm($event)" class="btn green-meadow" href="javascript:;">
              <i class="fa fa-plus-square"></i> 添加时间段
            </a>
            <div class="table-scrollable" v-if="classRoomConfList.length > 0">
              <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                <thead>
                  <tr>
                    <th class="text-center">截止预约时间</th>
                    <th class="text-center">开课时间</th>
                    <th class="text-center">结束时间</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(obj,idx) in classRoomConfList">
                    <td class="text-center">{{obj.reserveEndTime}}</td>
                    <td class="text-center">{{obj.classBeginTime}}</td>
                    <td class="text-center">{{obj.classEndTime}}</td>
                    <td class="text-center">
                      <a v-show="checkPermissions(['updateClassRoomConf'])" @click="onClassRoomConfEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                        <i class="fa fa-edit"></i> 编辑
                      </a>
                      <a v-show="checkPermissions(['deleteClassRoomConf'])" @click="deleteClassRoomConf($event,obj.id)" class="btn btn-xs purple" href="javascript:;">
                        <i class="fa fa-edit"></i> 删除
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="alert alert-success no-margin margin-top-10" v-if="classRoomConfList.length <= 0">
              <span>暂无数据</span>
            </div>
            <!-- 添加排课时间段（教室配置） -->
          </div>
          <div class="add-classroomConfig-modal">
            <div class="modal fade" id="j_classroomConfigModa" tabindex="-2" data-width="600" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">添加排课时间段</h4>
                  </div>
                  <div class="modal-body">
                    <form action class="form-horizontal" id="classroomConfig_editForm">
                      <div class="form-body">
                        <div class="form-group">
                          <label class="col-md-3 control-label text-center">截止预约时间：</label>
                          <div class="col-md-6">
                            <input type="search" class="form-control input input-inline " autocomplete="off" placeholder="请选择截止预约时间" id="j_reEndTime" v-model="deadlineTime">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-md-3 control-label text-center">开课时间：</label>
                          <div class="col-md-6">
                            <input type="search" class="form-control input input-inline " autocomplete="off" placeholder="请选择开课时间" id="j_beginTime" v-model="startTime">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-md-3 control-label text-center">结束时间：</label>
                          <div class="col-md-6">
                            <input type="search" class="form-control input input-inline " autocomplete="off" placeholder="请选择结束时间" id="j_endTime" v-model="stopTime">
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn green" @click="saveClassRoomConf($event)">保存</button>
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
import FileUpload from "components/file-upload/file-upload.vue";
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
  components: {
    FileUpload
  },
  data: function () {
    return {
      startTime: "",            //上课时间--显示用
      stopTime: "",             //下课时间--显示用
      deadlineTime: "",         //截止预约时间--显示用
      classRoomId: null,        //教室id
      classRoomConfId: null,    //教室配置id
      classRoomConfList: [],    //教室配置数据
      contactPhone: '',         //老师电话
      teacherList: [],          //老师列表
      editForm: null,           // 表单对象
      isAdd: false,             // 是否是新增
      formObj: {},              // 表单对象
      classRoomConfObj: {},     //教室配置表单对象
      isClassRoomConfAdd: false,//是否新增教室配置数据
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        classroomName: "",  //教室名称
        teachPlaceId: "",   //所属教学点id
        minPeople: "",      //开班最小少数
        maxPeople: "",      //开班最大人数
        teacherId: "",      //关联老师id
        sort: "",           //排序
        remark: "",         //备注
      };
    },
    // 初始化教室配置表单参数
    initClassRoomConfObj: function () {
      this.classRoomConfObj = {
        classBeginTime: "", //开课时间
        classEndTime: "",   //下课时间
        reserveEndTime: "", //截止预约时间
      };

    },
    // 教室基础信息提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      let minP = Number(self.formObj.minPeople);
      let maxP = Number(self.formObj.maxPeople);
      if (!self.isAdd) {
        self.formObj.classRoomId = self.classRoomId;
      }
      if (!self.formObj.classroomName) {
        bootbox.alert("教室名称不能为空，请输入教室名称!");
        return
      }
      if (!self.formObj.teachPlaceId) {
        bootbox.alert("所属教学点不能为空，请选择对应教学点!");
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
      if (!self.formObj.teacherId) {
        bootbox.alert("关联默认老师不能为空，请先输入老师电话查找选择默认关联老师!");
        return
      }
      if (minP > maxP) {
        bootbox.alert("最小开班人数不能大于最大开班人数，请重新输入!");
        return
      }
      // if (self.editForm.valid()) {
      $.ajax({
        url: self.isAdd
          ? "/api/classRoom/addClassRoom"
          : "/api/classRoom/updateClassRoom",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self.formObj)
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
      //   }

    },
    //教室配置信息提交
    saveClassRoomConf: function (event) {
      event.preventDefault();
      var self = this;
      let years = new Date().getFullYear();
      let months = new Date().getMonth() + 1;
      let days = new Date().getDate();
      if (!self.isClassRoomConfAdd) {
        self.classRoomConfObj.classRoomConfId = self.classRoomConfId;
      } else {
        self.classRoomConfObj.classRoomId = self.classRoomId;
      }
      self.classRoomConfObj.classBeginTime = new Date(years + '-' + months + '-' + days + ' ' + self.startTime).getTime();
      self.classRoomConfObj.classEndTime = new Date(years + '-' + months + '-' + days + ' ' + self.stopTime).getTime();
      self.classRoomConfObj.reserveEndTime = new Date(years + '-' + months + '-' + days + ' ' + self.deadlineTime).getTime();
      if (!self.deadlineTime) {
        bootbox.alert('截止预约时间不能为空，请选择截止预约时间!')
        return
      }
      if (!self.startTime) {
        bootbox.alert('开课时间不能为空，请选择开课时间!')
        return
      }
      if (!self.stopTime) {
        bootbox.alert('下课时间不能为空，请选择下课时间!')
        return
      }
      if (self.deadlineTime >= self.startTime) {
        bootbox.alert('截止预约时间不能大于或者等于上课时间，请重新选择!')
        return
      }
      if (self.startTime >= self.stopTime) {
        bootbox.alert('上课时间不能大于或者等于下课时间，请重新选择!')
        return
      }
      $.ajax({
        url: self.isClassRoomConfAdd
          ? "/api/classRoomConfig/addClassRoomConfig"
          : "/api/classRoomConfig/updateClassRoomConf",
        type: "POST",
        data: self.classRoomConfObj
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          $("#j_classroomConfigModa").modal('hide');  //手动关闭教室配置弹窗
          setTimeout(() => {
            self.getClassRoomConf(self.classRoomId);
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
    //根据手机号查询老师
    searchTeacherList: function (event) {
      this.formObj.teacherId = '';
      this.teacherList = [];
      this.teacherList = basicData.getTeacherSelect(this.contactPhone);
    },
    //查询教室配置 
    getClassRoomConf: function (classRoomId) {
      let that = this;
      $.ajax({
        url: "/api/classRoomConfig/getClassRoomConf",
        type: "POST",
        data: { classRoomId: classRoomId }
      }).done(resp => {
        if (resp.code == "0000") {
          that.classRoomConfList = resp.data;
        }
      });
    },
    //删除教室配置
    deleteClassRoomConf: function (event, classRoomConfId) {
      let that = this;
      if (classRoomConfId) {
        $.ajax({
          url: "/api/classRoomConfig/deleteClassRoomConf",
          type: "POST",
          data: { classRoomConfId: classRoomConfId }
        }).done(resp => {
          if (resp.code == "0000") {
            toastr.success(resp.msg);
            that.getClassRoomConf(that.classRoomId);
          } else {
            toastr.error(resp.msg);
          }
        });
      }
    },
    // 打开添加与编辑教室配置表单的Modal弹窗
    onClassRoomConfEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openClassRoomConfModal", obj == null ? {} : obj);
    },
    // 初始化时间插件
    initTimePicker: function () {
      let self = this;

      let _reEnd = $("#j_reEndTime");   //截止预约日期元素
      let _start = $("#j_beginTime");   //开始日期元素
      let _end = $("#j_endTime");       //结束日期元素

      _reEnd.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "hh:ii",
        startView: 1,
        // minView: 1
      });
      _start.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "hh:ii",
        startView: 1,
        // minView: 1
      });
      _end.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "hh:ii",
        startView: 1,
        // minView: 1
      });
      //   _start.timepicker({
      //     defaultTime: String(new Date()).substring(16, 24), //默认时间
      //     minuteStep: 15,         //分钟加减步数
      //     secondStep: 15,         //秒加减步数
      //     appendWidgetTo: 'body', //允许自定义放置小部件
      //     showSeconds: true,      //显示秒
      //     showMeridian: false,    //24小时制
      //     explicitMode: true,     //用户可以输入“123”将时间设置为“1:23”或“12345”将时间设置为“1:23:45”。
      //   });

      //隐藏时绑定数据
      _reEnd.datetimepicker().on("hide", function (ev) {
        self.deadlineTime = _reEnd.val();
        console.log('_reEnd.val()',_reEnd.val())
      });
      _start.datetimepicker().on("hide", function (ev) {
        self.startTime = _start.val();
      });
      _end.datetimepicker().on("hide", function (ev) {
        self.stopTime = _end.val();
      });

    },
  },

  created: function () {
    let that = this;
    //教室基础信息弹窗数据
    this.$root.$on("openAddEditModal", obj => {
      //初始化select2插件
      $("#single-prepend-text").select2({
        placeholder: '请选择',
        allowClear: true
      });
      that.classRoomId = null;
      that.startTime = '';
      that.stopTime = '';
      that.deadlineTime = '';
      that.teacherList = [];
      that.clearErrmsg();
      that.initFormObj();
      that.classRoomConfList = [];
      that.searchTeacherList();
      if (obj.classRoomId) {
        that.getClassRoomConf(obj.classRoomId);//获取教室配置数据
        that.classRoomId = obj.classRoomId;
      }
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.formObj = base.assignObj(this.formObj, obj);
        that.teacherList.push({ teacherId: obj.teacherId, teacherName: obj.teacherName });
      }
      $("#j_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });


    //教室配置信息弹窗数据
    this.$root.$on("openClassRoomConfModal", objs => {
      this.clearErrmsg();
      this.initClassRoomConfObj();
      this.startTime = '';
      this.stopTime = '';
      this.deadlineTime = '';
      this.isClassRoomConfAdd = $.isEmptyObject(objs);
      if (!this.isClassRoomConfAdd) {
        this.classRoomConfId = objs.id;
        this.classRoomConfObj = base.assignObj(this.classRoomConfObj, objs);
        this.startTime = (String(objs.classBeginTime)).substring(0,5);
        this.stopTime = (String(objs.classEndTime)).substring(0,5);
        this.deadlineTime = (String(objs.reserveEndTime)).substring(0,5);
      }
      $("#j_classroomConfigModa").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });

  },
  updated: function () {

  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_editForm");
    // this.classroomEditForm = $("#j_classroomConfigModa");
    this.editForm.validate({
      rules: {
        classroomName: {
          required: true
        },
        teachPlaceId: {
          required: true
        },
        minPeople: {
          required: true
        },
        maxPeople: {
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
.banner {
  display: flex;
  margin-top: 10px;
}

.box {
  position: relative;
  margin-right: 10px;
}

.delete {
  position: absolute;
  display: block;
  text-align: center;
  border-radius: 50%;
  left: 0;
  right: 0;
  bottom: 0;
}

.range {
  display: flex;
  align-items: center;
}

#templ {
  display: flex;
  justify-content: center;
}
#map {
  width: 500px;
  height: 300px;
  margin-left: 140px;
}
.input_and_select {
  width: 266px;
  margin-left: 166px;
}
</style>