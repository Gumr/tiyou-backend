<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 订单状态 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">订单状态:</label>
                  <div class="">
                    <select class="form-control" v-model="searchParam.rechargeOrderStatus" @change="onSearch($event)">
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.rechargeOrderStatusSelect" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
                <!-- 订单编号 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">订单编号:</label>
                  <div class="">
                    <input type="text" class="form-control" placeholder="请输入订单编号搜索" v-model="searchParam.rechargeOrderId" @keyup.enter="onSearch($event)" />
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

          <!-- <a v-show="checkPermissions([''])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 手动增加订单
          </a> -->
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">订单编号</th>
                  <th class="text-center">下单用户</th>
                  <th class="text-center">手机号码</th>
                  <th class="text-center">来源渠道</th>
                  <th class="text-center">商品</th>
                  <th class="text-center">订单金额</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">下单时间</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center" style="width:240px;">{{obj.rechargeOrderId || '--'}}</td>
                  <td class="text-center">{{obj.nickName || '--'}}</td>
                  <td class="text-center">{{obj.phone || '--'}}</td>
                  <td class="text-center">{{$root.channelSelectMap[obj.channelNo] || '--'}}</td>
                  <td class="text-center">{{obj.rechargeGoodsName || '--'}}</td>
                  <td class="text-center">{{obj.totalAmount?(obj.totalAmount)/100:'--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs " :class="obj.rechargeOrderStatus == 0 ? 'green' : ' '" v-if="obj.rechargeOrderStatus == 0">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus]}}</span>
                    <span class="btn btn-xs " :class="obj.rechargeOrderStatus == 100 ? 'pink' : ' '" v-if="obj.rechargeOrderStatus == 100">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus]}}</span>
                    <span class="btn btn-xs " :class="obj.rechargeOrderStatus == 200 ? 'blue' : ' '" v-if="obj.rechargeOrderStatus == 200">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus]}}</span>
                    <span class="btn btn-xs " :class="obj.rechargeOrderStatus == 300 ? 'red' : ' '" v-if="obj.rechargeOrderStatus == 300">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus]}}</span>
                    <span class="btn btn-xs " :class="obj.rechargeOrderStatus == 400 ? 'purple' : ' '" v-if="obj.rechargeOrderStatus == 400">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus]}}</span>
                    <span class="btn btn-xs " :class="obj.rechargeOrderStatus == 500 ? 'orange' : ' '" v-if="obj.rechargeOrderStatus == 500">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus]}}</span>
                  </td>
                  <!-- unpay(0,"待支付"),paying(100,"支付中"),success(200,"已支付"),fail(300,"支付失败"),refund(400,"已退款"),cancel(500,"已取消"); -->
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">
                    <a @click="openDetaiForm($event, obj)" class="btn btn-xs purple" href="javascript:;"><i class="fa fa-search"></i> 查看详情</a>
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
        rechargeOrderStatus: '',
        rechargeOrderId: ''
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
    // 打开查看订单详情的Modal弹窗
    openDetaiForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit('openDetailModal', obj == null ? {} : obj);
    },
  },

  computed: {
    pagerConfig: function () {
      return {
        url: '/api/rechargeOrder/getRechargeOrderByPage',
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