<template>
    <div id="j_modal" class="portlet light bordered modal fade" tabindex="-1" data-width="800">
        <div class="portlet-title">
            <div class="caption">
                <i class="icon-equalizer font-red-sunglo"></i>
                <span class="caption-subject font-red-sunglo bold uppercase">新增|编辑部门</span>
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
                                <label class="col-md-3 control-label"><span class="required">*</span>部门名称</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" autocomplete="off" placeholder="部门名称" name="dname" v-model="formObj.dname" />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-11">
                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="required">*</span>部门状态</label>
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
                                <label class="col-md-3 control-label">描述信息</label>
                                <div class="col-md-9">
                                    <textarea class="form-control" rows="3" placeholder="描述信息" v-model="formObj.description"></textarea>
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

    export default {
        data: function() {
            return {
                editForm: null,         // 表单对象
                isAdd: false,           // 是否是新增
                formObj: {},            // 表单对象   
            };
        },

        methods: {
            // 初始化表单参数
            initFormObj: function() {
                this.formObj = {
                    did: '',            // 部门ID                    
                    dname: '',          // 部门名称
                    description: '',         // 描述信息
                    dataStatus:'',      // 数据状态
                };
            },
            // 提交表单
            onSubmit: function(event) {
                event.preventDefault();
                var self = this;
                if (self.editForm.valid()) {
                    $.ajax({
                        url: self.isAdd ? '/api/rbac/addDepartment' : '/api/rbac/updateDepartment',
                        type: 'POST',
                        data: self.formObj
                    }).done(resp => {
                        if(resp.code == '0000'){
                            window.location.reload(true);
                        }
                    });
                }
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

                $('#j_modal').modal({backdrop: 'static', keyboard: false});//Bootstrap 模态框（Modal）点击空白区域禁止关闭
            });
        },

        mounted: function() {
            // 初始化表单对象和表单参数校验规则
            this.editForm = $('#j_editForm');
            this.editForm.validate({
                rules:{
                    dname: {
                        required: true
                    },
                    dataStatus: {
                        required: true
                    }
                }
            });
        }
    }
</script>