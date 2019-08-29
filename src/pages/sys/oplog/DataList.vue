<template>
    <div class="row">
        <div class="col-md-12">
                <div class="portlet light ">
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
                        
                        <div v-if="dataList.length > 0" class="table-scrollable">
                            <table class="table table-striped table-bordered table-hover table-checkable order-column dataTable">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>操作日期</th>
                                        <th>操作人</th>
                                        <th>操作内容</th>
                                        <th>客户端地址</th>
                                        <th>请求数据</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="obj in dataList">
                                        <td>{{obj.id}}</td>
                                        <td>{{obj.createTime}}</td>
                                        <td>{{obj.operator}}</td>
                                        <td>{{obj.content}}</td>
                                        <td>{{obj.remoteAddr}}</td>
                                        <td>{{obj.reqData}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="dataList.length <= 0" class="alert alert-success no-margin margin-top-10">
                            <span>暂无数据</span>
                        </div>
                    </div>
                </div>
                <pager ref="pager" :config="pagerConfig"></pager>
        </div>
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
        },
        
        computed: {
            // 分页配置
            pagerConfig: function() {
                return {
                    url: '/api/rbac/getOperationLogByPage',
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

