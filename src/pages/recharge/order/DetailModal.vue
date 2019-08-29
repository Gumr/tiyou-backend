<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">订单详情</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <h4 class="form-section font-green">订单状态</h4>
          <div class="row" style="padding-left:20px;">
            <div class="form-group">
              <div class="col-md-8">
                <span>下单时间:</span>
                <span>{{editForm.createTime?editForm.createTime:''}}</span>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-8">
                <span>订单状态:</span>
                <span>{{formater(Number(editForm.rechargeOrderStatus))}}</span>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-8">
                <span>订单编号:</span>
                <span>{{editForm.rechargeOrderId?editForm.rechargeOrderId:'暂无'}}</span>
              </div>
            </div>
          </div>
          <h4 class="form-section font-green">用户信息</h4>
          <div class="row" style="padding-left:20px;">
            <div class="form-group">
              <div class="col-md-8">
                <span>用户名称:</span>
                <span>{{editForm.nickName?editForm.nickName:'暂无'}}</span>
              </div>
            </div>
          </div>
          <h4 class="form-section font-green">支付信息</h4>
          <div class="row" style="padding-left:20px;">
            <div class="form-group">
              <div class="col-md-8">
                <span>订单总额:</span>
                <span>{{editForm.totalAmount/100}}</span>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-8">
                <span>支付总额:</span>
                <span>{{editForm.realpayAmount/100}}</span>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-8">
                <span>支付方式:</span>
                <span>微信小程序支付</span>
              </div>
            </div>
          </div>
          <h4 class="form-section font-green">商品信息</h4>
          <div class="row" style="padding-left:20px;">
            <div class="form-group">
              <div class="col-md-8">
                <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                  <thead>
                    <tr>
                      <th class="text-center">商品名称</th>
                      <th class="text-center">商品单价</th>
                      <th class="text-center">商品总价</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center">{{editForm.rechargeGoodsName}}</td>
                      <td class="text-center">{{editForm.rechargeGoodsPrice/100}}</td>
                      <td class="text-center">{{editForm.totalAmount/100}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-offset-10 col-md-9">
                  <button type="button" data-dismiss="modal" class="btn btn-outline dark">关闭</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import base from 'common/js/utils/base.js';

export default {
  data: function () {
    return {
      editForm: {},         // 表单对象
    };
  },

  methods: {
    //订单状态格式化
    formater: function (status) {
      switch (status) {
        case 0:
          return '待支付';
          break;
        case 100:
          return '支付中';
          break;
        case 200:
          return '已支付';
          break;
        case 300:
          return '支付失败';
          break;
        case 400:
          return '已退款';
          break;
        case 500:
          return '已取消';
          break;
      }
    },


  },

  created: function () {
    this.$root.$on('openDetailModal', obj => {
      this.editForm = obj
      this.isAdd = $.isEmptyObject(obj);
      $('#j_modal').modal();
    });
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $('#j_editForm');
  }
}
</script>