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
          <h4 class="form-section font-green">基础信息</h4>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>活动名称：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入活动名称" v-model="formObj.activityName" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label"><span class="required">*</span>日期：</label>
                <div class="col-md-9">
                  <input type="text" placeholder="请选择开始日期" autocomplete="off" class="form-control input input-inline" id="j_startTime" name="startTime" v-model="startTime"> -
                  <input type="text" placeholder="请选择结束日期" autocomplete="off" class="form-control input input-inline " id="j_endTime" name="endTime" v-model="endTime">
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">排序：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" v-model="formObj.sort" autocomplete="off" placeholder="值越小权重越高" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label">备注：</label>
                <div class="col-md-8">
                  <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
                  </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 活动首页广告图 -->
        <h4 class="form-section font-green">活动首页广告图</h4>
        <div class="row row_margin">
          <div class="form-group">
            <a v-show="checkPermissions(['addRedPacketActivityAdvimg'])" v-if="activityId != null  && bannerImgList.length < 1 " @click="onAddImgEditForm($event,2,null)" class="btn green-meadow" href="javascript:;">
              <i class="fa fa-plus-square"></i> 添加广告图
            </a>
            <div class="table-scrollable" v-if="bannerImgList.length > 0">
              <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                <thead>
                  <tr>
                    <th class="text-center">图片路径</th>
                    <th class="text-center">图片类型</th>
                    <th class="text-center">排序</th>
                    <th class="text-center">备注</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(obj,idx) in bannerImgList">
                    <td class="text-center" style="width:600px;">{{obj.imgUrl}}</td>
                    <td class="text-center">{{obj.imgType == 1?'轮播图':'广告图'}}</td>
                    <td class="text-center">{{obj.sort}}</td>
                    <td class="text-center">{{obj.remark}}</td>
                    <td class="text-center">
                      <a v-show="checkPermissions(['updateRedPacketActivityAdvimg'])" @click="onAddImgEditForm($event,2,obj)" class="btn btn-xs purple" href="javascript:;">
                        <i class="fa fa-edit"></i> 编辑
                      </a>
                      <a v-show="checkPermissions(['deleteRedPacketActivityAdvimg'])" @click="deleteRedPacketActivityAdvimg($event,obj.id)" class="btn btn-xs red" href="javascript:;">
                        <i class="fa fa-remove"></i> 删除
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="alert alert-success no-margin margin-top-10" v-if="bannerImgList.length <= 0">
              <span>暂无数据</span>
            </div>
            <!-- 添加图片弹窗 -->
          </div>
          <div class="add-addImg-modal">
            <div class="modal fade" id="j_addImgModa" tabindex="-2" data-width="600" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">新增 | 编辑图片</h4>
                  </div>
                  <div class="modal-body">
                    <form action class="form-horizontal" id="addImg_editForm">
                      <div class="form-body">
                        <div class="form-group">
                            <label class="col-md-3 control-label"><span class="required">*</span>上传图片：</label>
                            <div class="col-md-8">
                            <div class="input-group">
                                <input autocomplete="off" type="text" class="form-control" placeholder="图片URL" name="imgUrl" v-model="advImgformObj.imgUrl" readonly>
                                <span class="input-group-btn">
                                <span class="btn btn-success fileinput-button">
                                    <span><i class="fa fa-cloud-upload"></i>上传文件</span>
                                    <file-upload :config="uploadFileConfig('imgUrl')">
                                    <input slot="inputFile" type="file" name="file" style="display: block;">
                                    </file-upload>
                                </span>
                                </span>
                            </div>
                            <div class="text-success mt10">提示：图片文件不能大于2M，后缀类型为(.gif,jpeg,jpg,png)</div>
                            <div class="mt10">
                                <a class="ib" v-show="advImgformObj.imgUrl" :href="advImgformObj.imgUrl" target="_blank">
                                <img v-show="advImgformObj.imgUrl" :src="advImgformObj.imgUrl" style="width:150px;height:80px;padding-top:10px;">
                                </a>
                            </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label"><span class="required">*</span>图片类型：</label>
                            <div class="col-md-8">
                            <select name="courseType" class="form-control input" v-model="advImgformObj.imgType">
                                <option value="" selected="selected">请选择</option>
                                <option :value="2" v-if="imgType2">广告图</option>
                                <option :value="1" v-if="imgType1">轮播图</option>
                            </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">排序：</label>
                            <div class="col-md-8">
                            <input type="text" class="form-control" v-model="advImgformObj.sort" autocomplete="off" placeholder="值越小权重越高" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label">备注：</label>
                            <div class="col-md-8">
                            <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="advImgformObj.remark" />
                            </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn green" @click="saveAdvImg($event)">保存</button>
                    <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 活动轮播图 -->
        <h4 class="form-section font-green">活动轮播图</h4>
        <div class="row row_margin">
          <div class="form-group">
            <a v-show="checkPermissions(['addRedPacketActivityAdvimg'])" v-if="activityId != null && coverImgList.length < 6 " @click="onAddImgEditForm($event,1,null)" class="btn green-meadow" href="javascript:;">
              <i class="fa fa-plus-square"></i> 添加轮播图
            </a>
            <div class="table-scrollable" v-if="coverImgList.length > 0">
              <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                <thead>
                  <tr>
                    <th class="text-center">图片路径</th>
                    <th class="text-center">图片类型</th>
                    <th class="text-center">排序</th>
                    <th class="text-center">备注</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(obj,idx) in coverImgList">
                    <td class="text-center" style="width:600px;">{{obj.imgUrl}}</td>
                    <td class="text-center">{{obj.imgType == 1?'轮播图':'广告图'}}</td>
                    <td class="text-center">{{obj.sort}}</td>
                    <td class="text-center">{{obj.remark}}</td>
                    <td class="text-center">
                      <a v-show="checkPermissions(['updateRedPacketActivityAdvimg'])" @click="onAddImgEditForm($event,1,obj)" class="btn btn-xs purple" href="javascript:;">
                        <i class="fa fa-edit"></i> 编辑
                      </a>
                      <a v-show="checkPermissions(['deleteRedPacketActivityAdvimg'])" @click="deleteRedPacketActivityAdvimg($event,obj.id)" class="btn btn-xs red" href="javascript:;">
                        <i class="fa fa-remove"></i> 删除
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="alert alert-success no-margin margin-top-10" v-if="coverImgList.length <= 0">
              <span>暂无数据</span>
            </div>
          </div>
        </div>

         <!-- 活动配置 -->
        <h4 class="form-section font-green">红包金额管理</h4>
        <div class="row row_margin">
          <div class="form-group">
            <a v-show="checkPermissions(['addRedPacketActivityConfig'])" v-if="activityId != null" @click="onActivityConfigEditForm($event)" class="btn green-meadow" href="javascript:;">
              <i class="fa fa-plus-square"></i> 添加红包金额配置
            </a>
            <div class="table-scrollable" v-if="activityConfigList.length > 0">
              <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                <thead>
                  <tr>
                    <th class="text-center">金额类型</th>
                    <th class="text-center">最低金额</th>
                    <th class="text-center">最高金额</th>
                    <th class="text-center">红包数量</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(obj,idx) in activityConfigList">
                    <td class="text-center" >{{obj.redPacketType == 1?'新人红包':'天天领红包'}}</td>
                    <td class="text-center">{{obj.minAmount/100}}</td>
                    <td class="text-center">{{obj.maxAmount/100}}</td>
                    <td class="text-center">{{obj.redPacketCount}}</td>
                    <td class="text-center">
                      <a v-show="checkPermissions(['updateRedPacketActivityConfig'])" @click="onActivityConfigEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;">
                        <i class="fa fa-edit"></i> 编辑
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="alert alert-success no-margin margin-top-10" v-if="activityConfigList.length <= 0">
              <span>暂无数据</span>
            </div>
            <!-- 添加图片弹窗 -->
          </div>
          <div class="add-addImg-modal">
            <div class="modal fade" id="j_addRedPacketActivityConfigModa" tabindex="-2" data-width="600" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">新增 | 编辑图片</h4>
                  </div>
                  <div class="modal-body">
                    <form action class="form-horizontal" id="addImg_editForm">
                      <div class="form-body">
                        <div class="form-group">
                            <label class="col-md-3 control-label"><span class="required">*</span>红包类型：</label>
                            <div class="col-md-8">
                                <select name="courseType" class="form-control input" v-model="activityConfigformObj.redPacketType">
                                    <option value="" selected="selected">请选择</option>
                                    <option :value="1">新人红包</option>
                                    <option :value="2">天天领红包</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label"><span class="required">*</span>最低金额：</label>
                            <div class="col-md-8">
                                <input type="text" class="form-control" v-model="activityConfigformObj.minAmount" autocomplete="off" placeholder="请输入最低金额" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label"><span class="required">*</span>最高金额：</label>
                            <div class="col-md-8">
                                <input type="text" class="form-control" v-model="activityConfigformObj.maxAmount" autocomplete="off" placeholder="请输入最高金额" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-3 control-label"><span class="required">*</span>红包数量：</label>
                            <div class="col-md-8">
                                <input type="text" class="form-control" v-model="activityConfigformObj.redPacketCount" autocomplete="off" placeholder="清输入红包数量" />
                            </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn green" @click="saveActivityConfig($event)">保存</button>
                    <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 活动基础信息保存与取消按钮 -->
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
import basicData from 'common/js/basicData.js'


