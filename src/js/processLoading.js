/**
 * Copyright (c) 2020. joleye.com all rights reserved..
 * 工具栏操作控件 0.1
 * 进度条
 * @anther joleye
 * https://github.com/joleye/toolbar
 */

define(['jquery'], function ($) {
    var color = {
        'default': '#4698ff',
        'warning': '#ff3f1d',
        'success': '#5cb85c'
    };
    return {
        insertMsg: function (msg, opt, interval) {
            opt = typeof opt == 'undefined' ? 'default' : opt;//opt : default, warning, success
            var $last = $('#LoadingPopBox div:first');
            $('<div style="background:' + color[opt] + ';">' + msg + '</div>').insertBefore($last);

            if($('#LoadingPopBox div').length > 8){
                $('#LoadingPopBox').css('overflow-y', 'scroll');
            }else{
                $('#LoadingPopBox').css('overflow-y', '');
            }
            if (interval) {
                this.exit(interval, null);
            }
        },
        appendMsg: function (msg, opt, interval) {
            opt = typeof opt == 'undefined' ? 'default' : opt;//opt : default, warning, success
            $('<div style="background:' + color[opt] + ';">' + msg + '</div>').appendTo($('#LoadingPopBox'));
            if (interval) {
                this.exit(interval, null);
            }
        },
        putMsg: function (msg, opt, interval) {
            this.exit(0, null);
            opt = typeof opt == 'undefined' ? 'default' : opt;//opt : default, warning, success
            var style = 'position:fixed;top:4px;left:0; width:100%; text-align: center; background:' + color[opt] + ';' +
                'color:#fff;padding:3px 8px;z-index:9999;border-radius: .25em;max-height:600px;';
            $('<div id="LoadingPopBox" style="'+style+'"><div>' + msg + '</div></div>').appendTo($(document.body));
            if (interval) {
                this.exit(interval, null);
            }
        },
        exit: function (interval, callback) {
            if (typeof (this.global__loadingBox) != 'undefined' && this.global__loadingBox) {
                clearTimeout(this.global__loadingBox);
            }
            if (interval) {
                this.global__loadingBox = setTimeout(function () {
                    $('#LoadingPopBox').remove();
                    callback && callback();
                }, interval);
            } else {
                $('#LoadingPopBox').remove();
                callback && callback();
            }
        }
    };
});
