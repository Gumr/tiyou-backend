<template>
  <div id="j_updateStatusModal" class="portlet light bordered modal fade" tabindex="-1" data-width="600">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">增减课时</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label">用户昵称：</label>
                <div class="col-md-6">
                  <span>{{nickName || '暂无'}}</span>
                  <img v-show="avatar" :src="avatar" style="width:30px;height:30px;border-radius:50%;margin-left:6px;">
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group inputgroun_margin_b">
                <label class="col-md-3 control-label"><span class="required">*</span>交易类别：</label>
                <div class="col-md-6">
                  <div class="mt-radio-inline">
                    <label class="mt-radio mt-radio-outline">
                      <input type="radio" value="1" v-model="formObj.transType"> 增加
                      <span></span>
                    </label>
                    <label class="mt-radio mt-radio-outline">
                      <input type="radio" value="2" v-model="formObj.transType"> 扣减
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group inputgroun_margin_b">
                <label class="col-md-3 control-label"><span class="required">*</span>账户类型：</label>
                <div class="col-md-6">
                  <div class="mt-radio-inline">
                    <label class="mt-radio mt-radio-outline">
                      <input type="radio" value="1" v-model="formObj.atype"> 课币
                      <span></span>
                    </label>
                    <label class="mt-radio mt-radio-outline">
                      <input type="radio" value="2" v-model="formObj.atype"> 体验卡
                      <span></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>流水类别：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.recordType">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in lcoinRecordTypeData" :value="item.accountRecordType">{{item.accountRecordName}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>交易数额：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入交易数额" v-model="formObj.transNum">
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label">关联业务编号：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入关联业务编号" v-model="formObj.businessNo" />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label">备注：</label>
                <div class="col-md-6">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
                  </div>
              </div>
            </div>

          </div>
        </div>
        <!-- 保存与取消按钮 -->
        <div class="form-actions">
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-offset-10 col-md-9">
                  <button type="button" class="btn green" @click="onSubmit($event)">保存</button>
                  <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消</button>
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
import basicData from 'common/js/basicData.js'


export default {
  data: function () {
    return {
      formObj: {},                  // 活动基础信息表单对象
      isAdd: false,                 // 是否新增活动基础信息
      nickName: "",    //用户昵称
      avatar: "",    //用户头像
      lcoinRecordTypeSelect: [],    //流水类别
      lcoinRecordTypeData: [],    //流水类别--显示用

    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        userId: "",    //用户ID
        transType: "",    //交易类别
        recordType: "",    //流水类别
        atype: "",    //账户类型
        remark: "",    //备注
        businessNo: "",    //关联业务编号
        transNum: "",    //交易数额

      };
    },

    // 新增兑换码信息提交
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.formObj.transType) {
        bootbox.alert('交易类别不能为空，请选择交易类别!');
        return
      }
      if (!self.formObj.recordType) {
        bootbox.alert('流水类别不能为空，请选择!');
        return
      }
      if (!self.formObj.atype) {
        bootbox.alert('账户类型不能为空，请选择!');
        return
      }
      if (!self.formObj.transNum) {
        bootbox.alert('交易数额不能为空，请输入交易数额!');
        return
      }
      $.ajax({
        url: "/api/user/updateUserLcoin",
        type: "POST",
        data: self.formObj
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          setTimeout(() => {
            window.location.reload(true);
          }, 800)
        } else {
          toastr.error(resp.msg);
        }
      });
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
  },
  //监听交易类别--筛选流水类别显示
  watch: {
    formObj: {
      handler: function (val, oldval) {
        let that = this;
        if (val.transType == 1) {
          that.lcoinRecordTypeData = [];
          that.lcoinRecordTypeSelect.forEach((item, index) => {
            if (val.transType == item.accountTransType) {
              that.lcoinRecordTypeData.push(item);
            }
          })
        } else if (val.transType == 2) {
          that.lcoinRecordTypeData = [];
          that.lcoinRecordTypeSelect.forEach((item, index) => {
            if (val.transType == item.accountTransType) {
              that.lcoinRecordTypeData.push(item);
            }
          })
        }else {
            that.lcoinRecordTypeData = that.lcoinRecordTypeSelect;
        }
      },
      deep: true
    }
  },

  created: function () {
    let that = this;
    //兑换码基础信息弹窗数据
    this.$root.$on("openLcoinControlModal", obj => {
      //   that.clearErrmsg();
      that.initFormObj();
      that.lcoinRecordTypeSelect = basicData.getLcoinRecordTypeSelect();
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.formObj = base.assignObj(this.formObj, obj);
        that.formObj.userId = obj.userId;
        that.nickName = obj.nickName;
        that.avatar = obj.avatar;
      }
      $("#j_updateStatusModal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },
  updated: function () {

  },

  mounted: function () {

  }
};
</script>
<style>
/* 时间有效期input框宽度设置 */
.input_maxWidth {
  width: 125px;
}
.inputgroun_margin_b {
    margin-bottom: 0px;
}
</style>