<template>
    <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="800">
        <div class="portlet-title">
            <div class="caption">
                <i class="icon-equalizer font-red-sunglo"></i>
                <span class="caption-subject font-red-sunglo bold uppercase">新增|编辑账号</span>
            </div>
            <div class="tools">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            </div>
        </div>
        <div class="portlet-body form">
            <form action="" class="form-horizontal" id="j_editForm">
                <div class="form-body">
                    <div class="row">
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label">部门</label>
                                <div class="col-md-9">
                                    <select class="form-control input" v-model="formObj.did">
                                        <option value="">请选择部门</option>
                                        <option v-for="item in $root.departmentList" :value="item.did">{{item.dname}}</option>
                                    </select>
                                </div>
                            </div>   
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>登录账号</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" autocomplete="off" placeholder="登录账号" name="account" v-model="formObj.account" v-bind="{readonly: !isAdd}"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11" v-show="isAdd">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>登录密码</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" autocomplete="off" placeholder="登录密码" name="pwd" v-model="formObj.pwd" disabled="true"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>姓名</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" autocomplete="off" placeholder="姓名" name="ename" v-model="formObj.ename"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>手机</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" autocomplete="off" placeholder="手机号码" name="phone" v-model="formObj.phone"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label">邮箱</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" autocomplete="off" placeholder="邮箱地址" name="email" v-model="formObj.email"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>账号状态</label>
                                <div class="col-md-9">
                                    <select name="dataStatus" class="form-control input" v-model="formObj.dataStatus">
                                        <option value="">请选择状态</option>
                                        <option v-for="item in $root.dataStatusList" :value="item.id">{{item.desc}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>账号级别</label>
                                <div class="col-md-9">
                                    <div class="mt-radio-inline">
                                        <label class="mt-radio mt-radio-outline">
                                            <input type="radio" value="0" v-model="formObj.level"> 普通账号
                                            <span></span>
                                        </label>
                                        <label class="mt-radio mt-radio-outline">
                                            <input type="radio" value="100" v-model="formObj.level"> 管理员
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group" v-if="formObj.level == 0">
                                <label class="col-md-3 control-label">角色分配：</label>
                                <div class="col-md-9">
                                    <div class="mt-checkbox-inline">
                                        <label class="mt-checkbox mt-checkbox-outline" v-for="r in roleSelectList">
                                            <input type="checkbox" :value="r.roleId" v-model="formObj.roleIds"> {{r.roleName}}
                                            <span></span>
                                        </label>
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
    import base from 'common/js/utils/base.js';
    import basicData from 'common/js/basicData.js';    

    export default {
        data: function() {
            return {
                editForm: null,         // 表单对象
                isAdd: false,           // 是否是新增
                formObj: {},            // 表单对象
                roleSelectList: [],     // 角色选择列表   
            };
        },

        methods: {
            // 初始化表单参数
            initFormObj: function() {
                this.formObj = {
                    eid: '',            // 员工ID
                    did: '',            // 部门ID
                    roleIds: [],        // 角色ID集合
                    account: '',        // 账户名
                    pwd: '111111',      // 密码：默认111111
                    ename: '',          // 用户名
                    phone: '',          // 手机号码
                    email: '',          // 邮箱地址
                    level: 0,           // 账号级别
                    dataStatus: '',     // 数据状态    
                };
            },
            // 提交表单
            onSubmit: function(event) {
                event.preventDefault();
                var self = this;
                if (self.editForm.valid()) {
                    $.ajax({
                        url: self.isAdd ? '/api/rbac/addEmployee' : '/api/rbac/updateEmployee',
                        type: 'POST',
                        contentType: "application/json",
                        data: JSON.stringify(self.formObj)
                    }).done(resp => {
                        if(resp.code == '0000'){
                            window.location.reload(true);
                        }
                    });
                }
            },
            //获取角色选择数据
            getRoleSelect: function() {
                this.roleSelectList = basicData.getRoleSelect();
            },  
            // 清空错误提示
            clearErrmsg: function() {
                this.editForm.find('.has-error').closest('span').remove();
                this.editForm.find('.has-error').each(function () {
                    $(this).removeClass('has-error');
                });
            },
        },

        created: function() {
            this.$root.$on('openAddEditModal', obj => {
                this.clearErrmsg();
                this.initFormObj();
                this.isAdd = $.isEmptyObject(obj);
                if(!this.isAdd){
                    this.formObj = base.assignObj(this.formObj, obj);
                };
                this.getRoleSelect();

                $('#j_modal').modal({backdrop: 'static', keyboard: false});//Bootstrap 模态框（Modal）点击空白区域禁止关闭
            });
        },

        mounted: function() {
            // 初始化表单对象和表单参数校验规则
            this.editForm = $('#j_editForm');
            this.editForm.validate({
                rules:{                 
                    account: {
                        required: true
                    },
                    password: {
                        required: true,
                        password: true
                    },
                    ename: {
                        required: true
                    },
                    dataStatus: {
                        required: true
                    },
                    phone: {
                        required: true,
                        mobile: true
                    },
                    email: {
                        email: true
                    },
                }
            });
        }
    }
</script>