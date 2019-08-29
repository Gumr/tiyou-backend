<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                  <!-- 账户类别 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">账户类别:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.atype" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option value="1">课币</option>
                      <option value="2">体验卡</option>
                    </select>
                  </div>
                </div>
                <!-- 记录类型 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">记录类型:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.recordType" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.lcoinRecordTypeSelect" :value="item.accountRecordType">{{item.accountRecordName}}</option>
                    </select>
                  </div>
                </div>
                <!-- 交易类型 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">交易类型:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.transType" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option value="1">增加</option>
                      <option value="2">扣减</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row flex_group">
                <!-- 用户昵称 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">用户昵称:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入会员名称搜索" v-model="searchParam.nickName" @keyup.enter="onSearch($event)">
                  </div>
                </div>
                <!-- 关联业务编号 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">关联业务编号:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入业务编号搜索" v-model="searchParam.businessNo" @keyup.enter="onSearch($event)" style="width:260px;">
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
                  <th class="text-center">账户类别</th>
                  <th class="text-center">记录类型</th>
                  <th class="text-center">交易类型</th>
                  <th class="text-center">交易前数额</th>
                  <th class="text-center">本次交易额</th>
                  <th class="text-center">关联业务编号</th>
                  <th class="text-center">备注</th>
                  <th class="text-center">操作人</th>
                  <th class="text-center">创建日期</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.userId || '--'}}</td>
                  <td class="text-center">
                    <span>{{obj.nickName || '--'}}</span>
                    <img v-show="obj.avatar" :src="obj.avatar" style="width:30px;height:30px;border-radius:50%;margin-left:6px;">
                  </td>
                  <td class="text-center">{{obj.atype ==1?'课币':'体验卡'}}</td>
                  <td class="text-center">{{obj.recordName || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" :class="obj.transType == 1 ? 'green' : 'red'">{{obj.transType == 1?'增加':'扣减'}}</span>
                  </td>
                  <td class="text-center">{{obj.beforeTransNum || '--'}}</td>
                  <td class="text-center">{{obj.transNum || '--'}}</td>
                  <td class="text-center" style="width:240px;">{{obj.businessNo || '--'}}</td>
                  <td class="text-center">{{obj.remark || '--'}}</td>
                  <td class="text-center">{{obj.createBy || '--'}}</td>
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
      searchParam: {},             // 搜索参数
      dataList: [],                // 列表数据
    }
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        transType: "",//交易类型
        recordType: "",//记录类型
        businessNo: '',//关联业务编号
        nickName: '',  //用户昵称
        atype: '',     //账户类别
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


  },

  computed: {
    pagerConfig: function () {
      return {
        url: '/api/user/getUserAccountRecordByPage',
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