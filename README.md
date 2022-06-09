# toolbar

itemPost：逐个提交，默认false

```js
$('.toolbar .btn').toolbar({
    checkbox_name: 'customer_id',
    before: function(dataConf, act){
        var del_tag = 0;
        $('input[name=' + dataConf.checkbox_name + ']:checked').each(function () {
            if($(this).data('tag') == -1){
                del_tag++;
            }
        });
        if(act == 'pass' && del_tag > 0){
            return confirm('有'+del_tag+'条删除信息，是否继续？') && confirm('有'+del_tag+'条删除信息，是否继续？');
        }else{
            return true;
        }
    },
    conf: {
        'drop': {
            confirm: '确认要删除%s条吗?',
            action: 'action_pass_drop',
            argName: 'ids',
        },
        'pass': {
            action: 'pass_action',
            argName: 'ids',
            params: {status : 'pass'}
        },
        'un-pass': {
            action: 'pass_action',
            argName: 'ids',
            params: {status : 'un-pass'}
        },
    }
});
```

# upload

上传组件

### 上传按钮
```html
<div class="el-file">
    <input type="file" class="el-file-input" id="_inputFile" name="inputFile" multiple>
    <label class="el-file-label" for="customFile">+</label>
</div>
<div id="upload_area_id">
</div>
```

### 预览模板
```html
<script type="text/html" id="img_tpl">
    <div class="img-item img-item-${status}">
        <div class="c-2">
            <a href="/${path}" title="文件名：${img_name}，上传日期：${add_time2}" target="_blank">
            <img src="/${img_path}" alt="${img_name}" width="60" height="60"/>
            </a>
        </div>
        <div class="c-2 remove">
            <input type="hidden" class="img_id" name="img_ids" value=""/>
            <a href="javascript:void(0);" onclick="img_drop_item(this)" data-id="${img_id}"
               class="glyphicon glyphicon-remove"></a>
        </div>
    </div>
</script>
```

### 初始化方法
```js
$('#_inputFile').upload({
    action: '/upload',
    callback_tpl: 'img_tpl',
    upload_area_id: 'upload_area_id',
    init_url: '/get_image_list',//预览数据接口地址
    success: function(rows){},
    init_params: {typ_id: 10, link_id: ''}
});
```

|参数名称|说明|
|---|---|
|action|上传url|
|callback_tpl|回调模板id|
|upload_area_id|回调模板显示区域，需要搭配callback_tpl使用|
|init_url|初始化url|
|init_params|初始化参数或方法，需要搭配初始url使用，方法则this指向当前文件域|
|success|上传成功回调|

# batchEdit
异步编辑工具
