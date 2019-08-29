<template>
    <div class="row">
        <div class="col-md-2">
            <div class="portlet light bordered">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="icon-social-dribbble font-green-sharp"></i>
                        <span class="caption-subject font-green-sharp bold uppercase">权限菜单树</span>
                    </div>
                </div>
                <div class="portlet-body">       
                    <div v-if="permissionsList.length > 0" class="jstree jstree-default">
                        <permissions-tree :treeDataList="permissionsList" :selectId="selectId" @emitSelectNode="onSelectNode"></permissions-tree>
                    </div>  
                    <div v-if="permissionsList.length <= 0" class="alert alert-success no-margin margin-top-10">
                        <span>暂无数据</span>
                    </div>    
                </div>
            </div>
        </div>

        <div class="col-md-10">
            <div class="portlet light bordered">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="icon-settings font-green-sharp"></i>
                        <span class="caption-subject font-green-sharp bold uppercase">当前选中的树节点：</span>  
                        <span class="caption-subject font-red bold uppercase">{{selectName != '' ? selectName : '无'}}</span>    
                        <button v-show="selectName != ''" @click="onClearSelectNode($event)" type="button" class="close ml5"></button>
                    </div>
                </div>
                <div class="portlet-body">
                    <div class="table-toolbar">
                        <a v-show="checkPermissions(['addPermissions'])" @click="onAddEditModal($event)" href="javascript:void(0);" class="btn green-meadow">新建权限菜单 <i class="fa fa-plus"></i></a>
                        <span class="input-inline">
                            <input type="search" class="form-control input-inline w300" placeholder="可搜索权限名称" v-model="searchParams.keyword">
                        </span>
                        <span class="input-inline ml10">
                            <select class="form-control input-inline" v-model="searchParams.dataStatus" @change="onSearchList($event)">
                                <option value="">全部状态</option>
                                <option v-for="item in $root.dataStatusList" :value="item.id">{{item.desc}}</option>
                             </select>
                        </span>
                        <button type="submit" class="btn blue ml5" @click="onSearchList($event)"><i class="fa fa-search"></i>搜索</button>
                    </div>

                    <div v-if="dataList.length > 0" class="table-scrollable">
                        <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>权限名称</th>
                                <th>类型</th>
                                <th>鉴权CODE</th>
                                <th>URL路径</th>
                                <th>排序编号</th>                                
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>更新时间</th>                                
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="obj in dataList">
                                <td>{{obj.pid}}</td>
                                <td>
                                     <a @click="onClickPname($event, obj.pid, obj.pname)">{{obj.pname}}</a>
                                </td>
                                <td>
                                    <span class="btn btn-xs" :class="obj.ptype==1 ? 'purple' : obj.ptype==2 ? 'blue' : 'green' ">
                                        {{obj.ptype==1 ? "目录" : obj.ptype==2 ? "菜单" : obj.ptype==3 ? "按钮" : ""}}
                                    </span>    
                                </td>
                                <td>{{obj.pcode}}</td>
                                <td>{{obj.url}}</td>
                                <td>{{obj.sort}}</td>
                                <td>
                                    <span class="btn btn-xs" :class="obj.dataStatus==0 ? 'green' : 'red' ">{{$root.dataStatusMap[obj.dataStatus]}}</span>
                                </td>
                                <td>{{obj.createTime}}</td>
                                <td>{{obj.updateTime}}</td>
                                <td>
                                    <a v-show="checkPermissions(['updatePermissions'])" target="_blank" @click="onAddEditModal($event, obj)" class="btn blue btn-xs">编辑</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-if="dataList.length <= 0" class="alert alert-success no-margin margin-top-10">
                        <span>暂无数据</span>
                    </div>                        
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import basicData from 'common/js/basicData.js';
    import PermissionsTree from "./PermissionsTree.vue";

    export default {
        components:{
            PermissionsTree,
        },
        data: function() {
            return {
                selectId: 0,                // 树状数据中选中的节点ID
                selectName: '',             // 树状数据中选中的节点Name
                dataList: [],               // 列表数据
                searchParams: {             // 搜索参数
                    parent: 0,            
                    dataStatus: '',         
                    keyword: '',            
                },
            };
        },
        computed: {
            permissionsList: function() {
                return this.$root.permissionsList;
            },
        },
        methods: {
            // 根据父ID获取列表数据
            getDataList: function(){
                var self = this;
                $.ajax({
                    url: '/api/rbac/getPermissionsByParent',
                    type: "POST",
                    async: false, 
                    data: self.searchParams,
                    showServermsg: true
                }).done(function(resp) {
                    if (resp.code == '0000') {
                        self.dataList = resp.data;
                    } 
                });
            },
            // 搜索权限列表
            onSearchList: function(event) {
                event.preventDefault();
                this.getDataList();
            },
            // 列表点击名称会进入子级列表并且树形跟着展开
            onClickPname(event,id,name){
                event.preventDefault();
                this.onSelectNode(id,name);
            },
            // 选中树节点会触发的事件
            onSelectNode(id, name) {
                this.selectName = name;
                this.selectId = id;
                this.searchParams.parent = id;
                this.getDataList();
            },
            // 点击列表上方清除选中节点X按钮会触发的事件
            onClearSelectNode(event) {
                event.preventDefault();
                this.selectName = '';
                this.selectId = 0;
                this.searchParams.parent = 0;
                this.getDataList();
            },

            // 弹出添加|编辑表单Modal
            onAddEditModal(event, obj) {
                event.preventDefault();
                this.$root.$emit('onAddEditModal', obj == null ? {} : obj, obj == null ? this.selectId : null);
            },
        },
        mounted: function(){
            this.getDataList();
        }
    }
</script>

