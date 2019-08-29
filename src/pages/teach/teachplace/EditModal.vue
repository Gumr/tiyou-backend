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
                <label class="col-md-3 control-label text-center"><span class="required">*</span>教学点名称：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="请输入教学点名称" name="teachPlaceName" v-model="formObj.teachPlaceName" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center">排序：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="值越小权重越高" v-model="formObj.sort" />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center"><span class="required">*</span>教学点类型：</label>
                <div class="col-md-6">
                  <select class="form-control input" v-model="formObj.teachPlaceType" name="teachPlaceType">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in $root.teachPlaceTypeSelect" :value="item.teachPlaceTypeId">{{item.teachPlaceName}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center"><span class="required">*</span>所属商户：</label>
                <div class="col-md-6">
                  <select class="form-control" v-model="formObj.merchantId" name="merchantId">
                    <option selected="selected" value>请选择</option>
                    <option v-for="item in $root.merchantSelect" :value="item.merchantId">{{item.merchantName}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group flex_content">
                <label class="control-label lable_title_name" style="margin:0 30px;"><span class="required">*</span>所属地区：</label>
                <div class="">
                  <select class="form-control input" v-model="formObj.provinceCode" @change="getProvinceSelect($event)" name="provinceCode">
                    <option value=''>省</option>
                    <option v-for="item in provinceList" :value="item.provinceCode">{{item.provinceName}}</option>
                  </select>
                </div>
                <div class="">
                  <select class="form-control input" @change="getCitySelect($event)" v-model="formObj.cityCode" name="cityCode">
                    <option value=''>市</option>
                    <option v-for="item in cityList" :value="item.cityCode">{{item.cityName}}</option>
                  </select>
                </div>
                <div class="">
                  <select class="form-control input" @change="getDistrictName($event)" v-model="formObj.districtCode" name="districtCode">
                    <option value=''>区</option>
                    <option v-for="item in districtList" :value="item.districtCode">{{item.districtName}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center"><span class="required">*</span>详细地址：</label>
                <div class="col-md-6">
                  <input type="text" class="form-control" autocomplete="off" placeholder="输入详细地址，点击搜索地址按钮" name="detailAddress" v-model="formObj.detailAddress" />
                </div>
                <!-- <div class="col-md-3"> -->
                  <button type="button" class="btn green" @click="searchAddressDet($event)">搜索地址</button>
                <!-- </div> -->
              </div>
            </div>
          </div>
          <!-- 地图 -->
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-md-3 control-label text-center">地图展示区：</label>
                <div class="col-md-6">
                  <div class="left" id="map"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label"><span class="required">*</span>教学点封面图：</label>
              <div class="col-md-8">
                <div class="input-group">
                  <input autocomplete="off" type="text" class="form-control" placeholder="图片URL" name="coverImg" v-model="formObj.coverImg" readonly>
                  <span class="input-group-btn">
                    <span class="btn btn-success fileinput-button">
                      <span><i class="fa fa-cloud-upload"></i>选择文件</span>
                      <file-upload :config="uploadFileConfig('coverImg')">
                        <input slot="inputFile" type="file" name="file" style="display: block;">
                      </file-upload>
                    </span>
                  </span>
                </div>
                <div class="text-success mt10">提示：图片文件不能大于2M，后缀类型为(.gif,jpeg,jpg,png)</div>
                <div class="mt10">
                  <a class="ib" v-show="formObj.coverImg" :href="formObj.coverImg" target="_blank">
                    <img v-show="formObj.coverImg" :src="formObj.coverImg" style="width:150px;height:80px;padding-top:5px;">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label"><span class="required">*</span>教学点轮播图：</label>
              <div class="col-md-8">
                <div class="input-group">
                  <input autocomplete="off" type="text" class="form-control" placeholder="图片URL" name="bannerImg" v-model="formObj.bannerImg" readonly>
                  <span class="input-group-btn">
                    <span class="btn btn-success fileinput-button">
                      <span><i class="fa fa-cloud-upload"></i>选择文件</span>
                      <file-upload :config="uploadBannerFileConfig('bannerImg')">
                        <input slot="inputFile" type="file" name="file" multiple style="display: block;">
                      </file-upload>
                    </span>
                  </span>
                </div>
                <div class="text-success mt10">提示：图片文件不能大于2M，后缀类型为(.gif,jpeg,jpg,png)</div>
                <div class="banner">
                  <div class="mt10 box" v-for="(item,index) in formObj.bannerImg" :key="index">
                    <a class="ib" :href="item" target="_blank">
                      <img :src="item" style="width:150px;height:80px;padding-top:5px;">
                    </a>
                    <i class="fa fa-remove delete" @click="remove($event,index)"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label text-center"><span class="required">*</span>联系电话：</label>
              <div class="col-md-8">
                <input type="text" class="form-control" autocomplete="off" placeholder="输入电话号码" name="contactPhone" v-model="formObj.contactPhone" />
              </div>
            </div>
          </div>
        </div>
        <!-- 备注 -->
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-md-3 control-label">备注：</label>
              <div class="col-md-8">
                <textarea type="text" class="form-control" autocomplete="off" placeholder="请输入备注" v-model="formObj.remark" />
                </div>
            </div>
          </div>
        </div>
        <!-- <h4 class="form-section font-green">标签信息</h4> -->
        <h4 class="form-section font-green">教学点详情</h4>
        <div class="row">
          <div class="form-group">
            <div class="col-md-12 row_margin">
              <!-- <script id="templ" name="content" type="text/plain"> -->
              <vue-ueditor-wrap ref="ueditor" @ready="ready" v-model="formObj.detail"  :config="UeditorConfig"></vue-ueditor-wrap>
              </script>
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
import basicData from 'common/js/basicData.js'
import VueUeditorWrap from 'vue-ueditor-wrap'

var map, marker;
var markers = []; //定义标注数组
var placeSearch;
export default {
  components: {
    FileUpload,
    VueUeditorWrap
  },
  data: function () {
    return {
      provinceList: [], //省
      ueID: null,
      teachPlaceId: Number,//教学点id
      cityList: [],//市
      districtList: [],//区
      searchAddress: '',//搜索地址拼接
      editForm: null, // 表单对象
      isAdd: false, // 是否是新增
      formObj: {}, // 表单对象
      UeditorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 300,
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
        teachPlaceName: "", // 教学点名称
        teachPlaceType: "", // 教学点类型
        coverImg: "", // 封面图片
        bannerImg: [], // 轮播图
        contactName: "", //联系人姓名
        merchantId: "", //所属商户
        contactPhone: "", //联系电话
        detail: "", //详情
        remark: "",//备注
        longitude: "", //经度
        latitude: "", //维度
        provinceCode: "", //省Code
        provinceName: "", //省名字
        cityCode: "", //市Code
        districtCode: "", //县级Code
        cityName: "", //市名字
        districtName: "", //县级名字
        detailAddress: "", //详细地址
        sort: "", //排序
      };

    },
    // 提交表单
    onSubmit: function (event) {
      event.preventDefault();
      var self = this;
      //   self.formObj.detail = this.ueID.getContent();
      if (!self.isAdd) {
        self.formObj.teachPlaceId = this.teachPlaceId;
      }
    //   if (self.editForm.valid()) {
        $.ajax({
          url: self.isAdd
            ? "/api/teachPlace/addTeachPlace"
            : "/api/teachPlace/updateTeachPlace",
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
          maxFileSize: 1024 * 1024 * 2, //文件大小限制2M: 单位B, 0为不限制
          messages: {//文件错误信息
            acceptFileTypes: '文件类型不匹配',
            maxFileSize: '文件过大',
          },
          onUploadDone: function (resp, $input) {
            if (resp.code == "0000") {
              if ((self.formObj.bannerImg.length) + 1 > 6) {
                bootbox.alert('最多支持上传6张图片,请重新选择!');
                return
              } else {
                toastr.success(resp.msg);
                self.formObj[imgParamName].push(resp.data);
              }
            } else {
              toastr.error(resp.msg);
            }
          }
        }
      };
    },
    //删除图片
    remove(event, index) {
      this.formObj.bannerImg.splice(index, 1);
    },
    //初始化地图
    init() {
      map = new AMap.Map("map", {
        resizeEnable: true,
        zoom: 11,
        center: [116.397428, 39.90923]
      });
      placeSearch = new AMap.PlaceSearch(); //构造地点查询类
    },
    //搜索具体地址，在高德地图地位获取经纬度
    searchAddressDet(event) {
      event.preventDefault();
      let that = this;
      let provinceName = that.formObj.provinceName;
      let cityName = that.formObj.cityName;
      let districtName = that.formObj.districtName;
      let detailAddress = that.formObj.detailAddress;
      let address = provinceName + cityName + districtName + detailAddress;
      that.searchAddress = address;
      that.doSearch();

    },
    //高德地图地点标记
    doSearch() {
      map.remove(markers); //查询前先移除所有标注
      let that = this;
      let address = that.searchAddress;
      //   console.log(address,'address')
      placeSearch.search(address, function (status, result) {
        // console.log(result);
        if (status === "complete" && result.info === "OK") {
          //               alert(JSON.stringify(result));
          let poiArr = result.poiList.pois;
          that.formObj.longitude = poiArr[0].location.lng;
          that.formObj.latitude = poiArr[0].location.lat;
          //在地图上创建标注点
          marker = new AMap.Marker({
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"
          });
          marker.setPosition(
            new AMap.LngLat(poiArr[0].location.lng, poiArr[0].location.lat)
          );
          marker.setMap(map);
          marker.content = poiArr[0].name + "<br/>" + poiArr[0].address;
          markers.push(marker);
          $("#s-point").text(
            poiArr[0].location.lng + "," + poiArr[0].location.lat
          );
          //设置地图显示级别及中心点
          map.setZoomAndCenter(
            14,
            new AMap.LngLat(poiArr[0].location.lng, poiArr[0].location.lat)
          );
        }
      });
    },

    // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
    ready (editorInstance) {
    //   console.log(`实例${editorInstance.key}已经初始化:`, editorInstance)
      editorInstance.addListener("beforefullscreenchange", function (
        event,
        isFullScreen
      ) {
        base.ueFullScreenHandler(event, isFullScreen);
      });
    },
    // 富文本内容
    // initUeditor() {
    //   this.ueID = UE.getEditor("templ", {
    //     serverUrl: "/api/ueditor/ueditorConfig",
    //     initialFrameHeight: 300,
    //     initialFrameWidth: 1000
    //   });
    //   this.ueID.addListener("beforefullscreenchange", function (
    //     event,
    //     isFullScreen
    //   ) {
    //     base.ueFullScreenHandler(event, isFullScreen);
    //   });

    //   var that = this;
    //   this.ueID.ready(() => {
    //     that.ueID.setContent(that.formObj.detail ? that.formObj.detail : "");
    //   });
    // },
    //获取市
    getProvinceSelect(event) {
    //   this.cityList = [];
    //   this.districtList = [];
      if (!this.isAdd) {

      } else {
        this.formObj.provinceName = event.target.options[event.target.selectedIndex].text
      }
      let cityData = basicData.getCitySelect(event.target.value)
      this.cityList = cityData;
    },
    //获取区
    getCitySelect(event) {
    //   this.districtList = [];

      if (!this.isAdd) {

      } else {
        this.formObj.cityName = event.target.options[event.target.selectedIndex].text
      }
      let districtData = basicData.getDistrictSelect(event.target.value)
      this.districtList = districtData;
    },
    //获取区名称
    getDistrictName(event) {
      this.formObj.districtName = event.target.options[event.target.selectedIndex].text
    },



  },

  created: function () {
    let that = this;
    that.provinceList = [];
    that.cityList = [];
    that.districtList = [];
    let getProvinceSelect = basicData.getProvinceSelect();
    that.provinceList = getProvinceSelect;

    that.$root.$on("openAddEditModal", obj => {
      that.clearErrmsg();
      that.initFormObj();
      that.init();
      that.doSearch();
      that.isAdd = $.isEmptyObject(obj);
      if (!that.isAdd) {
        that.formObj = base.assignObj(this.formObj, obj);
        that.teachPlaceId = obj.teachPlaceId;
        // this.ueID.ready(() => {
        //   setTimeout(() => {
        //     that.ueID.setContent(obj.detail ? obj.detail : "");
        //   }, 500)
        // });
        that.searchAddressDet(event);
        let getProvinceSelect = basicData.getProvinceSelect();
        that.provinceList = getProvinceSelect;
        that.cityList = basicData.getCitySelect(obj.provinceCode);  //编辑回显的时候应该传对应的省code，市code
        that.districtList = basicData.getDistrictSelect(obj.cityCode);//编辑回显的时候应该传对应的省code，市code
      }
      $("#j_modal").modal({ backdrop: 'static', keyboard: false });//Bootstrap 模态框（Modal）点击空白区域禁止关闭
    });
    // that.initUeditor();
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $("#j_editForm");
    this.editForm.validate({
      rules: {
        teachPlaceName: {
          required: true
        },
        teachPlaceType: {
          required: true
        },
        merchantId: {
          required: true
        },
        provinceCode: {
          required: true
        },
        cityCode: {
          required: true
        },
        districtCode: {
          required: true
        },
        detailAddress: {
          required: true
        },
        coverImg: {
          required: true
        },
        bannerImg: {
          required: true
        },
        contactPhone: {
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
#map {
  width: 700px;
  height: 300px;
}
</style>