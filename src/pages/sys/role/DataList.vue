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
                                        <label class="control-label col-md-3">关键字:</label>
                                        <div class="col-md-9">
                                            <input type="text" class="form-control" placeholder="请输入名称关键字" v-model="searchParam.keyword">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label class="control-label col-md-5">角色状态:</label>
                                        <div class="col-md-7">
                                            <select class="form-control" v-model="searchParam.dataStatus" @change="onSearch($event)">
                                                <option value="">全部</option>
                                                <option v-for="item in $root.dataStatusList" :key="item.id"  :value="item.id">{{item.desc}}</option>
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
                    
                    <a v-show="checkPermissions(['addRole'])" @click="onAddEditForm($event)" class="btn green-meadow" href="javascript:;"><i class="fa fa-plus-square"></i> 新增</a>
                    <div class="table-scrollable" v-if="dataList.length > 0" >
                        <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>角色名称</th>
                                    <th>描述信息</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>更新时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="obj in dataList" :key="obj.roleId">
                                    <td>{{obj.roleId}}</td>
                                    <td>{{obj.roleName}}</td>
                                    <td>{{obj.description}}</td>
                                    <td>
                                        <span class="btn btn-xs" :class="obj.dataStatus == 0 ? 'green' : 'red' ">{{$root.dataStatusMap[obj.dataStatus]}}</span>
                                    </td>
                                    <td>{{obj.createTime}}</td>
                                    <td>{{obj.updateTime}}</td>
                                    <td>
                                        <a v-show="checkPermissions(['updateRole'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;"><i class="fa fa-edit"></i> 编辑</a>
                                        <a v-show="checkPermissions(['updateRolePermissions'])" @click="onEditPermissionForm($event, obj)" class="btn blue btn-xs" href="javascript:;">角色授权</a>
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

            // 打开编辑权限表单的Modal弹窗
            onEditPermissionForm: function(event,obj) {
                event.preventDefault();
                this.$root.$emit('openPermissionModal', obj == null ? {} : obj);
            },  
        },

        computed: {
            pagerConfig: function() {
                return {
                    url: '/api/rbac/getRoleByPage',
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