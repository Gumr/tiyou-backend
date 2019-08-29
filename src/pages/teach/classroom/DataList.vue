<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 所属商户 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">所属商户:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.merchantId" @change="onSearch($event)">
                      <option selected="selected" value>请选择商户</option>
                      <option v-for="item in $root.merchantSelect" :value="item.merchantId">{{item.merchantName}}</option>
                    </select>
                  </div>
                </div>
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
              </div>
              <div class="row flex_group ">
                <!-- 教学点 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">教学点:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.teachPlaceId" @change="onSearch($event)">
                      <option selected="selected" value>请选择教学点</option>
                      <option v-for="item in $root.teachPlaceSelect" :value="item.teachId">{{item.teachName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 教学点类型 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">教学点类型:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.teachPlaceType" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.teachPlaceTypeSelect" :value="item.teachPlaceTypeId">{{item.teachPlaceName}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <button type="button" class="btn default" @click="clearSearch($event)">
                    <i class="fa fa-remove"></i> 清空
                  </button>
                  <button type="button" class="btn blue" @click="onSearch($event)">
                    <i class="fa fa-search"></i> 搜索
                  </button>
                </div>
              </div>
            </form>
          </div>

          <a v-show="checkPermissions(['addClassRoom'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 新增教室
          </a>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">教室名称</th>
                  <th class="text-center">教室编号</th>
                  <th class="text-center">所属商户</th>
                  <th class="text-center">所属地区</th>
                  <th class="text-center">所属教学点</th>
                  <th class="text-center">教学点类型</th>
                  <th class="text-center">默认教师</th>
                  <th class="text-center">联系电话</th>
                  <th class="text-center">修改时间</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.classroomName || '--'}}</td>
                  <td class="text-center">{{obj.classRoomId || '--'}}</td>
                  <td class="text-center">{{obj.merchantName || '--'}}</td>
                  <td class="text-center">{{obj.provinceName || '--'}}-{{obj.cityName || '--'}}-{{obj.districtName || '--'}}</td>
                  <td class="text-center">{{obj.teachPlaceName || '--'}}</td>
                  <td class="text-center">{{map[obj.teachPlaceType] || '--'}}</td>
                  <td class="text-center">{{obj.teacherName || '--'}}</td>
                  <td class="text-center">{{obj.contactPhone || '--'}}</td>
                  <td class="text-center">{{obj.updateTime || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{status[obj.status] || '--'}}</span>
                  </td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateClassRoom'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 编辑
                    </a>
                    <a v-show="checkPermissions(['updateClassRoomStatus'])" v-if="obj.status == '1'" @click="updateClassRoomStatus($event,obj.classRoomId,0)" class="btn btn-xs red"
                      href="javascript:;">
                      <i class="fa fa-level-down"></i> 下架
                    </a>
                    <a v-show="checkPermissions(['updateClassRoomStatus'])" v-if="obj.status == 0" @click="updateClassRoomStatus($event,obj.classRoomId,1)" class="btn btn-xs green"
                      href="javascript:;">
                      <i class="fa fa-level-up"></i> 上架
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
      map: { "1": "商场", "2": "机构", "3": "异业合作", },
      status: { "0": "下架", "1": "上架" },
      merchantType: { "1": "体游自营" },
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
        merchantId: "",
        provinceCode: "",
        cityCode: "",
        districtCode: "",
        teachPlaceId: "",
        teachPlaceType: "",
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

    // 打开添加与编辑表单的Modal弹窗
    onAddEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openAddEditModal", obj == null ? {} : obj);
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

    //教室上下架操作
    updateClassRoomStatus: function (event, classRoomId, status) {
      event.preventDefault();
      let that = this;
      let data = {
        classRoomId: classRoomId,
        status: status
      }
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
              url: "/api/classRoom/updateClassRoomStatus",
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
        url: "/api/classRoom/getClassRoomByPage",
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
</style>
