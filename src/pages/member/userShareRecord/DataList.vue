<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 邀请人 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">邀请人:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入邀请人名称" v-model="searchParam.giveUserName" @keyup.enter="onSearch($event)">
                  </div>
                </div>
                <!-- 领取人 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">领取人:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入领取人名称" v-model="searchParam.receiveUserName" @keyup.enter="onSearch($event)">
                  </div>
                </div>
                <!-- 渠道 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">来源渠道:</label>
                  <div class="">
                    <!-- <input type="text" class="form-control" autocomplete="off" placeholder="请输入渠道号" v-model="searchParam.giveChannelNo" @keyup.enter="onSearch($event)"> -->
                     <select class="form-control" v-model="searchParam.giveChannelNo" @change="onSearch($event)">
                      <option selected="selected" value>请选择来源渠道</option>
                      <option v-for="item in $root.channelSelect" :value="item.channelNo">{{item.channelName}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row flex_group">
                <!-- 时间范围 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">时间范围:</label>
                  <div class="">
                    <input type="text" class="form-control input input-inline" autocomplete="off" id="j_startTime" v-model="startView" placeholder="请选择开始时间"> -
                    <input type="text" class="form-control input input-inline "  autocomplete="off" id="j_endTime" v-model="endView" placeholder="请选择结束时间">
                  </div>
                </div>
              </div>
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

          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">来源渠道</th>
                  <th class="text-center">邀请人ID</th>
                  <th class="text-center">邀请人</th>
                  <th class="text-center">邀请人电话</th>
                  <th class="text-center">领取人ID</th>
                  <th class="text-center">领取人</th>
                  <th class="text-center">领取人电话</th>
                  <th class="text-center">时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.id || '--'}}</td>
                  <td class="text-center">{{$root.channelSelectMap[obj.giveChannelNo]|| '--'}}</td>
                  <td class="text-center">{{obj.giveUserId || '--'}}</td>
                  <td class="text-center">
                    <span>{{obj.giveUserName || '--'}}</span>
                    <img v-show="obj.giveUserAvatar" :src="obj.giveUserAvatar" style="width:30px;height:30px;border-radius:50%;">
                  </td>
                  <td class="text-center">{{obj.giveUserPhone || '--'}}</td>
                  <td class="text-center">{{obj.receiveUserId || '--'}}</td>
                  <td class="text-center">
                    <span>{{obj.receiveUserName || '--'}}</span>
                    <img v-show="obj.receiveUserAvatar" :src="obj.receiveUserAvatar" style="width:30px;height:30px;border-radius:50%;">
                  </td>
                  <td class="text-center">{{obj.receiveUserPhone || '--'}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
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
import Pager from 'components/Pager.vue';

export default {
  components: {
    Pager
  },

  data: function () {
    return {
      startView: '',
      endView: '',
      searchParam: {},             // 搜索参数
      dataList: [],                // 列表数据
    }
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        giveUserName: '',//邀请人
        receiveUserName: '',//领取人
        giveChannelNo: '',//渠道
        beginTime: '',//开始时间
        endTime: '',//结束时间
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
      this.$refs.pager.gotoPage(1, true);   //调用子组件的方法
    },

    // 清空搜索条件
    clearSearch: function (event) {
      event.preventDefault();
      this.initSearchParam();
      this.startView = '';
      this.endView = '';
      this.onSearch(event);
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
        self.startView = _start.val();
        self.searchParam.beginTime = new Date(_start.val() + ' ' + '00' + ':' + '00' + ':' + '00').getTime();
      });
      _end.datetimepicker().on("hide", function (ev) {
        self.endView = _end.val();
        self.searchParam.endTime = new Date(_end.val() + ' ' + '23' + ':' + '59' + ':' + '59').getTime();
      });
    },

  },

  computed: {
    pagerConfig: function () {
      return {
        url: '/api/user/getUserExperienceRecord',
        getParams: this.getParams,
        onPageLoad: this.onPageLoad,
        pageSize: 15
      }
    }
  },

  created: function () {
    this.initSearchParam();
  },
  mounted: function () {
    //挂载时初始化时间插件
    this.initDatePicker();
  }
}
</script>