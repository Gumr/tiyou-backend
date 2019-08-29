//课程套餐入库信息确认
<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="600">
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">课程套餐入库信息确认</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>用户手机：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" readonly="readonly"  placeholder="请输入手机号码" name="themeName" v-model="formObj.themeName" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>课程套餐：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" readonly="readonly" placeholder="请选择" v-model="formObj.sort" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>学生数量：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" readonly="readonly" placeholder="请输入学生数量" v-model="formObj.sort" />
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

export default {

  data: function () {
    return {
      editForm: null,         // 表单对象
      isAdd: false,           // 是否是新增
      formObj: {},            // 表单对象
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        themeName: "",      // 主题名称
        coverImg: "",       // 封面图片
        bannerImg: [],      // 轮播图
        detail: "",         //主题详情
        remark: "",          //备注
        sort: "",           //排序
      };
    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      //   self.formObj.detail = this.ueID.getContent();
      if (!self.isAdd) {
        self.formObj.themeId = self.themeId;
      }
      //   if (self.editForm.valid()) {
      $.ajax({
        url: self.isAdd
          ? "/api/theme/addTheme"
          : "/api/theme/updateTheme",
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
      //   }
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

  created: function () {
    this.$root.$on("openAddEditModal", obj => {
      this.clearErrmsg();
      this.initFormObj();
      this.imgList = [];
      this.isAdd = $.isEmptyObject(obj);
      if (!this.isAdd) {
        this.themeId = obj.themeId;
        // this.ueID.ready(() => {
        //   setTimeout(() => {
        //     that.ueID.setContent(obj.detail ? obj.detail : "");
        //   }, 500)
        // });

        this.formObj = base.assignObj(this.formObj, obj);
        this.imgList = obj.bannerImg;
      }

      $("#j_modal").modal({ backdrop: 'static', keyboard: false }); //Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
    // this.initUeditor();
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_editForm");
    this.editForm.validate({
      rules: {
        themeName: {
          required: true
        },
        coverImg: {
          required: true
        },
        bannerImg: {
          required: true
        },
      }
    });

  }
};
</script>

<style>
#j_modal {
  width: 600px;
}

#templ {
  display: flex;
  justify-content: center;
}
</style>
