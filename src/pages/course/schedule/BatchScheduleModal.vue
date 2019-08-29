<template>
  <div id="j_scheduleModal" class="portlet light bordered modal fade" tabindex="-1" data-width="1000">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">批量排课</span>
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
                <label class="col-md-1 control-label"><span class="required">*</span>日期</label>
                <div class="col-md-10">
                  <input type="text" placeholder="请选择开始日期" autocomplete="off" class="form-control input input-inline" id="j_startTime" name="startTime" v-model="formObj.startTime"> -
                  <input type="text" placeholder="请选择结束日期" autocomplete="off" class="form-control input input-inline " id="j_endTime" name="endTime" v-model="formObj.endTime">
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-1 control-label"><span class="required">*</span>主题</label>
                <div class="col-md-2">
                  <select name="themeId" class="form-control input" v-model="formObj.themeId" @change="$root.getCourseSelect(formObj.themeId, formObj.courseType)">
                    <option value="">请选择主题</option>
                    <option v-for="item in $root.themeSelect" :value="item.themeId">{{item.themeName}}</option>
                  </select>
                </div>
                <label class="col-md-1 control-label"><span class="required">*</span>类型</label>
                <div class="col-md-2">
                  <select name="courseType" class="form-control input" v-model="formObj.courseType" @change="$root.getCourseSelect(formObj.themeId, formObj.courseType)">
                    <option value="">请选择类型</option>
                    <option v-for="item in $root.courseTypeSelect" :value="item.courseTypeId">{{item.courseTypeName}}</option>
                  </select>
                </div>
                <label class="col-md-1 control-label"><span class="required">*</span>课程</label>
                <div class="col-md-4">
                  <select name="courseId" class="form-control input" v-model="formObj.courseId">
                    <option value="">请选择课程</option>
                    <option v-for="item in $root.courseSelect" :value="item.courseId">{{item.courseName}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <h4 class="form-section font-green">
            请选择：
            教学点
            <i class="fa fa-chevron-circle-right"></i>
            教室
            <i class="fa fa-chevron-circle-right"></i>
            排课时间</h4>
          <div class="row">
            <div class="form-group">
              <div class="jstree jstree-default jstree-checkbox-selection">
                <batch-schedule-tree-node :treeDataList="teachPlaceTree" :treeDataMap="teachPlaceMap" :selectList="selected" @emitNodeSelected="onSelectNode"></batch-schedule-tree-node>
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
import BatchScheduleTreeNode from "./BatchScheduleTreeNode.vue";

export default {
  components: {
    BatchScheduleTreeNode,
  },

  data: function () {
    return {
      isAdd: false,            // 是否是新增
      editForm: null,          // 表单元素
      formObj: {},             // 表单对象
      teachPlaceTree: [],      // 教学点树形结构
      teachPlaceMap: {},
      selected: [],            //所有被选中的ID,界面打钩使用
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        startTime: '',          //开始日期
        endTime: '',            //截止日期
        themeId: '',            //主题ID
        courseType: '',         //课程类型
        courseId: '',           //课程ID
        classRoomConfIds: [],   //选中教室配置ID
      };
    },

    // 初始化时间插件
    initDatePicker: function () {
      let self = this;
      let _start = $("#j_startTime");     //开始日期元素
      let _end = $("#j_endTime");         //结束日期元素

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
      _start.datetimepicker().on("hide", function (ev) {
        self.formObj.startTime = _start.val();
      });
      _end.datetimepicker().on("hide", function (ev) {
        self.formObj.endTime = _end.val();
      });
    },

    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      let data = {
        startTime: new Date(self.formObj.startTime+'  '+'00'+':'+'00'+':'+'00').getTime(),
        endTime: new Date(self.formObj.endTime+'  '+'23'+':'+'59'+':'+'59').getTime(),
        themeId: self.formObj.themeId,
        courseType: self.formObj.courseType,
        courseId: self.formObj.courseId,
        classRoomConfIds: JSON.stringify(self.formObj.classRoomConfIds)
      };
      //   if (self.editForm.valid()) {
      if (!self.formObj.startTime) {
        bootbox.alert('开始日期不能为空，请选择!')
        return
      }
      if (!self.formObj.endTime) {
        bootbox.alert('结束日期不能为空，请选择!')
        return
      }
      if (new Date(self.formObj.startTime).getTime() > new Date(self.formObj.endTime).getTime()) {
        bootbox.alert('开始日期不能大于结束日期，请选择!')
        return
      }
      if (!self.formObj.themeId) {
        bootbox.alert('课程主题不能为空，请选择!')
        return
      }
      if (!self.formObj.courseType) {
        bootbox.alert('课程类型不能为空，请选择!')
        return
      }
      if (!self.formObj.courseId) {
        bootbox.alert('课程名称不能为空，请选择!')
        return
      }
      if (self.formObj.classRoomConfIds.length <= 0) {
        bootbox.alert('排课时间段不能为空，请选择!')
        return
      }
      $.ajax({
        url: self.isAdd ? "/api/schedule/addSchedule" : "/api/schedule/updateSchedule",
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
      //   }
    },

    // 节点被选中,判断操作行为,添加或者删除权限ID
    onSelectNode: function (treeNode, isSelect) {
      let id = treeNode.id;
      let index = this.selected.indexOf(id);
      let idx = this.formObj.classRoomConfIds.indexOf(id);
      if (isSelect) {
        if (index == -1) {
          this.selected.push(id);
        }
        if (idx == -1 && treeNode.type == 5) {
          this.formObj.classRoomConfIds.push(id);
        }
      } else {
        if (index > -1) {
          this.selected.splice(index, 1);
        }
        if (idx > -1) {
          this.formObj.classRoomConfIds.splice(idx, 1);
        }
      }

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
    this.$root.$on("openBatchScheduleModal", obj => {
      this.clearErrmsg();
      this.initFormObj();
      let teachPlaceTreeData = basicData.getTeachPlaceTree();     //获取树形数据
      this.teachPlaceTree = teachPlaceTreeData.treeList;
      this.isAdd = $.isEmptyObject(obj);
      if (!this.isAdd) {
        this.formObj = base.assignObj(this.formObj, obj);
      };

      $("#j_scheduleModal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    //挂载时初始化时间插件
    this.initDatePicker();

    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_scheduleForm");
    this.editForm.validate({
      rules: {
        startTime: {
          required: true
        },
        endTime: {
          required: true
        },
        themeId: {
          required: true
        },
        courseId: {
          required: true
        },
        courseType: {
          required: true
        },
      }
    });
  }
};
</script>