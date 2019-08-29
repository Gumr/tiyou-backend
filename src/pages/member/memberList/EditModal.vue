<template>
  <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="1200" >
    <div class="portlet-title">
      <div class="caption">
        <i class="icon-equalizer font-red-sunglo"></i>
        <span class="caption-subject font-red-sunglo bold uppercase">用户详情</span>
      </div>
      <div class="tools">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
      </div>
    </div>
    <div class="portlet-body form">
      <form action="" class="form-horizontal" id="j_editForm">
        <div class="form-body">
          <div class="row">
            <div class="col-md-4 user_Info" style="width:28%;">
              <div class="portlet light user_Info_shadow">
                <div class="portlet-body row">
                  <div class="col-md-12">
                    <div class="user_hederImg"><img alt="" class="headimg" :src="editForm.avatar"></div>
                    <div class="user_name">
                      {{editForm.nickName}}
                    </div>
                  </div>
                  <div class="col-md-12 user_type"><button type="button" class="btn btn-danger orange user_btn">
                      {{editForm.utype==0? '普通用户':'会员用户'}}
                    </button></div>
                  <div class="col-md-12" style="maging:0px;">
                    <div class="list-container">
                      <ul style="padding-left:8px;">
                        <li class="list-item">
                          <div class="list-title">
                            手机号码：
                          </div>
                          <div class="list-content">
                            {{editForm.phone?editForm.phone:'暂无'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title">
                            用户性别：
                          </div>
                          <div class="list-content">
                            {{editForm.sex ==1?'男':'女'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title">
                            所在省份：
                          </div>
                          <div class="list-content">
                            {{editForm.province?editForm.province:'暂无'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title">
                            所在城市：
                          </div>
                          <div class="list-content">
                            {{editForm.city?editForm.city:'暂无'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title">
                            注册时间：
                          </div>
                          <div class="list-content">
                            {{editForm.createTime?editForm.createTime:'暂无'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title">
                            会员来源：
                          </div>
                          <div class="list-content">
                            {{editForm.channelNo?editForm.channelNo:'暂无'}}
                          </div>
                        </li>
                        <li class="list-item" style="color:red;">
                          <div class="list-title done">
                            当前课时：
                          </div>
                          <div class="list-content">
                            {{editForm.lcoin?editForm.lcoin:'0'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title done">
                            已用课时：
                          </div>
                          <div class="list-content">
                            {{editForm.totalPayLcoin?editForm.totalPayLcoin:'0'}}
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title done">
                            可用体验卡：
                          </div>
                          <div class="list-content">
                            {{editForm.useExperienceCard?editForm.useExperienceCard:'0'}} 次
                          </div>
                        </li>
                        <li class="list-item">
                          <div class="list-title done">
                            可赠体验卡：
                          </div>
                          <div class="list-content">
                            {{editForm.giveExperienceCard?editForm.giveExperienceCard:'0'}} 次
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8" style="width:70%;padding:0;">
              <div class="tabbable">
                <ul class="nav nav-tabs ">
                  <li class="active"><a href="#tab_5_1" data-toggle="tab" aria-expanded="true" id="tabfirst"> 充值记录 </a></li>
                  <li class=""><a href="#tab_5_2" data-toggle="tab" aria-expanded="false"> 约课记录</a></li>
                  <li class=""><a href="#tab_5_3" data-toggle="tab" aria-expanded="false"> 课币流水</a></li>
                </ul>
                <div class="tab-content" style="padding:0 15px;">
                  <!-- 充值记录 -->
                  <div id="tab_5_1" class="tab-pane active tab_pane_first">
                    <div class="row">
                      <div class="table-scrollable table-responsive">
                        <table class="table table-hover  table-bordered">
                          <thead>
                            <tr>
                              <th class="text-center">用户ID</th>
                              <th class="text-center">订单编号</th>
                              <th class="text-center">购买商品</th>
                              <th class="text-center">消费金额</th>
                              <th class="text-center">状态</th>
                              <th class="text-center">订单来源</th>
                              <th class="text-center">下单时间</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(obj,idx) in userOrderList">
                              <td class="text-center">{{obj.userId || '--'}}</td>
                              <td class="text-center" style="width:150px;">{{obj.rechargeOrderId || '--'}}</td>
                              <td class="text-center">{{obj.rechargeGoodsName || '--'}}</td>
                              <td class="text-center">{{obj.realpayAmount/100 || '0'}}元</td>
                              <td class="text-center">{{$root.rechargeOrderStatusSelectMap[obj.rechargeOrderStatus] || '--'}}</td>
                              <td class="text-center">{{obj.channelNo || '--'}}</td>
                              <td class="text-center">{{obj.createTime || '--'}}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="list-empty" v-if="userOrderList.length <= 0">暂无数据</div>
                      </div>
                    </div>
                  </div>
                  <!--约课记录-->
                  <div id="tab_5_2" class="tab-pane tab_pane_first">
                    <div class="row">
                      <div class="table-scrollable table-responsive">
                        <table class="table table-hover  table-bordered">
                          <thead>
                            <tr>
                              <th class="text-center">预约时间</th>
                              <th class="text-center">上课时间</th>
                              <th class="text-center">课程地点</th>
                              <th class="text-center">课程名称</th>
                              <th class="text-center">上课宝宝</th>
                              <th class="text-center">支付类型</th>
                              <th class="text-center">预约状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(objs,idxs) in userCourseList">
                              <td class="text-center">{{objs.createTime || '--'}}</td>
                              <td class="text-center">{{objs.scheduleDate || '--'}} {{objs.classBeginTime || '--'}}</td>
                              <td class="text-center">{{objs.teachPlaceName || '--'}}</td>
                              <td class="text-center">{{objs.courseName || '--'}}</td>
                              <td class="text-center">{{objs.studentName || '--'}}</td>
                              <td class="text-center">{{objs.payType == 1? '课币':'体验卡'}}</td>
                              <td class="text-center">{{$root.reserveStatusMap[Number(objs.reserveStatus)] || '--'}}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="list-empty" v-if="userCourseList.length <= 0">暂无数据</div>
                      </div>
                    </div>
                  </div>
                  <!--课币流水-->
                  <div id="tab_5_3" class="tab-pane tab_pane_first">
                    <div class="row">
                      <div class="table-scrollable table-responsive">
                        <table class="table table-hover  table-bordered">
                          <thead>
                            <tr>
                              <th class="text-center">用户ID</th>
                              <th class="text-center">账户类型</th>
                              <th class="text-center">记录类型</th>
                              <th class="text-center">交易类型</th>
                              <th class="text-center">交易前数额</th>
                              <th class="text-center">本次交易额</th>
                              <th class="text-center">关联业务编号</th>
                              <th class="text-center">创建时间</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(objk,ides) in UserLcoinRecord">
                              <td class="text-center">{{objk.userId || '--'}}</td>
                              <td class="text-center">{{objk.atype ==1?'课币':'体验卡'}}</td>
                              <td class="text-center">{{objk.recordName || '--'}}</td>
                              <td class="text-center">
                                <span class="btn btn-xs" :class="objk.transType == 1 ? 'green' : 'red'">{{objk.transType ==1?'增加':'扣减'}}</span>
                              </td>
                              <td class="text-center">{{objk.beforeTransNum || '0'}}</td>
                              <td class="text-center">{{objk.transNum || '0'}}</td>
                              <td class="text-center">{{objk.businessNo || '--'}}</td>
                              <td class="text-center">{{objk.createTime || '--'}}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="list-empty" v-if="UserLcoinRecord.length <= 0">暂无数据</div>
                      </div>
                    </div> 
                  </div>
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
      userOrderList: [],    //充值记录
      userCourseList: [],    //约课记录
      UserLcoinRecord: [],   //课币流水
      isAdd: false,
    };
  },

  methods: {
    //获取充值记录
    getUserOrder: function (userId) {
      $.ajax({
        url: "/api/user/getUserRechargeRecord",
        type: "POST",
        data: { userId: userId },
      }).done(resp => {
        if (resp.code == "0000") {
          this.userOrderList = resp.data;
        }
      });
    },
    //获取约课记录
    getUserCourse: function (userId) {
      $.ajax({
        url: "/api/user/getUserReserveRecord",
        type: "POST",
        data: { userId: userId },
      }).done(resp => {
        if (resp.code == "0000") {
          this.userCourseList = resp.data;
        }
      });
    },
    //获取课币流水记录
    getUserLcoinRecord: function (userId) {
      $.ajax({
        url: "/api/user/getUserAccountRecordByPage",
        type: "POST",
        data: { userId: userId, pageNo: 1, pageSize: 2147483647 },
      }).done(resp => {
        if (resp.code == "0000") {
          this.UserLcoinRecord = resp.data.list;
        }
      });
    },
  },

  created: function () {
    this.$root.$on('openAddEditModal', obj => {
      this.editForm = obj
      this.isAdd = $.isEmptyObject(obj);
      if (!this.isAdd) {
        this.getUserOrder(obj.userId);
        this.getUserCourse(obj.userId);
        this.getUserLcoinRecord(obj.userId);
      }
      $('#j_modal').modal();
    });
  },

  mounted: function () {
    // 初始化表单对象和表单参数校验规则
    this.editForm = $('#j_editForm');
  }
}
</script>
<style >
li {
  list-style: none;
}
.user_Info {
  border-right: 1px dashed rgb(204, 204, 204);
}
.user_Info_shadow {
  box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.03);
}
.user_hederImg {
  text-align: center;
  border: 0px solid rgb(204, 204, 204);
}
.headimg {
  height: 100px;
  width: 100px;
  border-radius: 50% !important;
}
.user_name {
  text-align: center;
  padding: 3px;
  line-height: 30px;
}
.user_type {
  text-align: center;
  border: 0px solid rgb(204, 204, 204);
}
.user_btn {
  width: 100% !important;
}
.list-container .list-item {
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  margin: 3px 0;
  line-height: 28px;
}
.list-container .list-item {
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  margin: 3px 0;
  line-height: 28px;
}
.list-container .list-title {
  font-weight: 700;
}
.tab_pane_first {
  border-top: 0px solid rgb(204, 204, 204);
  min-height: 300px;
}
.table_data_none {
  height: 30px;
  padding: 5px;
  color: red;
  display: none;
}
.list-empty {
  line-height: 30px;
  padding: 10px;
  color: red;
  border-top: 1px solid #e7ecf1;
}
.list-item {
  display: flex;
}
.list-title {
  flex: 0.6;
  text-align: left;
}
.list-content {
  flex: 1;
}
</style>