<template>
    <div class="row">
        <div class="col-md-12">
            <div class="portlet light bordered">
                <div class="portlet-body">
                    <div class="table-toolbar">
                        <form action="#" class="form-horizontal">
                            <div class="row ">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="control-label col-md-2">日期:</label>
                                        <div class="input-group input-large input-daterange col-md-10">
                                            <input type="text" class="form-control" v-model="searchParam.startTime" >
                                            <span class="input-group-addon"> to </span>
                                            <input type="text" class="form-control" v-model="searchParam.endTime"> 
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="control-label col-md-4">状态:</label>
                                        <div class="col-md-8">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">全部</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="control-label col-md-4">三个字:</label>
                                        <div class="col-md-8">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">全部</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row ">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="control-label col-md-2">地区:</label>
                                        <div class="col-md-3">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">请选择省</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">请选择市</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">请选择区</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="control-label col-md-4">数据状态:</label>
                                        <div class="col-md-8">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">全部</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label class="control-label col-md-4">数据状态:</label>
                                        <div class="col-md-8">
                                            <select class="form-control" v-model="searchParam.status" @change="onSearch($event)">
                                                <option value="">全部</option>
                                                <option value="1">正常</option>
                                                <option value="2">禁用</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="btn-group-devided">
                                        <button type="button" class="btn default" @click="clearSearch($event)"><i class="fa fa-remove"></i> 清空条件</button>
                                        <button type="button" class="btn blue" @click="onSearch($event)"><i class="fa fa-search"></i> 点击搜索</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <a v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event)" href="javascript:;" class="btn green-meadow"><i class="fa fa-plus-square"></i> 新增数据</a>
                    <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event)" type="button" class="btn blue-madison"><i class="fa fa-arrow-circle-o-up"></i> 批量启用</button>
                    <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event)" type="button" class="btn grey-cascade"><i class="fa fa-arrow-circle-o-down"></i> 批量禁用</button>
                    <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event)" type="button" class="btn red-sunglo"><i class="fa fa-remove"></i> 批量删除</button>
                    <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event)" type="button" class="btn purple-plum"><i class="fa fa-download"></i> 导出EXECL</button>
                    <div class="table-scrollable" v-if="dataList.length > 0">
                        <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable no-footer" style="word-break:break-all">
                            <thead>
                                <tr>
                                    <th>
                                        <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                            <input type="checkbox" class="group-checkable" value="true" v-model="checkAll" @click="doCheckAll">
                                            <span></span>
                                        </label>
                                    </th>
                                    <th>部门ID</th>
                                    <th>部门名称</th>
                                    <th>进度状态</th>
                                    <th>描述信息</th>
                                    <th>数据状态</th>
                                    <th>创建时间</th>
                                    <th>更新时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(obj,idx) in dataList">
                                    <td>
                                        <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                            <input type="checkbox" class="checkboxes" :value="obj.did" v-model="checkboxIds">
                                            <span></span>
                                        </label>
                                    </td>
                                    <td>{{obj.did}}</td>
                                    <td>{{obj.dname}}</td>
                                    <td>
                                        <span class="btn btn-xs btn-outline green">成功</span>
                                        <span class="btn btn-xs btn-outline red">失败</span>
                                        <span class="btn btn-xs btn-outline blue">处理中</span>
                                        <span class="btn btn-xs btn-outline yellow">警告</span>
                                        <span class="btn btn-xs btn-outline dark">关闭</span>
                                    </td>
                                    <td>{{obj.description}}</td>
                                    <td>
                                        <span class="btn btn-xs default green-stripe">正常</span>
                                        <span class="btn btn-xs default red-stripe">禁用</span>
                                    </td>
                                    <td>{{obj.createTime}}</td>
                                    <td>{{obj.updateTime}}</td>
                                    <td>
                                        <a v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event,obj)" class="btn btn-xs purple" href="javascript:;"><i class="fa fa-eye"></i> 查看</a>
                                        <a v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event,obj)" class="btn btn-xs green" href="javascript:;"><i class="fa fa-edit"></i> 编辑</a>
                                        <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event,obj)" type="button" class="btn btn-xs blue"><i class="fa fa-arrow-circle-o-up"></i> 启用</button>
                                        <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event,obj)" type="button" class="btn btn-xs grey-cascade"><i class="fa fa-arrow-circle-o-down"></i> 禁用</button>
                                        <button v-show="checkPermissions(['xxxxx'])" @click="onAddEditForm($event,obj)" type="button" class="btn btn-xs red"><i class="fa fa-remove"></i> 删除</button>
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

    data: function () {
        return {
            checkAll:false,              // 是否全选   
            checkboxIds: [],             // 复选框ID集
            searchParam: {},             // 搜索参数
            dataList: [],                // 列表数据
        }
    },

    methods: {
        // 初始化搜索参数
        initSearchParam: function () {
            this.searchParam = {
                status: '',
                keyword: '',
                startTime: '',
                endTime: '',
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
        },

        //全选/取消全选
        doCheckAll: function () {
            let self = this;
            self.checkboxIds = [];
            if(self.checkAll){
                self.checkAll = false;  //取消全选标记
            }else{
                $.each(self.dataList, (idx, obj) => {
                    self.checkboxIds.push(obj.did);
                });
                self.checkAll = true;   //全选标记
            }
        },

        // 打开添加与编辑表单的Modal弹窗
        onAddEditForm: function (event, obj) {
            event.preventDefault();
            this.$root.$emit('openAddEditModal', obj == null ? {} : obj);
        },
    },

    computed: {
        pagerConfig: function () {
            return {
                url: '/api/rbac/getDepartmentByPage',
                getParams: this.getParams,
                onPageLoad: this.onPageLoad,
                pageSize: 15
            }
        }
    },

    created: function () {
        this.initSearchParam();
    },

    mounted: function() {
        
    }
}
</script>