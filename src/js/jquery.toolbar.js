/**
 * Copyright (c) 2022. joleye.com all rights reserved..
 * 工具栏操作控件 0.1.1
 * @anther joleye
 * https://github.com/joleye/toolbar
 */

define(['jquery', 'processLoading'], function ($, process) {
    $.fn.toolbar = function (conf) {
        $(this).data('conf', conf);
        $(this).click(function () {
            var act = $(this).attr('act') || $(this).data('act');
            var dataConf = $(this).data('conf');
            var $that = $(this);
            var config = dataConf.conf;

            var ids = [];
            $('input[name=' + dataConf.checkbox_name + ']:checked').each(function () {
                ids.push($(this).val());
            });

            if (config[act].argName && ids.length === 0) {
                alert('请选择');
                return;
            }

            if (config[act].confirm && !confirm(config[act].confirm.replace('%s', ids.length))) {
                return;
            }

            if (dataConf.before) {
                if (!dataConf.before.call(this, dataConf, act, ids)) {
                    return;
                }
            }
            if (config[act].before) {
                if (!config[act].before.call(this, dataConf, act, ids)) {
                    return;
                }
            }

            process.putMsg('Loading...');
            var params = {};
            if (config[act].argName) {
                params[config[act].argName] = ids.join(',');
            }
            if (config[act].params) {
                if (typeof config[act].params == 'function') {
                    let newArg = config[act].params.apply(this);
                    $.extend(params, newArg);
                } else {
                    $.extend(params, config[act].params);
                }
            }
            var dataParams = $(this).data('params');
            if (dataParams) {
                if (typeof dataParams == 'function') {
                    let newArg = dataParams.apply(this);
                    $.extend(params, newArg);
                } else {
                    $.extend(params, dataParams);
                }
            }
            $that.prop('disabled', true);
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
                            $that.prop('disabled', false);
                            resList.push(res);
                            process.putMsg(res.msg);
                            if (res.status || res.result) {
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
                    $that.prop('disabled', false);
                    if (config[act].callback) {
                        config[act].callback(res);
                    } else if (dataConf.callback) {
                        dataConf.callback(res);
                    } else {
                        process.putMsg(res.msg);
                        if (res.status || res.result) {
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
