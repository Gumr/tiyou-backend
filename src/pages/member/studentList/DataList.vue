<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row flex_group">
                <!-- 学生姓名 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">学生姓名:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入学生姓名" v-model="searchParam.studentName" @keyup.enter="onSearch($event)">
                  </div>
                </div>
                <!-- 家长姓名 -->
                <div class="form-group flex_content">
                  <label class="control-label lable_title_name">家长姓名:</label>
                  <div class="">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入家长姓名" v-model="searchParam.nickName" @keyup.enter="onSearch($event)">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <div class="col-md-offset-0 col-md-12">
                      <button type="button" class="btn default" @click="clearSearch($event)"><i class="fa fa-remove"></i> 清空</button>
                      <button type="button" class="btn blue" @click="onSearch($event)"><i class="fa fa-search"></i> 搜索</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="table-scrollable" v-if="dataList.length > 0">
            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
              <thead>
                <tr>
                  <th class="text-center">学生ID</th>
                  <th class="text-center">学生姓名</th>
                  <th class="text-center">性别</th>
                  <th class="text-center">生日</th>
                  <th class="text-center">家长姓名</th>
                  <th class="text-center">亲子关系</th>
                  <th class="text-center">创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj,idx) in dataList">
                  <td class="text-center">{{obj.studentId || '--'}}</td>
                  <td class="text-center">{{obj.studentName || '--'}}</td>
                  <td class="text-center">{{obj.sex ==1?'男':'女'}}</td>
                  <td class="text-center">{{obj.birthday?obj.birthday.substring(0,11):'--'}}</td>
                  <td class="text-center">
                    <span>{{obj.nickName || '--'}}</span>
                    <img v-show="obj.avatar" :src="obj.avatar" style="width:30px;height:30px;border-radius:50%;margin-left:6px;">
                  </td>
                  <td class="text-center">{{obj.relation || '--'}}</td>
                  <td class="text-center">{{obj.createTime || '--'}}</td>
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
import Pager from 'components/Pager.vue';

export default {
  components: {
    Pager
  },

  data: function () {
    return {
      searchParam: {},             // 搜索参数
      dataList: [],                // 列表数据
    }
  },

  methods: {
    // 初始化搜索参数
    initSearchParam: function () {
      this.searchParam = {
        studentName: '',//学生名字
        nickName: '',   //家长名字
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
      this.$refs.pager.gotoPage(1, true);   //调用子组件的方法
    },

    // 清空搜索条件
    clearSearch: function (event) {
      event.preventDefault();
      this.initSearchParam();
      this.onSearch(event);
    },



  },

  computed: {
    pagerConfig: function () {
      return {
        url: '/api/user/getStudentByPage',
        getParams: this.getParams,
        onPageLoad: this.onPageLoad,
        pageSize: 15
      }
    }
  },

  created: function () {
    this.initSearchParam();
  },
}
</script>