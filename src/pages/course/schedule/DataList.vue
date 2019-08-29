<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 省市区 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">省市区:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.provinceCode" @change="$root.getCitySelect(searchParam.provinceCode)">
                      <option value=''>请选择省</option>
                      <option v-for="item in $root.provinceSelect" :value="item.provinceCode">{{item.provinceName}}</option>
                    </select>
                  </div>
                  <div class="">
                    <select class="form-control" v-model="searchParam.cityCode" @change="$root.getDistrictSelect(searchParam.cityCode)">
                      <option value=''>请选择市</option>
                      <option v-for="item in $root.citySelect" :value="item.cityCode">{{item.cityName}}</option>
                    </select>
                  </div>
                  <div class="">
                    <select class="form-control" v-model="searchParam.districtCode" @change="$root.getTeachPlaceSelect(searchParam.provinceCode, searchParam.cityCode, searchParam.districtCode)">
                      <option value=''>请选择区</option>
                      <option v-for="item in $root.districtSelect" :value="item.districtCode">{{item.districtName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 教学点 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">教学点:</label>
                  <div class="">
                    <select class="form-control select_max_width" v-model="searchParam.teachPlaceId" @change="onSearch($event)" >
                      <option value=''>请选择教学点</option>
                      <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 教师 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">教师:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.teacherId" @change="onSearch($event)">
                      <option value=''>请选择教师</option>
                      <option v-for="item in $root.teacherSelect" :value="item.teacherId">{{item.teacherName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 上课日期 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">上课日期:</label>
                  <div class="">
                    <input type="text" class="form-control input input-inline" autocomplete="off" placeholder="请输入上课日期" id="scheduleDate" name="scheduleDate" v-model="searchParam.scheduleDate">
                  </div>
                </div>
              </div>
              <div class="row flex_group ">
                <!-- 主题 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">主题:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.themeId" @change="onSearch($event)">
                      <option value=''>请选择课程主题</option>
                      <option v-for="item in $root.themeSelect" :value="item.themeId">{{item.themeName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 上下架 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">上下架:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                      <option value=''>请选择</option>
                      <option v-for="item in $root.upDownStatusSelect" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 状态 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.scheduleStatus" @change="onSearch($event)">
                      <option value=''>请选择开班状态</option>
                      <option v-for="item in $root.scheduleStatusSelect" :value="item.scheduleStatusId">{{item.scheduleStatusName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 课程名称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程名称:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入课程名称搜索" v-model="searchParam.courseName" @keyup.enter="onSearch($event)" />
                  </div>
                </div>
                <!-- </div> -->
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

          <a v-show="checkPermissions(['addSchedule'])" @click="onBatchScheduleForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 批量排课
          </a>
          <a v-show="checkPermissions(['addSchedule'])" @click="batchUpdateSatatus(1)" class="btn green-meadow" href="javascript:;" style="background:#c51b26;border-color: #e7505a;">
            <i class="fa fa-edit"></i> 批量上架
          </a>
          <a v-show="checkPermissions(['addSchedule'])" @click="batchUpdateSatatus(0)" class="btn green-meadow" href="javascript:;" style="background-color: #1c699f;
    border-color: #15527c;">
            <i class="fa fa-edit"></i> 批量下架
          </a>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">
                    <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                      <input type="checkbox" class="group-checkable" placeholder="全选" value="true" v-model="isCheckAll" @change="checkAll" />
                      <span></span>
                    </label>
                  </th>
                  <th class="text-center">排课ID</th>
                  <th class="text-center">课程编号</th>
                  <th class="text-center">课程名称</th>
                  <th class="text-center">地区</th>
                  <th class="text-center">教学点</th>
                  <th class="text-center">上课教师</th>
                  <th class="text-center">上课日期</th>
                  <th class="text-center">上课时间</th>
                  <th class="text-center">截止预约</th>
                  <th class="text-center">开班人数</th>
                  <th class="text-center">预约人数</th>
                  <th class="text-center">开班状态</th>
                  <th class="text-center">上下架状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td>
                    <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                      <input type="checkbox" class="checkboxes" :value="obj.scheduleId" v-model="scheduleIds" />
                      <span></span>
                    </label>
                  </td>
                  <td class="text-center">{{obj.scheduleId || '--'}}</td>
                  <td class="text-center">{{obj.courseId || '--'}}</td>
                  <td class="text-center">{{obj.courseName || '--'}}</td>
                  <td class="text-center">{{obj.provinceName || '--'}} {{obj.cityName || '--'}} {{obj.districtName || '--'}}</td>
                  <td class="text-center">{{obj.teachPlaceName || '--'}}</td>
                  <td class="text-center">{{obj.teacherName || '--'}}</td>
                  <td class="text-center">{{obj.scheduleDate || '--'}}</td>
                  <td class="text-center">{{obj.classBeginTime || '--'}} - {{obj.classEndTime || '--'}}</td>
                  <td class="text-center">{{obj.reserveEndTime || '--'}}</td>
                  <td class="text-center">{{obj.minPeople || '--'}} - {{obj.maxPeople || '--'}}</td>
                  <td class="text-center">{{obj.reservePeople || 0}}</td>
                  <td class="text-center">
                    {{$root.scheduleStatusMap[obj.scheduleStatus] || '--'}}
                  </td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{$root.upDownStatusMap[obj.status] || '--'}}</span>
                  </td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateSchedule'])" @click="onSingleScheduleForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 编辑
                    </a>
                    <a v-show="checkPermissions(['updateScheduleStatus'])" v-if="obj.status == 0" @click="singleUpdateSatatus(obj.scheduleId, 1)" class="btn btn-xs green" href="javascript:;">
                      <i class="fa fa-level-up"></i> 上架
                    </a>
                    <a v-show="checkPermissions(['updateScheduleStatus'])" v-if="obj.status == 1" @click="singleUpdateSatatus(obj.scheduleId, 0)" class="btn btn-xs red" href="javascript:;">
                      <i class="fa fa-level-down"></i> 下架
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
      searchParam: {},     // 搜索参数
      dataList: [],        // 列表数据
      scheduleIds: [],     // 批量上下架的ID
      isCheckAll: '',
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        provinceCode: "",   //省
        cityCode: "",       //市
        districtCode: "",   //区
        teachPlaceId: "",   //教学点
        teacherId: "",      //教师
        themeId: "",        //主题
        courseName: "",     //课程名称
        status: "",         //上下架状态
        scheduleStatus: "", //排课状态
        scheduleDate: '',   //开课日期,年月日
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

    // 打开批量排课的Modal弹窗
    onBatchScheduleForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openBatchScheduleModal", obj == null ? {} : obj);
    },

    // 打开单个排课的Modal弹窗
    onSingleScheduleForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openSingleScheduleModal", obj == null ? {} : obj);
    },


    // 全选/全取消
    checkAll: function () {
      let self = this;
      let listSize = self.dataList.length;
      let scheduleIdSize = self.scheduleIds.length;
      if (scheduleIdSize < listSize) {
        $.each(self.dataList, (idx, obj) => {
          if (self.scheduleIds.indexOf(obj.scheduleId) == -1) {
            self.scheduleIds.push(obj.scheduleId);
          }
        });
        self.isCheckAll = true;
      } else {
        self.scheduleIds = [];
        self.isCheckAll = false;
      }
    },

    // 批量上下架
    batchUpdateSatatus: function (status) {
      let self = this;
      let statusData = status;
      if (self.scheduleIds.length <= 0) {
        bootbox.alert('请在列表至少勾选一条数据!');
        return
      }
      var message;
      if (statusData == 0) {
        message = '确认进行批量下架操作吗？'
      } else {
        message = '确认进行批量上架操作吗？'
      }
      bootbox.confirm({
        message: message,
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
            self.updateStatus(self.scheduleIds, status)
          }
          // 清空
          self.scheduleIds = [];
        }
      });
    },

    // 单个上下架
    singleUpdateSatatus: function (scheduleId, status) {
      let self = this;
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
            self.updateStatus([scheduleId], status)
          }
        }
      });
    },

    // 上下架操作
    updateStatus: function (scheduleIds, status) {
      let that = this;
      $.ajax({
        url: "/api/schedule/updateScheduleStatus",
        type: "POST",
        data: {
          scheduleIds: JSON.stringify(scheduleIds),
          status: status
        }
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
    },
    // 初始化时间插件
    initDatePicker: function () {
      let self = this;
      let _scheduleDate = $("#scheduleDate");         //上课日期
      _scheduleDate.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd",
        minView: 2
      });
      _scheduleDate.datetimepicker().on("hide", function (ev) {
        self.searchParam.scheduleDate = _scheduleDate.val();
      });
    },
  },

  computed: {
    pagerConfig: function () {
      return {
        url: "/api/schedule/getScheduleByPage",
        getParams: this.getParams,
        onPageLoad: this.onPageLoad,
        pageSize: 15
      };
    }
  },

  //监听日期选择实时获取排课数据
  watch: {
    searchParam: {
      handler: function (val, oldval) {
        let that = this;
        if (val.scheduleDate) {
          that.$refs.pager.gotoPage(1, true); //调用子组件的方法
        }
      },
      deep: true//对象内部的属性监听，也叫深度监听
    },
  },

  created: function () {
    this.initSearchParam();
  },

  mounted: function () {
    //挂载时初始化时间插件
    this.initDatePicker();
  }
};
</script>
