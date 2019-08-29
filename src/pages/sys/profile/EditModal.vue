<template>
    <form id="j_editForm" action="" class="modal fade form-horizontal" tabindex="-1" data-width="600">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title">修改个人信息</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="required">*</span>员工姓名：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="text" class="form-control" placeholder="员工姓名" name="ename" v-model="obj.ename"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="required">*</span>手机号码：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="text" class="form-control" placeholder="手机号码" name="phone" v-model="obj.phone"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">邮箱地址：</label>
                    <div class="col-md-8">
                        <input autocomplete="off" type="email" class="form-control" placeholder="邮箱地址" v-model="obj.email"/>
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
                _editForm: null,
                obj: {}
            };
        },
        methods: {
            onSubmit: function(event) {
                event.preventDefault();
                if(this._editForm.valid()){
                    $.ajax({
                        url: '/api/rbac/updateLoginEmployeeProfile',
                        type:'POST',
                        data: this.obj
                    }).done(({code, data}) => {
                        (code == '0000') && window.location.reload(true)
                    });
                }
            }
        },
        created: function() {
            this.$root.$on('profile.openEditModal', obj => {
                this.obj = base.assignObj({
                    ename: '',      // 姓名
                    phone: '',      // 手机号
                    email: '',      // 邮箱
                }, obj);
                this._editForm.modal();
            });
        },
        mounted: function() {
            this._editForm = $('#j_editForm');
            this._editForm.validate({
                rules:{
                    ename:{
                        required:true,
                    },
                    phone:{
                        required: true,
                        mobile:true     // 大陆手机号码
                    },
                    email: {
                        email: true
                    }
                }
            });
        }
    }
</script>