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
