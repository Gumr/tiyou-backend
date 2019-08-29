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
                  <label class="control-label lable_title_name">用户状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.userStatus" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 活动ID -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">活动ID:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入活动ID搜索" v-model="searchParam.activityId" @keyup.enter="onSearch($event)" />
                  </div>
                </div>
                <!-- 活动名称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">用户名称:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入用户名称搜索" v-model="searchParam.nickName" @keyup.enter="onSearch($event)"/>
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

          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">活动ID</th>
                  <th class="text-center">用户ID</th>
                  <th class="text-center">用户名称</th>
                  <th class="text-center">手机号码</th>
                  <th class="text-center">裂变等级</th>
                  <th class="text-center">分享次数</th>
                  <th class="text-center">累计获取金额</th>
                  <th class="text-center">累计提现金额</th>
                  <th class="text-center">注册时间</th>
                  <th class="text-center">来源渠道</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.activityId || '--'}}</td>
                  <td class="text-center">{{obj.userId || '--'}}</td>
                  <td class="text-center">
                    <span>{{obj.nickName || '--'}}</span>
                    <img v-show="obj.avatar" :src="obj.avatar" style="width:30px;height:30px;border-radius:50%;margin-left:6px;">
                  <td class="text-center">{{obj.phone || '--'}}</td>
                  <td class="text-center">{{obj.level || '--'}}</td>
                  <td class="text-center">{{obj.totalInvitedUser || '--'}}</td>
                  <td class="text-center">{{obj.totalBalance/100 || '--'}}</td>
                  <td class="text-center">{{obj.withdrawalAmount/100 || '--'}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">{{$root.channelSelectMap[obj.channelNo] || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{status[obj.status]  || '--'}}</span>
                  </td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateRedPacketActivityUserStatus'])" v-if="obj.status == '1'" @click="updateRedPacketActivityUserStatus($event,obj.activityId,0,obj.userId)"
                      class="btn btn-xs red" href="javascript:;">
                      <i class="fa fa-level-down"></i> 解冻
                    </a>
                    <a v-show="checkPermissions(['updateRedPacketActivityUserStatus'])" v-if="obj.status == 0" @click="updateRedPacketActivityUserStatus($event,obj.activityId,1,obj.userId)"
                      class="btn btn-xs green" href="javascript:;">
                      <i class="fa fa-level-up"></i> 冻结
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
      status: { "0": "解冻", "1": "冻结" },
      searchParam: {}, // 搜索参数
      dataList: [], // 列表数据
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        status: "",         //用户状态 0 = 解冻,1 = 冻结
        activityId: "",     //活动id
        nickName: "",       //用户昵称
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


    //活动用户上下架操作
    updateRedPacketActivityUserStatus: function (event, activityId, status, userId) {
      event.preventDefault();
      let that = this;
      let data = {
        activityId: activityId,
        status: status,
        userId: userId
      }
      var message;
      if (status == 0) {
        message = '确认解冻？'
      } else {
        message = '确认冻结？'
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
              url: "/api/redpacketUserBalance/updateRedPacketActivityUserStatus",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(data),
            }).done(resp => {
              if (resp.code == "0000") {
                toastr.success(resp.msg);
                setTimeout(() => {
                  window.location.reload(true);
                }, 500)
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
        url: "/api/redpacketUserBalance/getRedPacketActivityUserByPage",
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
