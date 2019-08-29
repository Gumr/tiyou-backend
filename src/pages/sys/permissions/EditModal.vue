<template>
    <form id="j_editForm" action="" class="modal fade form-horizontal" tabindex="-1" data-width="800">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title">新建|编辑权限</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="form-group">
                    <label class="col-md-3 control-label">父级权限：</label>
                    <div class="col-md-8">
                          <input autocomplete="off" type="text" class="form-control" placeholder="父级权限" name="parent" v-model="formObj.parent"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="required">*</span>权限类型：</label>
                    <div class="col-md-8">
                        <div class="mt-radio-inline">
                            <label class="mt-radio mt-radio-outline">
                                <input type="radio" value="1" v-model="formObj.ptype"> 目录
                                <span></span>
                            </label>
                            <label class="mt-radio mt-radio-outline">
                                <input type="radio" value="2" v-model="formObj.ptype"> 菜单
                                <span></span>
                            </label>
                            <label class="mt-radio mt-radio-outline">
                                <input type="radio" value="3" v-model="formObj.ptype"> 按钮
                                <span></span>
                            </label>                            
                        </div>
                    </div>
                </div>                
                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="required">*</span>权限名称：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="text" class="form-control" placeholder="菜单权限名称" name="pname" v-model="formObj.pname" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">鉴权CODE：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="text" class="form-control" placeholder="权限CODE,前端用于权限匹配" v-model="formObj.pcode" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">URL路径：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="text" class="form-control" placeholder="URL地址,点击后跳转的地址" v-model="formObj.url" />
                    </div>
                </div>             
                <div class="form-group">
                    <label class="col-md-3 control-label">排序编号：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="text" class="form-control" placeholder="排序编号,用于同级的排序" v-model="formObj.sort" />
                    </div>
                </div>                                   
                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="required">*</span>权限状态：</label>
                    <div class="col-md-8">
                        <select name="dataStatus" class="form-control input" v-model="formObj.dataStatus">
                            <option value="">请选择状态</option>
                            <option v-for="item in $root.dataStatusList" :value="item.id">{{item.desc}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消</button>
            <button @click="onSubmit($event)" type="button" class="btn green">保存</button>
        </div>
    </form>
</template>

<script>
    import base from 'common/js/utils/base.js';

    export default {
        data: function() {
            return {
                _editForm: null,        // 表单元素
                isAdd: false,           // 用于区分是新建或编辑
                formObj: {},            // 表单对象,放到created中初始化   
            };
        },
        //方法
        methods: {
            // 提交
            onSubmit: function(event) {
                event.preventDefault();
                var self = this;
                if(self._editForm.valid()){
                    $.ajax({
                        url: self.isAdd ? '/api/rbac/addPermissions' : '/api/rbac/updatePermissions',
                        type: 'POST',
                        data: self.formObj
                    }).done(({code, data}) => {
                       (code == '0000') && window.location.reload(true);
                    });
                }
            },
        },

        created: function() { 
            this.$root.$on('onAddEditModal', (obj, selectId, selectName) => {
                // 根据传入的obj判断, 如果为空则是添加操作, 否则是编辑操作
                this.isAdd = $.isEmptyObject(obj);

                // 初始化表单参数
                this.formObj = {
                    pid : '',           // 权限ID
                    parent: 0,          // 权限父级ID
                    ptype: '',          // 类型：1=目录, 2=菜单，3=按钮
                    pname: '',          // 权限名称
                    pcode: '',          // 鉴权Code
                    url: '',            // 菜单URL
                    sort: '',           // 权限排序
                    dataStatus: '',     // 权限状态
                };

                // 数据合并
                if(!this.isAdd){
                    this.formObj = base.assignObj(this.formObj, obj);
                }else{
                    // 若是添加行为,判断emit事件传来的选中ID不为空,就设为当前的父级权限ID和名称
                    if(selectId != null){
                        this.formObj.parent = selectId;
                    }
                };

                // 清空表单的错误提示
                $("#j_editForm").find('.has-error').closest('span').remove();
                $("#j_editForm").find('.has-error').each(function () {
                    $(this).removeClass('has-error');
                });

                this._editForm.modal();
            });
        },
        mounted: function() {
            // 初始化表单元素和参数验证规则
            this._editForm = $('#j_editForm');
            this._editForm.validate({
                rules:{
                    parent:{
                        required:true,
                    },
                    ptype:{
                        required:true,
                    },                    
                    pname:{
                        required:true,
                    },
                    dataStatus: {
                        required:true,
                    },
                }
            });
        }
    }
</script>