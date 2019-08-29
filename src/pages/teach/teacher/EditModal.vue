<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="800">
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
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-4 control-label"><span class="required">*</span>教师名字：</label>
                <div class="col-md-8">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入教师名字" name="teacherName" v-model="formObj.teacherName" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-4 control-label"><span class="required">*</span>教师电话：</label>
                <div class="col-md-8">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入教师电话" name="teacherPhone" v-model="formObj.teacherPhone" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-4 control-label"><span class="required">*</span>性别：</label>
                <div class="col-md-8">
                  <select class="form-control" v-model="formObj.sex" name="sex">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in $root.sexSelect" :value="item.id">{{item.desc}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <!-- 模糊搜索下拉框待完善2019-8-16 -->
                <!-- <label for="single-prepend-text" class="control-label col-md-4"><span class="required">*</span>关联微信:</label>
                <div class="input-group select2-bootstrap-prepend col-md-8 edit_width">
                  <select id="single-prepend-text" v-select2="userSelectData" v-model="formObj.userId" required="required" class="form-control select2">
                    <option value="">请选择</option>
                    <option v-for="item in $root.userSelect" :value="item.userId">{{item.nickName}} {{item.userId}}</option>
                  </select>
                </div> -->

                <label class="col-md-4 control-label"><span class="required">*</span>关联微信：</label>
                <div class="col-md-8 input-group input_and_select">
                  <input type="text" class="form-control " autocomplete="off" placeholder="请输入手机号" v-model="phone" />
                  <span class="input-group-btn">
                    <button class="btn green" type="button" @click="searchUserList($event)"><i class="fa fa-search" style="padding-right:5px;"></i>搜索用户</button>
                  </span>
                </div>
                <div class="input_and_select ">
                  <select class="form-control " name="userId" v-model="formObj.userId">
                    <option selected="selected" value>请选择用户</option>
                    <option id="userId" v-for="item in userList" :value="item.userId">{{item.nickName}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-4 control-label">备注：</label>
                <div class="col-md-8">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
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
      teacherId: '',//教师id
      isAdd: false, // 是否是新增
      editForm: null, // 表单对象
      formObj: {}, // 表单对象
      userSelectData: [], //用户数据
      userList: [],           // 用户下拉框数据
      phone: '',              // 用户电话
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        teacherName: "", // 教师名称
        teacherPhone: "", // 教师电话
        sex: "", // 性别
        remark: "", //备注
        userId: "",//关联用户id
      };
    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.isAdd) {
        self.formObj.teacherId = self.teacherId;
      }
    //   self.formObj.userId = $("#single-prepend-text").select2('val');//获取select2选中的值
      if (self.editForm.valid()) {
        $.ajax({
          url: self.isAdd
            ? "/api/teacher/addTeacher"
            : "/api/teacher/updateTeacher",
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
      }
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
    //获取用户下拉框
    searchUserList: function (event) {
      this.userId = '';
      this.userList = [];
      this.userList = basicData.getUserSelect(this.phone);
    },
  },

  created: function () {
    this.$root.$on("openAddEditModal", obj => {
      //初始化select2插件
      $("#single-prepend-text").select2({
        placeholder: '请选择',
        allowClear: true
      });
      this.clearErrmsg();
      this.initFormObj();
      this.phone = '';
      this.searchUserList();
      this.isAdd = $.isEmptyObject(obj);
      if (!this.isAdd) {
        this.teacherId = obj.teacherId;
        this.formObj = base.assignObj(this.formObj, obj);
      }
      $("#j_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_editForm");
    this.editForm.validate({
      rules: {
        teacherName: {
          required: true
        },
        teacherPhone: {
          required: true
        },
        sex: {
          required: true
        },
        userId: {
          required: true
        },
      }
    });
  }
};
</script>
<style>
.edit_width {
  width: 236px !important;
  margin-left: 146px !important;
}
.select2-container {
  width: 236px !important;
}
/* 关联微信必填项提示语样式 */
#single-prepend-text-error {
  margin-left: 150px !important;
}
.input_and_select {
  width: 234px;
  margin-left: 146px;
}
</style>
