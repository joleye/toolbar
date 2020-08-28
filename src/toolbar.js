/**
 * Copyright (c) 2020. joleye.com all rights reserved..
 * 工具栏操作控件 0.1
 * @anther joleye
 * 表单验证控件 0.7
 */

define(['jquery', 'processLoading'], function ($, process) {
    $.fn.toolbar = function (conf) {
        $(this).data('conf', conf);
        $(this).click(function () {
            var act = $(this).attr('act');
            var dataConf = $(this).data('conf');
            var config = dataConf.conf;

            var ids = [];
            $('input[name=' + dataConf.checkbox_name + ']:checked').each(function () {
                ids.push($(this).val());
            });

            if (config[act].argName && ids.length == 0) {
                alert('请选择');
                return;
            }

            if (config[act].confirm && !confirm(config[act].confirm.replace('%s', ids.length))) {
                return;
            }

            if (dataConf.before) {
                var ret = dataConf.before(dataConf, act);
                if (!ret) {
                    return;
                }
            }

            process.putMsg('Loading...');
            var params = {};
            if (config[act].argName) {
                params[config[act].argName] = ids.join(',');
            }
            if (config[act].params) {
                $.extend(params, config[act].params);
            }
            var dataParams = $(this).data('params');
            if (dataParams) {
                $.extend(params, dataParams);
            }
            if (config[act].itemPost) {
                var resList = [];
                $.each(ids, function (index, val) {
                    params[config[act].argName] = val;
                    $.ajax({
                        type: 'POST',
                        url: config[act].action,
                        async: false,
                        data: params,
                        success: function (res) {
                            resList.push(res);
                            process.putMsg(res.msg);
                            if (res.status) {
                                process.putMsg(res.msg, 'success', 3000);
                            } else {
                                process.putMsg(res.msg, 'warning', 30000);
                            }
                        }
                    });
                });
                if (config[act].callback) {
                    config[act].callback(resList);
                } else if (dataConf.callback) {
                    dataConf.callback(resList);
                }
            } else {
                $.post(config[act].action, params, function (res) {
                    if (config[act].callback) {
                        config[act].callback(res);
                    } else if (dataConf.callback) {
                        dataConf.callback(res);
                    } else {
                        process.putMsg(res.msg);
                        if (res.status) {
                            process.putMsg(res.msg, 'success', 3000);
                            setTimeout(function () {
                                location.reload();
                            }, 1500);
                        } else {
                            process.putMsg(res.msg, 'warning', 30000);
                        }
                    }
                });
            }
        });
    };
});
