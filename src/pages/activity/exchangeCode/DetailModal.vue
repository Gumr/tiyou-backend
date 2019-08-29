<template>
  <div id="detail_modal" class="portlet light bordered modal fade" tabindex="-2" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">兑换码列表</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <div class="row flex_group">
            <!-- 所属商户 -->
            <!-- <div class="form-group flex_content">
              <label class="control-label lable_title_name">所属商户:</label>
              <div class="">
                <select class="form-control" v-model="formObj.merchantId">
                  <option selected="selected" value>请选择商户</option> -->
            <!-- <option v-for="item in $root.merchantSelect" :value="item.merchantId">{{item.merchantName}}</option> -->
            <!-- </select>
              </div>
            </div> -->
            <!-- 状态 -->
            <div class="form-group flex_content">
              <label class="control-label lable_title_name">状态:</label>
              <div class="">
                <select class="form-control" v-model="formObj.status" @change="onSearch($event)">
                  <option selected="selected" value="">请选择</option>
                  <option value="0">未兑换</option>
                  <option value="1">已兑换</option>
                  <option value="2">已作废</option>
                </select>
              </div>
            </div>
            <div class="form-group flex_content">
              <label class="control-label lable_title_name">兑换码:</label>
              <div class="">
                <input type="text" class="form-control" autocomplete="off" placeholder="请输入兑换码搜索" v-model="formObj.code" />
              </div>
            </div>
            <div class="col-md-6">
              <button type="button" class="btn default" @click="clearSearch($event)">
                <i class="fa fa-remove"></i> 清空
              </button>
              <button type="button" class="btn blue" @click="onSearch($event)">
                <i class="fa fa-search"></i> 搜索
              </button>
              <button type="button" class="btn green" v-show="checkPermissions(['exportRedeemCodeExcel'])" @click="exportRedeemCodeExcel($event)">
                <i class="fa fa-download"></i> Excel导出
              </button>
            </div>
          </div>
          <div class="table-scrollable redeem_detail_list" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">兑换码</th>
                  <th class="text-center">所属状态</th>
                  <th class="text-center">兑换用户</th>
                  <th class="text-center">手机号码</th>
                  <th class="text-center">兑换时间</th>
                  <th class="text-center">创建时间时间</th>
                  <th class="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center" style="width:240px;">{{obj.code || '--'}}</td>
                  <td class="text-center">
                    <span class="btn btn-xs" v-if="obj.status == 0" :class="obj.status == 0 ? 'blue' : ''">{{status[obj.status] || '--'}}</span>
                    <span class="btn btn-xs" v-if="obj.status == 1" :class="obj.status == 1 ? 'green' : ''">{{status[obj.status] || '--'}}</span>
                    <span class="btn btn-xs" v-if="obj.status == 2" :class="obj.status == 2? 'red' : ''">{{status[obj.status] || '--'}}</span>
                  </td>
                  <td class="text-center">{{obj.nickName || '--'}}</td>
                  <td class="text-center">{{obj.phone || '--'}}</td>
                  <td class="text-center">{{obj.redeemTime || '--'}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
                  <td class="text-center">
                    <a v-show="checkPermissions(['updateRedeemCodeStatus'])" v-if="obj.status == 0" @click="cancelExchangeCode($event,obj.code, 2)" class="btn btn-xs purple" href="javascript:;">
                      <i class="fa fa-edit"></i> 作废兑换码
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
        <!-- 保存与取消按钮 -->
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
import base from "common/js/utils/base.js";
import FileUpload from "components/file-upload/file-upload.vue";
import basicData from 'common/js/basicData.js'


export default {
  components: {
    FileUpload
  },
  data: function () {
    return {
      status: { "0": "未兑换", "1": "已兑换", "2": "已作废" },//兑换码状态筛选： 0=未兑换 1=已兑换 2=已作废
      editForm: null,               // 表单对象
      formObj: {},                  // 活动基础信息表单对象
      isAdd: false,                 // 是否新增活动基础信息
      dataList: [],                 //兑换码列表数据
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        status: "",       //状态
        batchId: "",      //兑换码id
        code: "",         //兑换码
      };
    },


    // 清空错误提示
    clearErrmsg: function () {
      this.editForm
        .find(".has-error")
        .closest("span")
        .remove();
      this.editForm.find(".has-error").each(function () {
        $(this).removeClass("has-error");
      });
    },

    //作废兑换码
    cancelExchangeCode: function (event, code, status) {
      event.preventDefault();
      let that = this;
      let data = {
        code: code,
        status: status
      }
      var message = '作废该兑换码将失效，是否作废该兑换码？'
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
              url: "/api/redeemcode/updateRedeemCodeStatus",
              type: "POST",
              data: data,
            }).done(resp => {
              if (resp.code == "0000") {
                toastr.success(resp.msg);
                setTimeout(() => {
                  that.getRedeemCodeByPage(this.formObj);
                }, 800)
                // window.location.reload(true);
              } else {
                toastr.error(resp.msg)
              }
            });
          }
        }
      });
    },
    //根据id获取兑换码详情列表数据
    getRedeemCodeByPage: function (batchId) {
      $.ajax({
        url: "/api/redeemcode/getRedeemCodeByPage",
        type: "POST",
        data: this.formObj,
      }).done(resp => {
        if (resp.code == "0000") {
          //   toastr.success(resp.msg);
          this.dataList = resp.data.list;
        } else {
          toastr.error(resp.msg)
        }
      });
    },
    // 执行搜索
    onSearch: function (event) {
      event.preventDefault();
      this.getRedeemCodeByPage(this.formObj);
      //   this.$refs.pager.gotoPage(1, true); //调用子组件的方法
    },
    // 导出excel表
    exportRedeemCodeExcel: function () {
      let batchId = this.formObj.batchId;
      let status = this.formObj.status;
      window.open("/api/redeemcode/exportRedeemCodeExcel?batchId=" + batchId + "&status=" + status);
    },
  },

  created: function () {
    let that = this;
    //兑换码详情信息弹窗数据
    this.$root.$on("openCheckDetailModal", obj => {
      //   that.clearErrmsg();
      that.initFormObj();
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.formObj.batchId = obj.batchId;
        that.getRedeemCodeByPage(that.formObj);
        that.formObj = base.assignObj(this.formObj, obj);
        that.formObj.status = '';

      }
      $("#detail_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });


  },
  updated: function () {

  },

  mounted: function () {

  }
};
</script>
<style>
/* 兑换码详情列表分页暂时有问题，所以设置滚动条 */
.redeem_detail_list {
  max-height: 400px;
  overflow-y: auto;
}
</style>