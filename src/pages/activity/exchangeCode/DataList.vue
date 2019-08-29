<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 活动状态 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.statusList" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 来源渠道 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">来源渠道:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.channelNo" @change="onSearch($event)">
                      <option selected="selected" value>请选择来源渠道</option>
                      <option v-for="item in $root.channelSelect" :value="item.channelNo">{{item.channelName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 有效时间 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">有效时间：</label>
                  <div class="">
                    <input type="text" placeholder="请选择开始日期" autocomplete="off" class="form-control input input-inline" id="j_startTime" name="startTime" v-model="searchParam.startTime"> -
                    <input type="text" placeholder="请选择结束日期" autocomplete="off" class="form-control input input-inline " id="j_endTime" name="endTime" v-model="searchParam.endTime">
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

          <a v-show="checkPermissions(['createRedeemCodeBatch'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 新建兑换码批次
          </a>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">批次编号</th>
                  <th class="text-center">批次名称</th>
                  <!-- <th class="text-center">所属商户</th> -->
                  <th class="text-center">来源渠道</th>
                  <th class="text-center">兑换类型</th>
                  <th class="text-center">可兑换课时</th>
                  <th class="text-center">可兑换体验卡</th>
                  <th class="text-center">兑换码数量</th>
                  <th class="text-center">有效期</th>
                  <th class="text-center">创建时间</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.batchId || '--'}}</td>
                  <td class="text-center">{{obj.batchName || '--'}}</td>
                  <!-- <td class="text-center">{{obj.merchantName || '--'}}</td> -->
                  <td class="text-center">{{$root.channelSelectMap[obj.channelNo] || '--'}}</td>
                  <td class="text-center">{{obj.redeemCodeType ==1? '课币':'体验卡'}}</td>
                  <td class="text-center">{{obj.lcoin || '0'}}</td>
                  <td class="text-center">{{obj.experienceCard || '0'}}</td>
                  <td class="text-center" >
                    <span style="color:blue; border-bottom:1px solid blue;">{{obj.redeemCodeNum || '0'}}</span>
                  </td>
                  <td class="text-center">{{obj.startTime}} - {{obj.endTime}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{status[obj.status] || '--'}}</span>
                  </td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateRedeemCodeBatch'])" @click="onUpdateStatusForm($event,obj)" class="btn btn-xs blue" href="javascript:;">
                      <i class="fa fa-edit"></i> 编辑
                    </a>
                    <a v-show="checkPermissions(['getRedeemCodeByPage'])" @click="onCheckDetailForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-search"></i> 查看兑换码
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
      status: { "0": "下架", "1": "上架" },
      searchParam: {}, // 搜索参数
      dataList: [] // 列表数据
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        status: "",  //状态下拉筛选：0=下架 1=上架
        channelNo: "", //模糊搜索渠道号
        startTime: "",  //startTime=筛选开始时间,格式 yyyy-MM-dd 00:00:00
        endTime: "",    //endTime=筛选过期时间,格式 yyyy-MM-dd 23:59:59
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

    // 打开新增兑换码表单的Modal弹窗
    onAddEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openAddEditModal", obj == null ? {} : obj);
    },

    // 打开查看兑换码详情表单的Modal弹窗
    onCheckDetailForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openCheckDetailModal", obj == null ? {} : obj);
    },

    // 打开修改兑换码状态表单的Modal弹窗
    onUpdateStatusForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openUpdateStatusModal", obj == null ? {} : obj);
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
      _start.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.searchParam.startTime = _start.val() + ' ' + '00' + ':' + '00' + ':' + '00';
      });
      _end.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.searchParam.endTime = _end.val() + ' ' + '23' + ':' + '59' + ':' + '59';
      });
    },
  },

  computed: {
    pagerConfig: function () {
      return {
        url: "/api/redeemcode/getRedeemCodeBatchByPage",
        getParams: this.getParams,
        onPageLoad: this.onPageLoad,
        pageSize: 15
      };
    }
  },

  created: function () {
    this.initSearchParam();
  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
  }
};
</script>
<style>
</style>
