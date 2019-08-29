<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 会员状态 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">会员状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.userStatus" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 来源渠道 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">来源渠道:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.channelNo" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.channelSelect" :value="item.channelNo">{{item.channelName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 会员名称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">会员名称:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入会员名称" v-model="searchParam.nickName" @keyup.enter="onSearch($event)">
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

          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">用户ID</th>
                  <th class="text-center">用户昵称</th>
                  <th class="text-center" style="color:red;">当前课时</th>
                  <th class="text-center">已用课时</th>
                  <th class="text-center">可体验</th>
                  <th class="text-center">已体验</th>
                  <th class="text-center">可赠卡</th>
                  <th class="text-center">已赠卡</th>
                  <th class="text-center">来源渠道</th>
                  <th class="text-center">注册时间</th>
                  <th class="text-center">最后登录</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.userId || '--'}}</td>
                  <td class="text-center">
                    <span>{{obj.nickName || '--'}}</span>
                    <img v-show="obj.avatar" :src="obj.avatar" style="width:30px;height:30px;border-radius:50%;margin-left:6px;">
                  </td>
                  <td class="text-center" style="color:red;">{{obj.lcoin || '0'}}</td>
                  <td class="text-center">{{obj.payLcoin|| '0'}}</td>
                  <td class="text-center">{{obj.useExperienceCard || '0'}}</td>
                  <td class="text-center">{{obj.useExperienceNum || '0'}}</td>
                  <td class="text-center">{{obj.giveExperienceCard || '0'}}</td>
                  <td class="text-center">{{obj.giveExperienceNum || '0'}}</td>
                  <td class="text-center">{{$root.channelSelectMap[obj.channelNo] || '--'}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">{{obj.lastLoginTime || '--'}}</td>
                  <td class="text-center"><span class="btn btn-xs" :class="obj.status == 0 ? 'green' : 'red'">{{obj.status ==0?'正常':'冻结'}}</span></td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['getUserRechargeRecord','getUserAccountRecordByPage','getUserReserveRecord'], 'or')" @click="onAddEditForm($event, obj)" class="btn btn-xs purple" href="javascript:;"><i
                        class="fa fa-search"></i> 查看详情</a>
                    <!-- <a v-show="checkPermissions(['updateUserStatus'])" v-if="obj.status == '1'" @click="updateUserStatus($event,obj.userId,0)" class="btn btn-xs green" href="javascript:;">
                      <i class="fa fa-level-up"></i> 解冻
                    </a>
                    <a v-show="checkPermissions(['updateUserStatus'])" v-if="obj.status == 0" @click="updateUserStatus($event,obj.userId,1)" class="btn btn-xs red" href="javascript:;">
                      <i class="fa fa-level-down"></i> 冻结
                    </a> -->
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
import Pager from 'components/Pager.vue';

export default {
  components: {
    Pager
  },

  data: function () {
    return {
      searchParam: {},             // 搜索参数
      dataList: [],                // 列表数据
    }
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        status: '',      //状态
        nickName: '',    //会员昵称
        userId: '',      //会员id
        channelNo: '',   //来源渠道
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
      this.onSearch(event);
    },

    // 打开添加与编辑表单的Modal弹窗
    onAddEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit('openAddEditModal', obj == null ? {} : obj);
    },
    //会员冻结、解冻操作
    updateUserStatus: function (event, userId, status) {
      event.preventDefault();
      let that = this;
      let data = {
        userId: userId,
        status: status
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
              url: "/api/user/updateUserStatus",
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
        url: '/api/user/getSimpleUserByPage',
        getParams: this.getParams,
        onPageLoad: this.onPageLoad,
        pageSize: 15
      }
    }
  },

  created: function () {
    this.initSearchParam();
  },
}
</script>