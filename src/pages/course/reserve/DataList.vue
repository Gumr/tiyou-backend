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
                  <div class="range_container">
                    <div class="">
                      <select class="form-control" v-model="searchParam.provinceCode" @change="getProvinceSelect($event)">
                        <option selected="selected" value>请选择省</option>
                        <option v-for="item in $root.provinceSelect" :value="item.provinceCode">{{item.provinceName}}</option>
                      </select>
                    </div>
                    <div class="">
                      <select class="form-control" v-model="searchParam.cityCode" @change="getCitySelect($event)">
                        <option value>请选择市</option>
                        <option v-for="item in cityList" :value="item.cityCode">{{item.cityName}}</option>
                      </select>
                    </div>
                    <div class="">
                      <select class="form-control" v-model="searchParam.districtCode" @change="onSearch($event)">
                        <option value>请选择区</option>
                        <option v-for="item in districtList" :value="item.districtCode">{{item.districtName}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- 所属教学点 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">所属教学点:</label>
                  <div class="">
                    <select class="form-control select_max_width" v-model="searchParam.teachPlaceId" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 所属老师 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">所属老师:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.teacherId" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.teachSelect" :value="item.teacherId">{{item.teacherName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 上课日期 -->
                <!-- <div class="form-group flex_content">
                  <label class="control-label lable_title_name">上课日期:</label>
                  <div class="">
                    <input type="text" class="form-control input input-inline" autocomplete="off" placeholder="请输入上课日期" id="scheduleDate" name="scheduleDate" v-model="searchParam.scheduleDate">
                  </div>
                </div> -->
              </div>
              <div class="row flex_group">
                <!-- 课程主题 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程主题:</label>
                  <div class="">
                    <select class="form-control select_max_width" v-model="searchParam.themeId" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.themeList" :value="item.themeId">{{item.themeName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 课程名称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">课程名称:</label>
                  <div class="">
                    <select class="form-control select_max_width" v-model="searchParam.courseId" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.courseSelect" :value="item.courseId">{{item.courseName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 支付方式 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">支付方式:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.payType" @change="onSearch($event)">
                      <option selected="selected" value="">请选择</option>
                      <option value="1">课币</option>
                      <option value="2">体验卡</option>
                    </select>
                  </div>
                </div>
                <!-- 预约状态 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">预约状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.reserveStatus" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.scheduleStatus" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 排课ID -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">排课编号:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入排课编号" v-model="searchParam.scheduleId" @keyup.enter="onSearch($event)" />
                  </div>
                </div>
              </div>
              <div class="row flex_group">

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

          <a v-show="checkPermissions(['createReserve'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 手动添加预约
          </a>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">预约ID</th>
                  <th class="text-center">预约课程</th>
                  <th class="text-center">排课编号</th>
                  <th class="text-center">支付方式</th>
                  <th class="text-center">预约用户</th>
                  <th class="text-center">上课宝宝</th>
                  <th class="text-center">开课时间</th>
                  <th class="text-center">教师</th>
                  <th class="text-center">教学点</th>
                  <th class="text-center">预约类型</th>
                  <th class="text-center">取消类型</th>
                  <th class="text-center">预约状态</th>
                  <th class="text-center">预约时间</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center" style="width:220px;overflow-x:auto;">{{obj.reserveId || '--'}}</td>
                  <td class="text-center">{{obj.courseName || '--'}}</td>
                  <td class="text-center">{{obj.scheduleId || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.payType == 1 ? 'green' : 'blue'">{{obj.payType==1 ? '课币':'体验卡'}}</span>
                  </td>
                  <td class="text-center">{{obj.nickName || '--'}}</td>
                  <td class="text-center">{{obj.studentName || '--'}}</td>
                  <td class="text-center">{{obj.scheduleDate || '--'}} {{obj.classBeginTime || '--'}}</td>
                  <td class="text-center">{{obj.teacherName || '--'}}</td>
                  <td class="text-center">{{obj.teachPlaceName || '--'}}</td>
                  <td class="text-center">{{obj.reserveTypeName || '--'}}</td>
                  <td class="text-center">{{obj.cancelTypeName || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.reserveStatus == 10 ? 'green' : ''" v-if="obj.reserveStatus == 10">{{$root.reserveStatusMap[obj.reserveStatus]}}</span>
                    <span class="btn btn-xs" :class="obj.reserveStatus == 20 ? 'blue' : ''" v-if="obj.reserveStatus == 20">{{$root.reserveStatusMap[obj.reserveStatus]}}</span>
                    <span class="btn btn-xs" :class="obj.reserveStatus == 30 ? 'purple' : ''" v-if="obj.reserveStatus == 30">{{$root.reserveStatusMap[obj.reserveStatus]}}</span>
                    <span class="btn btn-xs" :class="obj.reserveStatus == 31 ? 'yellow' : ''" v-if="obj.reserveStatus == 31">{{$root.reserveStatusMap[obj.reserveStatus]}}</span>
                    <span class="btn btn-xs" :class="obj.reserveStatus == 40 ? 'red' : ''" v-if="obj.reserveStatus == 40">{{$root.reserveStatusMap[obj.reserveStatus]}}</span>
                  </td>
                  <td class="text-center">{{obj.createTime}}</td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateReserveStatus'])" v-if="(obj.reserveStatus == 40)  ||  (obj.reserveStatus == 10)" @click="onEditStatusForm($event,obj)"
                      class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 销课
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
import basicData from 'common/js/basicData.js'

export default {
  components: {
    Pager
  },

  data: function () {
    return {
      searchParam: {}, // 搜索参数
      dataList: [], // 列表数据
      cityList: [],//市
      districtList: [],//区
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        provinceCode: "",   //省code
        cityCode: "",       //市code
        districtCode: "",   //省code
        courseName: "",     //课程名称
        teachPlaceId: "",   //教学点id
        themeId: "",        //主题id
        courseId: "",       //课程id
        reserveStatus: "",  //预约状态
        teacherId: "",      //老师id
        scheduleId: "",     //排课id
        payType: "",        //支付方式
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

    // 打开添加手工预约课程表单的Modal弹窗
    onAddEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openAddEditModal", obj == null ? {} : obj);
    },

    // 打开修改预约状态表单的Modal弹窗
    onEditStatusForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openEditStatusModal", obj == null ? {} : obj);
    },

    //获取市
    getProvinceSelect(event) {
      let cityData = basicData.getCitySelect(event.target.value)
      this.cityList = cityData;

    },
    //获取区
    getCitySelect(event) {
      let districtData = basicData.getDistrictSelect(event.target.value)
      this.districtList = districtData;
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
        url: "/api/course/getReserveByPage",
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