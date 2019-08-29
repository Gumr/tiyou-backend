<template>
    <div class="ms-upload">
        <slot name="inputFile"></slot>
    </div>
</template>

<script>
    require('./jquery-upload/css/jquery.fileupload.css');
    require('./jquery-upload/jquery.ui.widget.js');
    require('./jquery-upload/jquery.iframe-transport.js');
    require('./jquery-upload/jquery.fileupload.js');
    require('./jquery-upload/jquery.fileupload-process.js');
    require('./jquery-upload/jquery.fileupload-validate.js');

    import base from 'common/js/utils/base.js';

    const originalAdd = $.blueimp.fileupload.prototype.options.add;

    export default {
        props: {
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        data: function () {
            return {
                options :{
                    url: '',
                    dropZone: null,             // 禁用drag & drop
                    maxFileSize: undefined,     // 不限制文件大小
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    dataType: 'json',
                    // global: false,
                    // timeout: 0,
                    onUploadDone: $.noop,
                    onChange: $.noop,
                    onAdd: $.noop,
                },
                // 不受监控
                $fileinput: null
            };
        },
        methods: {
            initUpload: function() {
                this.$fileinput.fileupload(this.options);
            },
            initUploadEvents: function() {
                var _this = this;
                this.$fileinput
                    // 点击上传
                    .on('fileuploadchange', function(e, data) {
                        _this.changeHandler(e, data);
                    })
                    .on('fileuploadprocessalways', function(e, data) {
                        _this.alwaysHandler(e, data);
                    })
                    // 上传完成 更新数据
                    .on('fileuploaddone', function(e, data) {
                        _this.doneHandler(e, data);
                    })
                    // 上传失败
                    .on('fileuploadfail', function(e, data) {
                        _this.failHandler(e, data);
                    })
                    .prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');
            },
            changeHandler: function(e, data) {
                this.options.onChange.call(this, data);
            },
            alwaysHandler: function(e, data) {
                let file = data.files[data.index];
                if (file.error) {
                    alert(file.error);
                }
            },
            doneHandler: function(e, data) {
                this.options.onUploadDone.call(this, data.result, this.$fileinput);
            },
            failHandler: function(e, data) {}
        },
        mounted: function (e) {
            var _this = this,
                $this = $(this.$el);
            this.$fileinput = $this.find('input');
            // 当DOM渲染完毕后, 将options, 父组件传入的config.options合并在一起
            this.options = $.extend({
                add: function (e, data) {
                    originalAdd.call(this, e, data);
                    _this.options.onAdd.call(this, data);
                }
            }, this.options, this.config.options);
            this.initUpload();
            this.initUploadEvents();
        }
    }

</script>
