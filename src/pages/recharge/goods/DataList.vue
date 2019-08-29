<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">搜索商品名称:</label>
                  <div class="">
                    <input type="text" class="form-control" placeholder="请输入商品名称搜索" v-model="searchParam.rechargeGoodsName" @keyup.enter="onSearch($event)" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-offset-0 col-md-12">
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

          <a v-show="checkPermissions(['addRechargeGoods'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;">
            <i class="fa fa-plus-square"></i> 新增充值商品
          </a>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">充值商品名称</th>
                  <th class="text-center">充值商品价格</th>
                  <th class="text-center">课时数</th>
                  <th class="text-center">可邀请次数</th>
                  <th class="text-center">可体验次数</th>
                  <th class="text-center">修改时间</th>
                  <th class="text-center">状态</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.rechargeGoodsName || '--'}}</td>
                  <td class="text-center">{{obj.price?obj.price/100:'--'}}</td>
                  <td class="text-center">{{obj.lcoin || '--'}}</td>
                  <td class="text-center">{{obj.experienceGiveNum || '--'}}</td>
                  <td class="text-center">{{obj.experienceUseNum || '--'}}</td>
                  <td class="text-center">{{obj.updateTime || '--'}}</td>
                  <td class="text-center"><span class="btn btn-xs" :class="obj.status == 1 ? 'green' : 'red'">{{obj.status == '1' ? '上架' : '下架'}}</span></td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateRechargeGoods'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 编辑
                    </a>
                    <a v-show="checkPermissions(['updateRechargeGoodsStatus'])" v-if="obj.status == '1'" @click="updateRechargeGoodsStatus($event,obj.rechargeGoodsId,0)" class="btn btn-xs red"
                      href="javascript:;">
                      <i class="fa fa-level-down"></i> 下架
                    </a>
                    <a v-show="checkPermissions(['updateRechargeGoodsStatus'])" v-if="obj.status == 0" @click="updateRechargeGoodsStatus($event,obj.rechargeGoodsId,1)" class="btn btn-xs green"
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

export default {
  components: {
    Pager
  },

  data: function () {
    return {
      searchParam: {}, // 搜索参数
      dataList: [] // 列表数据
    };
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        rechargeGoodsName: "",
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
    //上下架操作
    updateRechargeGoodsStatus: function (event, rechargeGoodsId, status) {
      event.preventDefault();
      let that = this;
      let data = {
        rechargeGoodsId: rechargeGoodsId,
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
              url: "/api/rechargeGoods/updateRechargeGoodsStatus",
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
        url: "/api/rechargeGoods/getRechargeGoodsByPage",
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
