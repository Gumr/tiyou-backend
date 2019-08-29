<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 类型 -->
                <!-- <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程类型:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.courseType" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.courseTypeList" :value="item.courseTypeId">{{item.courseTypeName}}</option>
                    </select>
                  </div>
                </div> -->
                <!-- 主题 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程主题:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.themeId" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.themeList" :value="item.themeId">{{item.themeName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 课程状态 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.statusList" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 适龄范围 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">适龄范围:</label>
                  <div class="range_container">
                    <div class="range_content">
                      <input type="text" class="form-control " autocomplete="off" placeholder="最小年龄" v-model="searchParam.minAge" />
                    </div>
                    <div>--</div>
                    <div class="range_content">
                      <input type="text" class="form-control" autocomplete="off" placeholder="最大年龄" v-model="searchParam.maxAge" />
                    </div>
                  </div>
                </div>
                <!-- 课程名称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程名称:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入课程名称" v-model="searchParam.courseName" @keyup.enter="onSearch($event)" />
                  </div>
                </div>
              </div>
              <!-- 清空/搜索 -->
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-md-offset-0 col-md-12">
                      <button type="button" class="btn default" @click="clearSearch($event)"><i class="fa fa-remove"></i> 清空</button>
                      <button type="button" class="btn blue" @click="onSearch($event)"><i class="fa fa-search"></i> 搜索</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <a v-show="checkPermissions(['addCourse'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 新增课程
          </a>
          <button v-show="checkPermissions(['createCoursePick'])" @click="createCoursePick($event)" type="button" class="btn blue-madison"><i class="fa fa-arrow-circle-o-up"></i> 添加热门推荐</button>
          <button v-show="checkPermissions(['deleteCoursePick'])" @click="deleteCoursePick($event)" type="button" class="btn grey-cascade"><i class="fa fa-arrow-circle-o-down"></i> 取消热门推荐</button>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th>
                    <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                      <input type="checkbox" class="group-checkable" value="true" v-model="checkAll" @click="doCheckAll">
                      <span></span>
                    </label>
                  </th>
                  <th class="text-center">课程ID</th>
                  <th class="text-center">课程名称</th>
                  <th class="text-center">拓展名称</th>
                  <th class="text-center">封面图片</th>
                  <th class="text-center">是否热门推荐</th>
                  <th class="text-center">所属主题</th>
                  <th class="text-center">适龄范围</th>
                  <th class="text-center">对应课时</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">创建时间</th>
                  <th class="text-center">修改时间</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList" :key="idx">
                  <td>
                    <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                      <input type="checkbox" class="checkboxes" :value="obj.courseId" v-model="checkboxIds">
                      <span></span>
                    </label>
                  </td>
                  <td class="text-center">{{obj.courseId || '--'}}</td>
                  <td class="text-center">{{obj.courseName || '--'}}</td>
                  <td class="text-center">{{obj.extraName || '--'}}</td>
                  <td class="text-center">
                    <a class="ib" v-show="obj.coverImg" :href="obj.coverImg" target="_blank">
                      <img v-show="obj.coverImg" :src="obj.coverImg" style="width:80px;height:30px;">
                    </a>
                  </td>
                  <td class="text-center">
                    <span v-if="obj.pickId" class="btn btn-xs btn-outline blue">热门推荐</span>
                    <span v-else>--</span>
                  </td>
                  <td class="text-center">{{obj.themeName || '--'}}</td>
                  <td class="text-center">{{obj.minAge || '--'}}-{{obj.maxAge || '--'}}</td>
                  <td class="text-center">{{obj.lcoinPrice || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{$root.statusMap[obj.status] || '--'}}</span>
                  </td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">{{obj.updateTime || '--'}}</td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateCourse'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 编辑
                    </a>
                    <a v-show="checkPermissions(['updateCourseStatus'])" v-if="obj.status == '1'" @click="updateCourseStatus($event,obj.courseId,0)" class="btn btn-xs red" href="javascript:;">
                      <i class="fa fa-level-down"></i> 下架
                    </a>
                    <a v-show="checkPermissions(['updateCourseStatus'])" v-if="obj.status == 0" @click="updateCourseStatus($event,obj.courseId,1)" class="btn btn-xs  green" href="javascript:;">
                      <i class="fa fa-level-up "></i> 上架
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="alert alert-success no-margin margin-top-10" v-if="dataList.length <= 0">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <pager ref="pager" :config="pagerConfig"></pager>
  </div>
</template>

<script>
import Pager from "components/Pager.vue";

export default {
  components: {
    Pager
  },

  data: function () {
    return {
      searchParam: {}, // 搜索参数
      dataList: [], // 列表数据
      checkAll: false,              // 是否全选   
      checkboxIds: [],             // 复选框ID集
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        courseType: "",
        themeId: "",
        minAge: "",
        maxAge: "",
        status: "",
        courseName: "",
      };
    },

    // 处理分页组件的两个函数
    getParams: function () {
      return this.searchParam;
    },
    onPageLoad: function (dataList) {
      this.dataList = dataList;
    },

    // 执行搜索
    onSearch: function (event) {
      event.preventDefault();
      this.$refs.pager.gotoPage(1, true); //调用子组件的方法
    },

    // 清空搜索条件
    clearSearch: function (event) {
      event.preventDefault();
      this.initSearchParam();
      this.onSearch(event);
    },

    //全选/取消全选
    doCheckAll: function () {
      let self = this;
      self.checkboxIds = [];
      if (self.checkAll) {
        self.checkAll = false;  //取消全选标记
      } else {
        $.each(self.dataList, (idx, obj) => {
          self.checkboxIds.push(obj.courseId);
        });
        self.checkAll = true;   //全选标记
      }
    },
    // 添加热门推荐
    createCoursePick: function (scheduleIds, status) {
      let that = this;
      if (that.checkboxIds.length <= 0) {
        bootbox.alert('请在列表至少勾选一条数据!');
        return
      }
      bootbox.confirm({
        message: '是否添加热门推荐？',
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-success"
          },
          cancel: {
            label: "取消",
            className: "btn-danger"
          }
        },
        callback: function (result) {
          if (result) {
            $.ajax({
              url: "/api/course/createCoursePick",
              type: "POST",
              data: {
                courseIds: JSON.stringify(that.checkboxIds)
              }
            }).done(resp => {
              if (resp.code == "0000") {
                toastr.success(resp.msg);
                that.dataList = [];
                that.checkboxIds = [];
                that.checkAll = false;
                setTimeout(() => {
                  //   window.location.reload(true);
                  that.$refs.pager.gotoPage(1, true); //调用子组件的方法
                }, 500);
              } else {
                toastr.error(resp.msg);
              }
            });
          }
        }
      });
    },

    // 取消热门推荐
    deleteCoursePick: function (scheduleIds, status) {
      let that = this;
      if (that.checkboxIds.length <= 0) {
        bootbox.alert('请在列表至少勾选一条数据!');
        return
      }
      bootbox.confirm({
        message: '是否取消热门推荐？',
        buttons: {
          confirm: {
            label: "确定",
            className: "btn-success"
          },
          cancel: {
            label: "取消",
            className: "btn-danger"
          }
        },
        callback: function (result) {
          if (result) {
            $.ajax({
              url: "/api/course/deleteCoursePick",
              type: "POST",
              data: {
                courseIds: JSON.stringify(that.checkboxIds)
              }
            }).done(resp => {
              if (resp.code == "0000") {
                toastr.success(resp.msg);
                that.dataList = [];
                that.checkboxIds = [];
                that.checkAll = false;
                setTimeout(() => {
                  //   window.location.reload(true);
                  that.$refs.pager.gotoPage(1, true); //调用子组件的方法
                }, 500);
              } else {
                toastr.error(resp.msg);
              }
            });
          }
        }
      });
    },

    // 打开添加与编辑表单的Modal弹窗
    onAddEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openAddEditModal", obj == null ? {} : obj);
    },

    //课程上下架操作
    updateCourseStatus: function (event, courseId, status) {
      event.preventDefault();
      let that = this;
      let data = { courseId, status };
      var message;
      if (status == 0) {
        message = '确认下架？'
      } else {
        message = '确认上架？'
      }
      bootbox.confirm({
        message: message,
        buttons: {
          confirm: {
            label: "确认",
            className: "btn-success"
          },
          cancel: {
            label: "取消",
            className: "btn-danger"
          }
        },
        callback: function (result) {
          if (result) {
            $.ajax({
              url: "/api/course/updateCourseStatus",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(data),
            }).done(resp => {
              if (resp.code == "0000") {
                toastr.success(resp.msg);
                that.dataList = [];
                setTimeout(() => {
                  //   window.location.reload(true);
                  that.$refs.pager.gotoPage(1, true); //调用子组件的方法
                }, 500);
              } else {
                toastr.error(resp.msg);
              }
            });
          }
        }
      });
    },
  },

  computed: {
    pagerConfig: function () {
      return {
        url: "/api/course/getCourseByPage",
        getParams: this.getParams,
        onPageLoad: this.onPageLoad,
        pageSize: 15
      };
    }
  },

  created: function () {
    this.initSearchParam();
  }
};
</script>
<style>
.aaaa {
  color: red;
}
</style>
