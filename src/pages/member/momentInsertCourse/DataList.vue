<template>
  <div class="row">
    <div class="col-md-12">
      <div class="portlet light bordered">
        <div class="portlet-body">
          <div class="table-toolbar">
            <form action="#" class="form-horizontal">
              <div class="row ">
                <!-- 用户手机 -->
                <div class="form-group col-md-12">
                  <label class="control-label col-md-4">用户手机:</label>
                  <div class="col-md-3">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入手机号" v-model="searchParam.nickName" >
                  </div>
                </div>
              </div>
              <div class="row ">
                <!-- 课程套餐 -->
                <div class="form-group col-md-12">
                  <label class="control-label col-md-4">课程套餐:</label>
                  <div class="col-md-3">
                    <select class="form-control" v-model="searchParam.status" >
                      <option selected="selected" value>请选择</option>
                      <option v-for="item in $root.userStatus" :value="item.id">{{item.desc}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <!-- 上课学生数量 -->
                <div class="form-group col-md-12" >
                  <label class="control-label col-md-4">上课学生数量:</label>
                  <div class="col-md-3">
                    <input type="text" class="form-control" autocomplete="off" placeholder="请输入上课学生数量" v-model="searchParam.nickName" >
                  </div>
                </div>
              </div>
              <div class="form-actions">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-offset-10 col-md-9">
                                    <button type="button" class="btn green" @click="onAddEditForm($event,searchParam)">保存</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
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
        status: '',
        nickName: ''
      };
    },

   

    // 打开添加与编辑表单的Modal弹窗
    onAddEditForm: function (event, obj) {
      event.preventDefault();
      this.$root.$emit('openAddEditModal', obj == null ? {} : obj);
    },
    
  },

  computed: {
    
  },

  created: function () {
    this.initSearchParam();
  },
}
</script>