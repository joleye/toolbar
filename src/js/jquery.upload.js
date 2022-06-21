/**
 * Copyright (c) 2022. joleye.com all rights reserved..
 * 工具栏操作控件 0.2.1
 * 文件上传
 * @anther joleye
 * https://github.com/joleye/toolbar
 */
define(['jquery'], function ($) {
    $.fn.image_list = function (opt, original_option) {
        var option = _get_option(opt);
        var that = this;
        //初始化图片列表
        if (option.init_url) {
            var data = {};
            if (typeof option.init_params == 'function') {
                data = option.init_params.call(this);
            } else {
                data = option.init_params;
            }
            $.post(option.init_url, data, function (res) {
                if (res && res.rows && res.rows.length > 0) {
                    opt.callback(res, original_option);
                }

                opt.init_complete && opt.init_complete.call(that, res.rows);
            });
        }
    };

    $.fn.upload = function (opt) {
        var option = _get_option(opt);

        if (!option.upload_area_id) {
            var $area = $(this).parent('div');

            if ($area.attr('id') !== '') {
                var upload_area_id = 'upload_' + new Date().getTime() + Math.round(Math.random() * 100000);
                option.upload_area_id = upload_area_id;
                $area.attr('id', upload_area_id);
            } else {
                option.upload_area_id = $area.attr('id');
            }
        }

        var sb = [];
        sb.push('<form class="form-horizontal hide" method="POST" target="' + option.target_form + '" enctype="multipart/form-data" action="' + option.action + '" id="' + option.form_id + '">');
        sb.push('</form>');
        sb.push('<iframe style="display:none;" id="' + option.target_form + '" name="' + option.target_form + '"></iframe>');

        $(sb.join('')).appendTo($(document.body));
        this.change(function (e) {
            file_select(this, option);
        });

        //初始化图片列表
        opt.callback = __upload_callback;
        $.fn.image_list(opt, option);
    };

    $.fn.upload2 = function (option) {
        option.el = this;
        this.change(function (e) {
            submit(this, option);
        });

        //初始化图片列表
        option.callback = __upload_callback;
        $.fn.image_list.call(this, option, option);
    };

    function _get_option(opt) {
        var option = {
            form_id: 'upload_form_' + new Date().getTime(),
            target_form: 'target_form',
            action: '/upload',
            callback_tpl: 'img_tpl',
            init_url: '/get_image_list'
        };
        $.extend(option, opt);
        return option;
    }

    function _get_query(params) {
        if (typeof params == 'function') {
            return _get_query.call(this, params.call(this));
        } else {
            var url = [];
            $.each(params, function (key, val) {
                url.push(key + '=' + val);
            });
            return url.join('&');
        }
    }

    function file_select(self, option) {
        var clone = $(self).clone();
        var selector = '#' + option.form_id;
        var $area = $(self).parent('div');

        $(self).appendTo($(selector).html('')).removeAttr('id');

        clone.bind('change', function () {
            file_select(this, option);
        });

        if ($area.find('div').length > 0) {
            $area.find('div:first').before(clone);
        } else {
            clone.appendTo($area);
        }
        option.$area = $area;
        $(document).data('upload_option', option);

        $area.addClass('loading');

        $(selector).submit();
    }

    //新方法
    function submit(self, option) {
        var formData = new FormData();
        $.each(self.files, function (k, val) {
            formData.append('inputFile', val);
        });
        var url = option.action;
        if (url.indexOf('?') > -1) {
            url += '&'
        } else {
            url += '?';
        }
        url += 'response=json&' + _get_query.call(self, option.init_params);
        $(document).data('upload_option', option);
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type: 'post',
            url: url,
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            crossDomain: true,
            success: function (data) {
                __upload_callback(data);
            },
            error: function () {
                alert("上传失败");
            },
            //上传文件进度
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.onprogress = function (e) {
                        if (e.lengthComputable) {
                            var percent = Math.floor(e.loaded / e.total * 100);
                            $('.progress-bar').css("width", percent + "%").text(percent + "%");
                        }
                    };
                }
                return xhr;
            }
        });
    }

    window.__upload_callback = function (data, original_option) {
        var option = original_option || $(document).data('upload_option');
        if (option.$area) {
            option.$area.removeClass('loading');
        }
        if (data.status) {
            if (option.callback_tpl) {
                var img_tpl = $('#' + option.callback_tpl).html();
                $.each(data.rows, function (k, val) {
                    var html = img_tpl;

                    var conf = {
                        'img_path': val.img_path,
                        'thumb_img_path': val.thumb_img_path,
                        'img_name': val.img_name,
                        'file_path': val.file_path,
                        'path': val.file_path || val.img_path,
                        'img_id': val._id
                    };

                    $.each(conf, function (key, val) {
                        var reg = new RegExp('\\${' + key + '}', 'g');
                        html = html.replace(reg, val);
                    });

                    var upload_area_id = option.upload_area_id;
                    $dom = $(html).appendTo($('#' + upload_area_id));

                    $.each(conf, function (key, val) {
                        $dom.find('.' + key).val(val);
                    });
                });
            }
            if (option.success) {
                option.success.call(option.el, data.rows);
            }
        } else {
            alert(data.msg);
        }
    }
});
