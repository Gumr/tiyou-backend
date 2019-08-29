<template>
    <form id="j_passForm" action="" class="modal fade form-horizontal" tabindex="-1" data-width="600">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title">修改密码</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="form-group">
                    <label class="col-md-3 control-label">旧密码：</label>
                    <div class="col-md-6">
                        <input autocomplete="off" type="password" class="form-control" placeholder="请输入旧密码" id="oldPwd" name="oldPwd" value="" v-model="passObj.oldPwd" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">新密码：</label>
                    <div class="col-md-6">
                        <input autocomplete="off" type="password" class="form-control" placeholder="请输入新密码" id="newPwd" name="newPwd" value="" v-model="passObj.newPwd"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">确认新密码：</label>
                    <div class="col-md-6">
                        <input autocomplete="off" type="password" class="form-control" placeholder="请再次输入新密码" id="newPwdConfirm" name="newPwdConfirm" value="" v-model="passObj.newPwdConfirm"/>
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
                passObj: {}
            };
        },
        methods: {
            onSubmit: function(event) {
                let self = this;
                event.preventDefault();
                if (this._passFrom.valid()) {
                    $.ajax({
                        url: '/api/rbac/updateLoginEmployeePassword',
                        type:'POST',
                        data: self.passObj
                    }).done(function(result){
                       if (result.code == '0000') {
                           self._passFrom.modal('hide');
                            base.cookie(self.store.tokenName, null,{
                                expires:0
                            });
                            window.location.href = '/login.html';
                       }
                    });
                }
            }
        },
        created: function() {
            this.$root.$on('profile.openPassModal', () => {
                this.passObj = {oldPwd: '', newPwd: '', newPwdConfirm: ''};
                this._passFrom.modal();
            });
        },
        mounted: function() {
            this._passFrom = $('#j_passForm');
            this._passFrom.validate({
                rules:{
                    oldPwd:{
                        required:true
                    },
                    newPwd:{
                        required:true,
                        notEqualTo:'#oldPwd'
                    },
                    newPwdConfirm:{
                        required:true,
                        equalTo:'#newPwd'
                    }
                }
            });
        }
    }
</script>