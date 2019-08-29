<template>
    <ul class="jstree-container-ul jstree-children">
        <li class="jstree-node" :class="getClasses(node,idx)" v-for="(node,idx) in treeDataList">
            <i class="jstree-icon jstree-ocl" @click="openAndClose(node)"></i>
            <a class="jstree-anchor" href="#" :class="node.pid==selectId ? 'jstree-clicked' : ''" @click="onSelectNode($event,node)">
                <i class="jstree-icon jstree-themeicon fa fa-folder icon-state-success jstree-themeicon-custom"></i>
                {{node.pname}}
            </a>
            <permissions-tree :treeDataList="node.childList" :selectId="selectId" @emitSelectNode="onEmitSelectNode"></permissions-tree>
        </li>
    </ul>
</template>


<script>

export default {
    name: "PermissionsTree",
    props: {
        treeDataList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        selectId: Number,
    },
    methods: {
        //获取节点class样式
        getClasses: function(node, idx){
            let childLength = node.childList.length;
            let classes = [];
            //若有子级则需要设置+和-号    
            if(childLength > 0){
                if(!node.open){
                    classes.push("jstree-open")      //反向处理，树节点默认全部展开，+号样式
                }else{
                    classes.push("jstree-closed")    //-号样式
                }
            }else{
                classes.push("jstree-leaf")
            }

            //是否是最后一个节点
            let lastIdx = this.treeDataList.length - 1;
            if(idx == lastIdx){
                classes.push("jstree-last")
            }
            return classes;
        },

        //展开或者关闭节点
        openAndClose: function(node){
            if(node.open){
                node.open = false;
            }else{
                node.open = true;
            }
            this.$forceUpdate();
        },

        //选中节点
        onSelectNode: function(event,node){
            event.preventDefault();
            this.onEmitSelectNode(node.pid, node.pname);
        },

        //处理节点选中消息的emit事件
        onEmitSelectNode: function(pid, name){
            this.$emit("emitSelectNode", pid, name);
        },
    },
}
</script>
