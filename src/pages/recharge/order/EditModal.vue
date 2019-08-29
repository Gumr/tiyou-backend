<template>
  <div id="add_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">手工订单</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <h4 class="form-section font-green">标签信息</h4>
          <!-- 预约时间 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>预约时间：</label>
                <div class="col-md-6">
                  <input type="text" placeholder="请选择开始日期" autocomplete="off" class="form-control input input-inline datetime_input" id="j_startTime" name="startTime" v-model="formObj.minAge">
                </div>
              </div>
            </div>
            <!-- 预约教室 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>预约教室：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.minAge">
                    <option selected="selected" value>请选择教室</option>
                    <!-- <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option> -->
                  </select>
                </div>
              </div>
            </div>
          </div>
          <!-- 预约课程 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>预约课程：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.minAge">
                    <option selected="selected" value>请选择课程</option>
                    <!-- <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option> -->
                  </select>
                </div>
              </div>
            </div>
            <!-- 用户名称 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>用户名称：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="" name="minAge" v-model="formObj.minAge" />
                </div>
              </div>
            </div>
          </div>
          <!-- 选择宝宝 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>选择宝宝：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="" name="minAge" v-model="formObj.minAge" />
                </div>
              </div>
            </div>
            <!-- 操作人 -->
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>操作人：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="" name="minAge" v-model="formObj.minAge" />
                </div>
              </div>
            </div>
          </div>
          <!-- 备注 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">备注：</label>
                <div class="col-md-6">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="" name="minAge" v-model="formObj.minAge" />
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
import base from 'common/js/utils/base.js';

export default {

  data: function () {
    return {
      ueID: null,
      editForm: null,         // 表单对象
      isAdd: false,           // 是否是新增
      formObj: {},            // 表单对象  
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        courseName: '',            // 课程名称                  
        extraName: '',          // 外部名称
        coverImg: '',         // 封面图片
        bannerImg: [],      // 轮播图
        lcoinPrice: '',  //课币单价
        minAge: '', //最小年龄
        maxAge: '',//最大年龄
        courseType: '',//课程类型
        detail: '',//详情
        sort: '',//排序
        remark: '',//备注
      };
    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (self.editForm.valid()) {
        $.ajax({
          url: self.isAdd ? '/api/rbac/addDepartment' : '/api/rbac/updateDepartment',
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
      }
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
      let _start = $("#j_startTime");   //开始日期元素
      let _end = $("#j_endTime");       //结束日期元素
      _start.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd hh:ii:ss",
        minView: 0
      });
      _end.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd hh:ii:ss",
        minView: 0
      });
      //隐藏时绑定数据
      _start.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.startTime = _start.val();
      });
      _end.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.endTime = _end.val();
      });
    },

  },

  created: function () {
    this.$root.$on('openAddEditModal', obj => {
      this.clearErrmsg();
      this.initFormObj();
      this.isAdd = $.isEmptyObject(obj);
      if (!this.isAdd) {
        this.formObj = base.assignObj(this.formObj, obj);
      };

      $('#add_modal').modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
    // 初始化表单对象和表单参数校验规则
    this.editForm = $('#j_editForm');
    this.editForm.validate({
      rules: {
        dname: {
          required: true
        },
        dataStatus: {
          required: true
        }
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
