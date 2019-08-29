<template>
    <form id="j_editPermissionForm" action="" class="modal fade form-horizontal" tabindex="-1" data-width="800">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title">
                <span class="caption-subject font-green-sharp bold uppercase">角色授权：</span>
                <span class="caption-subject font-red bold uppercase">{{formObj.roleName}}</span>   
            </h4>
        </div>

        <div class="modal-body">
            <div class="row">
                <div class="jstree jstree-default jstree-checkbox-selection">
                    <permissions-tree-node :treeDataList="$root.permissionsList" :treeDataMap="$root.permissionsMap" :selectList="formObj.pids" @emitNodeSelected="onSelectNode"></permissions-tree-node>
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
import PermissionsTreeNode from "./PermissionsTreeNode.vue";


export default {    
    components: {
        PermissionsTreeNode,
    },
    data: function() {
        return {  
            formObj:{
                roleId: 0,              // 角色ID
                roleName: '',           // 角色名称
                pids: [],               // 角色拥有的权限ID集
            },
        };
    },
    methods: {
        // 提交表单
        onSubmit: function(event) {
            event.preventDefault();
            let self = this;
            $.ajax({
                url: "/api/rbac/updateRolePermissions",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(self.formObj)
            }).done(({ code, data }) => {
                code == '0000' && window.location.reload(true);
            });
            
        },

        // 节点被选中,判断操作行为,添加或者删除权限ID
        onSelectNode: function(pid, isSelect){
            let index = this.formObj.pids.indexOf(pid);
            if(isSelect){
                if(index == -1){
                    this.formObj.pids.push(pid);
                }
            }else{
                if(index > -1){
                    this.formObj.pids.splice(index, 1);
                }
            }
        },
    },
    created: function() {
        this.$root.$on('openPermissionModal', obj => {
            this.formObj.roleId = obj.roleId;
            this.formObj.roleName = obj.roleName;
            this.formObj.pids = obj.pids;

            this._editForm.modal();
        });
    },
    //挂载完成
    mounted: function() {
        //取得表单元素
        this._editForm = $("#j_editPermissionForm");
    }
};
</script>