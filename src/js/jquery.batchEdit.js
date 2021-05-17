/**
 *  * Copyright (c) 2020. joleye.com all rights reserved..
 * 工具栏操作控件，异步编辑 0.1
 * 文件上传
 * @anther joleye
 * https://github.com/joleye/toolbar
 */
define(['jquery'], function ($) {
    $.fn.batchEdit = function (option) {

        this.each(function () {
            $(this).attr('title', '可编辑');
            $(this).click(function () {
                bindClick.apply(this);
            });
        });

        function bindClick() {
            $(this).addClass('s-edit');
            var type = $(this).attr("type");
            if (type === "bool") {
                var dom = document.createElement("input");
                $(dom).attr("type", "checkbox");
                if ($(this).html() === "是") {
                    $(dom).val("1");
                } else {
                    $(dom).val("0");
                    $(dom).attr("checked", "");
                }
                dom.focus();
                $(dom).on('click', function () {
                    if (this.checked)
                        this.value = "1";
                    else
                        this.value = "0";
                });
            } else {
                var $width = $(this).css('width');
                if ($(this).html().length < 30) {
                    var dom = document.createElement("input");
                    $(dom).addClass("input").val($(this).html());
                    $width && $(dom).css('width', $width);
                } else {
                    var dom = document.createElement("textarea");
                    $(dom).addClass("i-edit-textarea");
                    $width && $(dom).css('width', $width);

                    if ($(this).html().length < 100)
                        $(this).css("height", '50px');
                    else
                        $(this).css("height", '100px');

                    $(dom).val($(this).html());
                }
            }
            $(this).html("");
            $(dom).appendTo($(this));

            if (type === 'bool') {
                dom.checked = $(dom).val() === "1";
            }

            var that = this;
            $(dom).blur(function () {
                if (type === 'bool') {
                    setTimeout(function (dthis, o) {
                        blurFunc(dthis, o);
                    }, 200, this, that);
                } else {
                    blurFunc(this, that);
                }
            });

            $(this).unbind('click');
            $(dom).focus();
        }

        var blurFunc = function (dthis, o) {
            var valid = o.getAttribute('valid');
            var field = o.getAttribute('field');
            var type = o.getAttribute('type');
            var val = dthis.value;

            if (type === "int") {
                if (!/^\d+$/.test(val)) {
                    alert("数据类型错误~~~");
                    return;
                }
            } else if (type === "bool") {
                if (!/^0|1$/.test(val)) {
                    alert("数据类型错误~~~");
                    return;
                }
            }

            var data = {field: field, id: valid, val: val};
            if (option.params) {
                $.extend(data, option.params.call(o, dthis, val));
            }
            $.post(option.url, data, function (res) {
                if (!res.status) {
                    alert(res.msg);
                }
                $(o).removeClass('s-edit');
            });

            if (type === 'bool') {
                if (val === "1") {
                    o.innerHTML = "是";
                } else {
                    o.innerHTML = "否";
                }
            } else {
                o.innerHTML = val;
            }

            $(o).click(function () {
                bindClick.apply(this);
            });
        }
    };
});
