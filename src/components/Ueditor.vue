<template>
 <div class="editorBox">
 	<!--<script v-bind:id="config.id" name="content" type="text/plain"></script>-->
 </div>
</template>

<style>
    .editorBox{
        box-shadow: 2px 2px 5px #d3d6da;
    }
</style>

<script>
    import base from 'common/js/utils/base';
    

    export default {
    	props: {
    	    value:String,
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        data() {
        	 return base.assignObj({
             }, this.config);
        },
        methods:{
        	initUeditor() {
        		let id = this.config.id;
        		let content = this.value;
                let ueID = UE.getEditor(id, {
                	serverUrl:'api/ueditor/ueditorConfig',
                    initialFrameHeight: 200
                });
                ueID.addListener('beforefullscreenchange', function (event, isFullScreen) {
                    //Base.ueFullScreenHandler(event, isFullScreen);
                });
                ueID.ready(() => {
                    //ueID.setContent(content);
                });
                return ueID;
            }
        },
        mounted:function(){
            this.initUeditor();
        }
    }
</script>