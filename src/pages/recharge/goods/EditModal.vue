<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">新增|编辑</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <h4 class="form-section font-green">基本信息</h4>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-5 control-label">
                  <span class="required">*</span>方案名称：
                </label>
                <div class="col-md-7">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入方案内部名称" name="rechargeGoodsName" v-model="formObj.rechargeGoodsName" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-5 control-label">
                  <span class="required">*</span>充值方案价格：
                </label>
                <div class="col-md-7">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入充值方案价格" name="price" v-model="formObj.price" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-5 control-label">
                  <span class="required">*</span>对应课时
                </label>
                <div class="col-md-7">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入对应课时" name="lcoin" v-model="formObj.lcoin" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-5 control-label"><span class="required">*</span>充值商品图</label>
                <div class="col-md-7">
                  <div class="input-group">
                    <input autocomplete="off" type="text" class="form-control" placeholder="图片URL" name="coverImg" v-model="formObj.coverImg" readonly>
                    <span class="input-group-btn">
                      <span class="btn btn-success fileinput-button">
                        <span><i class="fa fa-cloud-upload"></i>上传文件</span>
                        <file-upload :config="uploadFileConfig('coverImg')">
                          <input slot="inputFile" type="file" name="file" style="display: block;">
                        </file-upload>
                      </span>
                    </span>
                  </div>
                  <!-- <div class="text-success mt10">提示：图片文件不能大于10M，后缀类型为(.gif,jpeg,jpg,png)</div> -->
                  <div class="mt10">
                    <a class="ib" v-show="formObj.coverImg" :href="formObj.coverImg" target="_blank">
                      <img v-show="formObj.coverImg" :src="formObj.coverImg" style="width:150px;height:80px;padding-top:10px;">
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 课程备注 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-5 control-label">排序</label>
                <div class="col-md-7">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入排序编号" v-model="formObj.sort" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-5 control-label">
                  备注
                </label>
                <div class="col-md-7">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入课程备注" v-model="formObj.remark" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
import FileUpload from "components/file-upload/file-upload.vue";

export default {
  components: {
    FileUpload
  },
  data: function () {
    return {
      ueID: null,
      rechargeGoodsId: Number,//充值订单id
      editForm: null, // 表单对象
      isAdd: false, // 是否是新增
      formObj: {} // 表单对象
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        rechargeGoodsName: "", // 方案名称
        price: "", // 支付价格
        coverImg: "", // 轮播图
        lcoin: "", //对应课币
        sort: "", //排序
        remark: "" //备注
      };
    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.isAdd) {
        self.formObj.rechargeGoodsId = self.rechargeGoodsId;
      }
      self.formObj.price = self.formObj.price * 100;
      if (self.editForm.valid()) {
        $.ajax({
          url: self.isAdd ?
            "/api/rechargeGoods/addRechargeGoods"
            : "/api/rechargeGoods/updateRechargeGoods",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(self.formObj)
        }).done(resp => {
          if (resp.code == "0000") {
            toastr.success(resp.msg);
            setTimeout(() => {
              window.location.reload(true);
            }, 500);
          } else {
            toastr.error(resp.msg);
          }
        });
      }
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
    //文件上传配置
    uploadFileConfig(imgParamName) {
      let self = this;
      return {
        options: {
          url: "/api/file/addContent?type=image",
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, //支持的文件后缀
          maxFileSize: 1024*1024*2, //文件大小限制2M: 单位B, 0为不限制
          messages: {//文件错误信息
            acceptFileTypes: '文件类型不匹配',
            maxFileSize: '文件过大',
          },
          onUploadDone: function (resp, $input) {
            if (resp.code == "0000") {
              toastr.success(resp.msg);
              self.formObj[imgParamName] = resp.data;
            } else {
              toastr.error(resp.msg);
            }
          }
        }
      };
    },
  },

  created: function () {
    this.$root.$on("openAddEditModal", obj => {
      this.clearErrmsg();
      this.initFormObj();
      this.isAdd = $.isEmptyObject(obj);
      if (!this.isAdd) {
        this.formObj = base.assignObj(this.formObj, obj);
        this.rechargeGoodsId = obj.rechargeGoodsId;
        this.formObj.price = obj.price / 100;
      }

      $("#j_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_editForm");
    this.editForm.validate({
      rules: {
        rechargeGoodsName: {
          required: true
        },
        price: {
          required: true
        },
        lcoin: {
          required: true
        },
        coverImg: {
          required: true
        },
      }
    });
  }
};
</script>
<style>
.banner {
  display: flex;
  margin-top: 10px;
}

.box {
  position: relative;
  margin-right: 15px;
  margin-top: 5px;
}
.delete {
  position: absolute;
  display: block;
  text-align: center;
  border-radius: 50%;
  right: -6px;
  top: -6px;
  padding: 5px;
  font-size: 18px;
  background: rgb(226, 224, 224);
  opacity: 0.8;
}

.range {
  display: flex;
  align-items: center;
}

#templ {
  display: flex;
  justify-content: center;
}
</style>