export default {
  components: {
    FileUpload
  },
  data: function () {
    return {
      activityId: null,             //活动id
      editForm: null,               // 表单对象
      formObj: {},                  // 活动基础信息表单对象
      advImgformObj: {},            // 图片信息对象
      activityConfigformObj: {},    // 活动配置信息表单对象
      isAdd: false,                 // 是否新增活动基础信息
      isAddvimg: false,             //是否新增图片
      advimgId: null,               //新增图片id
      isAddActivityConfig: false,   //是否新增活动配置
      activityConfigId: false,      //活动配置id
      addImgList: [],               //图片数据
      coverImgList: [],             //轮播图数据
      bannerImgList: [],            //首页广告图数据
      activityConfigList: [],       //活动配置数据
      startTime: '',                //开始日期
      endTime: '',                  //结束日期
      imgType1: true,                 //轮播图上传类型显示
      imgType2: true,                 //广告上传类型显示
    };
  },

  methods: {
    // 初始化表单参数
    initFormObj: function () {
      this.formObj = {
        activityName: "",       //活动名称
        activityBeginTime: "",  //活动开始时间
        activityEndTime: "",    //活动结束时间
        sort: "",               //排序
        remark: "",             //备注
      };
    },
    // 初始化图片信息表单参数
    initAdvImgformObj: function () {
      this.advImgformObj = {
        imgType: "",            //图片类型: 1=轮播图,2=广告图
        imgUrl: "",             //图片路径
        remark: "",             //备注
        sort: "",               //排序权重
      };
    },
    // 初始化活动配置信息表单参数
    initActivityConfigformObj: function () {
      this.activityConfigformObj = {
        redPacketType: "",      //红包类型: 1=新人红包, 2=天天领红包
        minAmount: "",          //最低红包金额,分
        maxAmount: "",          //最高红包金额,分
        redPacketCount: "",     //红包数量
      };
    },

    // 活动基础信息提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.isAdd) {
        self.formObj.activityId = self.activityId;
      }
      self.formObj.activityBeginTime = new Date(self.startTime).getTime();
      self.formObj.activityEndTime = new Date(self.endTime).getTime();
      if (!self.formObj.activityName) {
        bootbox.alert('红包活动名称不能为空，请输入活动名称!');
        return
      }
      if (!self.startTime) {
        bootbox.alert('开始时间不能为空，请选择开始时间!');
        return
      }
      if (!self.endTime) {
        bootbox.alert('结束时间不能为空，请选择结束时间!');
        return
      }
      if (new Date(self.startTime).getTime() > new Date(self.endTime).getTime()) {
        bootbox.alert('开始时间不能大于结束时间，请重新选择!');
        return
      }
      $.ajax({
        url: self.isAdd
          ? "/api/redpacketActivity/addRedPacketActivity"
          : "/api/redpacketActivity/updateRedPacketActivity",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self.formObj)
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          window.location.reload(true);
          self.startTime = '';
          self.endTime = '';
        } else {
          toastr.error(resp.msg);
        }
      });
    },

    //首页和轮播图提交
    saveAdvImg: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.isAddvimg) {
        self.advImgformObj.id = self.advimgId;
      } else {
        self.advImgformObj.activityId = self.activityId;
      }
      if (!self.advImgformObj.imgUrl) {
        bootbox.alert('图片地址不能为空，请选择图片上传!');
        return
      }
      if (!self.advImgformObj.imgType) {
        bootbox.alert('图片类型不能为空，请选择图片类型!');
        return
      }
      $.ajax({
        url: self.isAddvimg
          ? "/api/redpacketActivityAdvimg/addRedPacketActivityAdvimg"
          : "/api/redpacketActivityAdvimg/updateRedPacketActivityAdvimg",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self.advImgformObj)
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          $("#j_addImgModa").modal('hide');  //手动关闭图片上传弹窗
          setTimeout(() => {
            this.coverImgList = [];
            this.bannerImgList = [];
            self.getRedPacketActivityAdvimg(self.activityId);
          }, 800)
        } else {
          toastr.error(resp.msg);
        }
      });
    },

    //活动配置信息提交
    saveActivityConfig: function (event) {
      event.preventDefault();
      var self = this;
      if (!self.isAddActivityConfig) {
        self.activityConfigformObj.id = self.activityConfigId;
      } else {
        self.activityConfigformObj.activityId = self.activityId;
      }
      self.activityConfigformObj.minAmount = Number(self.activityConfigformObj.minAmount) * 100;
      self.activityConfigformObj.maxAmount = Number(self.activityConfigformObj.maxAmount) * 100;
      if (!self.activityConfigformObj.redPacketType) {
        bootbox.alert('红包活动配置类型不能为空，请选择活动类型!');
        return
      }
      if (!Number(self.activityConfigformObj.minAmount)) {
        bootbox.alert('红包最低金额不能为空，请输入最低金额!');
        return
      }
      if (!Number(self.activityConfigformObj.maxAmount)) {
        bootbox.alert('红包最高金额不能为空，请输入最高金额!');
        return
      }
      if (Number(self.activityConfigformObj.minAmount) >= Number(self.activityConfigformObj.maxAmount)) {
        bootbox.alert('红包最低金额不能大于或等于最高金额，请重新输入!');
        return
      }
      if (!Number(self.activityConfigformObj.redPacketCount)) {
        bootbox.alert('红包个数不能为空，请输入红包个数!');
        return
      }
      if ((Number(self.activityConfigformObj.minAmount) * 100) < (Number(self.activityConfigformObj.redPacketCount)) || (Number(self.activityConfigformObj.maxAmount) * 100) < (Number(self.activityConfigformObj.redPacketCount))) {
        bootbox.alert('最低红包金额不能小于红包个数，请重新输入!');
        return
      }
      $.ajax({
        url: self.isAddActivityConfig
          ? "/api/redpacketActivityConfig/addRedPacketActivityConfig"
          : "/api/redpacketActivityConfig/updateRedPacketActivityConfig",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(self.activityConfigformObj)
      }).done(resp => {
        if (resp.code == "0000") {
          toastr.success(resp.msg);
          $("#j_addRedPacketActivityConfigModa").modal('hide');  //手动关闭活动配置弹窗
          setTimeout(() => {
            this.activityConfigList = [];
            self.getRedPacketActivityConfig(self.activityId);
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
              self.advImgformObj[imgParamName] = resp.data;
            } else {
              toastr.error(resp.msg);
            }
          }
        }
      };
    },

    //查询红包活动图片(不分页) 
    getRedPacketActivityAdvimg: function (activityId) {
      let that = this;
      $.ajax({
        url: "/api/redpacketActivityAdvimg/getRedPacketActivityAdvimg",
        type: "POST",
        data: { activityId: activityId }
      }).done(resp => {
        if (resp.code == "0000") {
          that.addImgList = [];
          that.coverImgList = [];
          that.bannerImgList = [];
          that.addImgList = resp.data;
          that.addImgList.forEach((item, idx) => {
            if (item.imgType == 1) {
              that.coverImgList.push(item);
            } else {
              that.bannerImgList.push(item);
            }
          })
        } else {
          toastr.error(resp.msg);
        }
      });
    },

    //删除红包活动图片
    deleteRedPacketActivityAdvimg: function (event, advimgId) {
      let that = this;
      if (advimgId) {
        bootbox.confirm({
          message: '确认删除？',
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
                url: "/api/redpacketActivityAdvimg/deleteRedPacketActivityAdvimg",
                type: "POST",
                data: { advimgId: advimgId }
              }).done(resp => {
                if (resp.code == "0000") {
                  toastr.success(resp.msg);
                  this.coverImgList = [];
                  this.bannerImgList = [];
                  that.getRedPacketActivityAdvimg(that.activityId);
                } else {
                  toastr.error(resp.msg);
                }
              });
            }
          }
        });
      }
    },

    //查询红包活动配置(不分页) 
    getRedPacketActivityConfig: function (activityId) {
      let that = this;
      $.ajax({
        url: "/api/redpacketActivityConfig/getRedPacketActivityConfig",
        type: "POST",
        data: { activityId: activityId }
      }).done(resp => {
        if (resp.code == "0000") {
          that.activityConfigList = resp.data;
        } else {
          toastr.error(resp.msg);
        }
      });
    },

    // 打开添加与编辑图片上传表单的Modal弹窗
    onAddImgEditForm: function (event, imgtypes, obj) {
      event.preventDefault();
      var types = imgtypes;
    //   console.log(types, 'types')
      this.$root.$emit("openAddImgModal", types, obj == null ? {} : obj);
    },
    // 打开添加与编辑活动配置表单的Modal弹窗
    onActivityConfigEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit("openActivityConfigModal", obj == null ? {} : obj);
    },

    // 初始化时间插件
    initTimePicker: function () {
      let self = this;
      let _start = $("#j_startTime");   //开始日期元素
      let _end = $("#j_endTime");       //结束日期元素
      _start.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd hh:ii",
        minView: 0
      });
      _end.datetimepicker({
        autoclose: true,
        todayBtn: true,
        todayHighLight: true,
        language: "zh-CN",
        format: "yyyy-mm-dd hh:ii",
        minView: 0
      });
      //隐藏时绑定数据
      _start.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.startTime = _start.val();
      });
      _end.datetimepicker().on("hide.datetimepicker", function (ev) {
        self.endTime = _end.val();
      });
    },
  },

  created: function () {
    let that = this;
    //红包活动基础信息弹窗数据
    this.$root.$on("openAddEditModal", obj => {
      that.clearErrmsg();
      that.initFormObj();
      that.startTime = '';
      that.endTime = '';
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        if (obj.activityId) {
          that.getRedPacketActivityAdvimg(obj.activityId);//查询红包活动图片(不分页) 
          that.getRedPacketActivityConfig(obj.activityId);//查询红包活动配置(不分页)
          that.activityId = obj.activityId;
        }
        that.startTime = String(obj.activityBeginTime);
        that.endTime = String(obj.activityEndTime);
        that.formObj = base.assignObj(this.formObj, obj);
      }
      $("#j_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });


    //添加修改图片信息弹窗数据
    this.$root.$on("openAddImgModal", (types, objs) => {
      if (types == 1) {
        this.imgType2 = false;
        this.imgType1 = true;
      } else if (types == 2) {
        this.imgType1 = false;
        this.imgType2 = true;
      }
      this.clearErrmsg();
      this.initAdvImgformObj();
      this.isAddvimg = $.isEmptyObject(objs);
      if (!this.isAddvimg) {
        this.advimgId = objs.id;
        this.advImgformObj = base.assignObj(this.advImgformObj, objs);
      }
      $("#j_addImgModa").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });

    //添加修改活动配置信息弹窗数据
    this.$root.$on("openActivityConfigModal", objk => {
      this.clearErrmsg();
      this.initActivityConfigformObj();
      //   this.activityConfigList = [];
      this.isAddActivityConfig = $.isEmptyObject(objk);
      if (!this.isAddActivityConfig) {
        this.activityConfigId = objk.id;
        this.activityConfigformObj = base.assignObj(this.activityConfigformObj, objk);
        this.activityConfigformObj.minAmount = objk.minAmount / 100;
        this.activityConfigformObj.maxAmount = objk.maxAmount / 100;
      }
      $("#j_addRedPacketActivityConfigModa").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });



  },
  updated: function () {

  },

  mounted: function () {
    this.initTimePicker();//挂载时间插件
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_editForm");
    this.editForm.validate({
      rules: {

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
  margin-right: 10px;
}

.delete {
  position: absolute;
  display: block;
  text-align: center;
  border-radius: 50%;
  left: 0;
  right: 0;
  bottom: 0;
}

.range {
  display: flex;
  align-items: center;
}

#templ {
  display: flex;
  justify-content: center;
}
#map {
  width: 500px;
  height: 300px;
  margin-left: 140px;
}
</style>