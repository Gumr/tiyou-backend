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
                  <label class="control-label lable_title_name">活动状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.statusList" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 活动ID -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">活动ID:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入活动ID搜索" v-model="searchParam.activityId"  @keyup.enter="onSearch($event)" />
                  </div>
                </div>
                <!-- 活动名称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">活动名称:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入活动名称搜索" v-model="searchParam.activityName" @keyup.enter="onSearch($event)"/>
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

          <a v-show="checkPermissions(['addRedPacketActivity'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 新增红包活动
          </a>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">活动ID</th>
                  <th class="text-center">活动名称</th>
                  <th class="text-center">开始时间</th>
                  <th class="text-center">结束时间</th>
                  <th class="text-center">参与人数</th>
                  <th class="text-center">已发金额</th>
                  <th class="text-center">已提现金额</th>
                  <th class="text-center">创建时间</th>
                  <th class="text-center">更新时间</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.activityId || '--'}}</td>
                  <td class="text-center">{{obj.activityName || '--'}}</td>
                  <td class="text-center">{{obj.activityBeginTime || '--'}}</td>
                  <td class="text-center">{{obj.activityEndTime || '--'}}</td>
                  <td class="text-center">{{obj.numPeople || '--'}}</td>
                  <td class="text-center">{{obj.totalAmount/100 || '--'}}</td>
                  <td class="text-center">{{obj.totalWithdrawalAmout/100 || '--'}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">{{obj.updateTime || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{status[obj.status] || '--'}}</span>
                  </td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateRedPacketActivity'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 编辑
                    </a>
                    <a v-show="checkPermissions(['updateRedPacketActivityStatus'])" v-if="obj.status == '1'" @click="updateRedPacketActivityStatus($event,obj.activityId,0)" class="btn btn-xs red"
                      href="javascript:;">
                      <i class="fa fa-level-down"></i> 下架
                    </a>
                    <a v-show="checkPermissions(['updateRedPacketActivityStatus'])" v-if="obj.status == 0" @click="updateRedPacketActivityStatus($event,obj.activityId,1)" class="btn btn-xs green"
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
      status: { "0": "下架", "1": "上架" },
      searchParam: {}, // 搜索参数
      dataList: [] // 列表数据
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        status: "",
        activityId: "",
        activityName: "",
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

    //活动上下架操作
    updateRedPacketActivityStatus: function (event, activityId, status) {
      event.preventDefault();
      let that = this;
      let data = {
        activityId: activityId,
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
              url: "/api/redpacketActivity/updateRedPacketActivityStatus",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(data),
            }).done(resp => {
              if (resp.code == "0000") {
                toastr.success(resp.msg)
                window.location.reload(true);
              } else {
                toastr.error(resp.msg)
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
        url: "/api/redpacketActivity/getRedPacketActivityByPage",
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
