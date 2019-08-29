//新增主题
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
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>主题名称</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入名称" name="themeName" v-model="formObj.themeName" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>封面图</label>
                <div class="col-md-9">
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
                  <div class="text-success mt10">提示：图片文件不能大于2M，后缀类型为(.gif,jpeg,jpg,png)</div>
                  <div class="mt10 box coverImgBox">
                    <a class="ib" v-show="formObj.coverImg" :href="formObj.coverImg" target="_blank">
                      <img v-show="formObj.coverImg" :src="formObj.coverImg" style="width:100%;height:80px;padding-top:10px;">
                    </a>
                    <i class="fa fa-remove delete" v-show="formObj.coverImg" @click="removeImg($event,formObj.coverImg,2)"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>轮播图</label>
                <div class="col-md-9">
                  <div class="input-group">
                    <input autocomplete="off" type="text" class="form-control" placeholder="图片URL" name="bannerImg" v-model="imgList" readonly>
                    <span class="input-group-btn">
                      <span class="btn btn-success fileinput-button">
                        <span><i class="fa fa-cloud-upload"></i>上传文件</span>
                        <file-upload :config="uploadBannerFileConfig('bannerImg')">
                          <input slot="inputFile" type="file" name="file" multiple style="display: block;">
                        </file-upload>
                      </span>
                    </span>
                  </div>
                  <div class="text-success mt10">提示：图片文件不能大于2M，后缀类型为(.gif,jpeg,jpg,png)</div>
                  <div class="banner">
                    <div class="mt10 box" v-for="(item,index) in imgList">
                      <a class="ib" :href="item" target="_blank">
                        <img :src="item" style="width:150px;height:80px;padding-top:5px;">
                      </a>
                      <i class="fa fa-remove delete" @click="removeBannerImg($event,index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">排序</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" autocomplete="off" placeholder="值越小权重越高" v-model="formObj.sort" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">备注</label>
                <div class="col-md-9">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
                  </div>
                            </div>
                        </div>
                    </div>
                    <h4 class="form-section font-green">主题详情</h4>
                    <div class="row">
                        <div class="form-group">
                            <div class="col-md-12 row_margin">
                                <!-- <script id="templ" name="content" type="text/plain"></script> -->
                                <vue-ueditor-wrap ref="ueditor" @ready="ready" v-model="formObj.detail" :config="UeditorConfig"></vue-ueditor-wrap>
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
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  components: {
    FileUpload,
    VueUeditorWrap
  },
  data: function () {
    return {
      themeId: Number,
      imgList: [],            //轮播图，显示用
      ueID: null,
      editForm: null,         // 表单对象
      isAdd: false,           // 是否是新增
      formObj: {},            // 表单对象
      UeditorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 350,
        // 初始容器宽度
        initialFrameWidth: 1000,
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: '/api/ueditor/ueditorConfig',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/assets/global/plugins/ueditor/'
      }

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
      if (!self.isAdd) {
        self.formObj.themeId = self.themeId;
      }
      if (!self.formObj.themeName) {
        bootbox.alert('主题名称不能为空，请输入主题名称!');
        return
      } if (!self.formObj.coverImg) {
        bootbox.alert('封面图片不能为空，请上传封面图片!');
        return
      } if (self.formObj.bannerImg.length <= 0) {
        bootbox.alert('轮播图不能为空，请上传轮播图片!');
        return
      }
      //   if (self.editForm.valid()) {
      $.ajax({
        url: self.isAdd
          ? "/api/course/addTheme"
          : "/api/course/updateTheme",
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
    //文件上传配置
    uploadFileConfig(imgParamName) {
      let self = this;
      return {
        options: {
          url: "/api/file/addContent?type=image",
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, //支持的文件后缀
          maxFileSize: 1024 * 1024 * 2, //文件大小限制2M: 单位B, 0为不限制
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
    //文件上传配置
    uploadBannerFileConfig(imgParamName) {
      let self = this;
      return {
        options: {
          url: "/api/file/addContent?type=image",
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i, //支持的文件后缀
          maxFileSize: 2000000, //文件大小限制2M: 单位B, 0为不限制
          messages: {//文件错误信息
            acceptFileTypes: '文件类型不匹配',
            maxFileSize: '文件过大',
          },
          onUploadDone: function (resp, $input) {
            if (resp.code == "0000") {
              if ((self.imgList.length) + 1 > 6) {
                bootbox.alert('最多支持上传6张图片,请重新选择!');
                return
              } else {
                toastr.success(resp.msg);
                self.imgList.push(resp.data);
              }
            } else {
              toastr.error(resp.msg);
            }
          }
        }
      };
    },
    //删除对应轮播图
    removeBannerImg(event, index) {
      this.formObj.bannerImg.splice(index, 1);
    },
    //删除logo或者封面图片
    removeImg(event, obj, imgNum) {
      if (imgNum == 1) {
        this.formObj.logoImg = '';
      } else if (imgNum == 2) {
        this.formObj.coverImg = '';
      }
    },
    // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
    ready(editorInstance) {
      //   console.log(`实例${editorInstance.key}已经初始化:`, editorInstance)
      editorInstance.addListener("beforefullscreenchange", function (
        event,
        isFullScreen
      ) {
        base.ueFullScreenHandler(event, isFullScreen);
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
        this.formObj = base.assignObj(this.formObj, obj);
        this.imgList = obj.bannerImg;
      }
      $("#j_modal").modal({ backdrop: 'static', keyboard: false }); //Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
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
.coverImgBox {
  width: 200px;
  margin-top: 20px;
}
</style>
