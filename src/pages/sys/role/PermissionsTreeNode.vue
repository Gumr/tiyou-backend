<template>
    <ul class="jstree-children jstree-wholerow-ul jstree-no-dots">
        <li class="jstree-node" :class="node.open ? 'jstree-closed' : 'jstree-open'" v-for="node in treeDataList">
            <i class="jstree-icon jstree-ocl" @click="openAndClose(node)"></i>
            <a class="jstree-anchor" href="#" :class="{'jstree-clicked':isSelected(node.pid)}" @click="onSelectNode($event, node)">
                <i class="jstree-icon jstree-checkbox"></i>                                                                                                  <!-- 选择图标 -->       
                <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-warning icon-lg jstree-themeicon-custom" v-if="node.ptype==1"></i>            <!-- 菜单图标 -->
                <i class="jstree-icon jstree-themeicon fa fa-briefcase icon-state-success  jstree-themeicon-custom" v-if="node.ptype==2"></i>                <!-- 接口图标 -->
                {{node.pname}}
            </a>
            <permissions-tree-node :treeDataList="node.childList" :treeDataMap="treeDataMap" :selectList="selectList" @emitNodeSelected="onEmitNodeSelected"></permissions-tree-node>
        </li>
    </ul>      
</template>


<script>

export default {
    name: "PermissionsTreeNode",
    props: {
        treeDataList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        treeDataMap: {
            type: Object,
            default: function(){
                return {};
            }
        },
        selectList:{
            type: Array,
            default: function() {
                return [];
            }            
        },
    },
    methods: {
        //判断节点是否被选中
        isSelected: function(pid){
            if (this.selectList.indexOf(pid) > -1){
                return true;
            }
            return false;
        },

        //展开和关闭节点
        openAndClose: function(obj){
            if(obj.open){
                obj.open = false;
            }else{
                obj.open = true;
            }
            this.$forceUpdate();
        },

        //点击选中和取消节点
        onSelectNode: function(event, node){
            event.preventDefault();
            let isSelect = this.isSelected(node.pid) ? false : true;         //true=选中操作  flase=取消操作

            this.onEmitNodeSelected(node.pid, isSelect);   //发通知
            this.doSelectChild(node, isSelect);            //处理儿子节点
            this.doSelectParent(node, isSelect);           //处理父级节点
        },
        //递归处理儿子节点
        doSelectChild: function(node, isSelect){          
            node.childList.forEach((item)=>{                 
                this.onEmitNodeSelected(item.pid, isSelect);
                this.doSelectChild(item, isSelect);
            });                   
        },
        //递归处理父级节点
        doSelectParent: function(node, isSelect){
            //只处理选中操作,取消操作不处理父节点
            if(isSelect){
                let parentId = node.parent;
                if(parentId>0){
                    this.onEmitNodeSelected(parentId, isSelect);
                    //递归父级的父级.....    
                    let parentObj = this.treeDataMap[parentId];
                    this.doSelectParent(parentObj, isSelect);
                }
            }
        },

        //传递节点被选中或取消的消息事件
        onEmitNodeSelected: function(pid, isSelect){
            this.$emit("emitNodeSelected", pid, isSelect);
        },
    },
}
</script>
