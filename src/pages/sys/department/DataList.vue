<template>
    <div class="row">
        <div class="col-md-12">
            <div class="portlet light bordered">
                <div class="portlet-body">
                    <div class="table-toolbar">
                        <form action="#" class="form-horizontal">
                            <div class="row ">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="control-label col-md-3">搜索名称:</label>
                                        <div class="col-md-9">
                                            <input type="text" class="form-control" placeholder="请输入名称关键字" v-model="searchParam.keyword">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label class="control-label col-md-5">部门状态:</label>
                                        <div class="col-md-7">
                                            <select class="form-control" v-model="searchParam.dataStatus" @change="onSearch($event)">
                                                <option value="">全部</option>
                                                <option v-for="item in $root.dataStatusList" :value="item.id">{{item.desc}}</option>
                                            </select>
                                        </div>
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
                    
                    <a v-show="checkPermissions(['addDepartment'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;"><i class="fa fa-plus-square"></i> 新增</a>
                    <div class="table-scrollable" v-if="dataList.length > 0" >
                        <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>部门名称</th>
                                    <th>描述信息</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>更新时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(obj,idx) in dataList">
                                    <td>{{obj.did}}</td>
                                    <td>{{obj.dname}}</td>
                                    <td>{{obj.description}}</td>
                                    <td>
                                        <span class="btn btn-xs" :class="obj.dataStatus == 0 ? 'green' : 'red'">{{$root.dataStatusMap[obj.dataStatus]}}</span>
                                    </td>
                                    <td>{{obj.createTime}}</td>
                                    <td>{{obj.updateTime}}</td>
                                    <td>
                                        <a v-show="checkPermissions(['updateDepartment'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;"><i class="fa fa-edit"></i> 编辑</a>
                                    </td>
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

        data: function() {
            return {
                searchParam: {},             // 搜索参数
                dataList: [],                // 列表数据
           }
        },

        methods: {
            // 初始化搜索参数
            initSearchParam:function() {
                this.searchParam = {
                    keyword: '',
                    dataStatus: '',
                };
            },

            // 处理分页组件的两个函数
            getParams: function() {
                return this.searchParam;
            },
            onPageLoad: function(dataList) {
                this.dataList = dataList;
            },

            // 执行搜索
            onSearch: function(event) {
                event.preventDefault();
                this.$refs.pager.gotoPage(1, true);   //调用子组件的方法
            },

            // 清空搜索条件
            clearSearch: function(event){
                event.preventDefault();
                this.initSearchParam();
            },

            // 打开添加与编辑表单的Modal弹窗
            onAddEditForm: function(event,obj) {
                event.preventDefault();
                this.$root.$emit('openAddEditModal', obj == null ? {} : obj);
            },  
        },

        computed: {
            pagerConfig: function() {
                return {
                    url: '/api/rbac/getDepartmentByPage',
                    getParams: this.getParams,
                    onPageLoad: this.onPageLoad,
                    pageSize : 15
                }
            }
        },

        created: function() {
            this.initSearchParam();
        },
    }
</script>