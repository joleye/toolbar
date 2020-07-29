define(['jquery'], function ($) {
    return {
        appendMsg: function (msg, opt) {
            opt = typeof opt == 'undefined' ? 'default' : opt;//opt : default, warning, success
            var color = {
                'default': '#4698ff',
                'warning': '#ff3f1d',
                'success': '#5cb85c'
            };
            $('<div style="background:' + color[opt] + ';">' + msg + '</div>').appendTo($('#LoadingPopBox'));
        },
        putMsg: function (msg, opt, interval) {
            this.exit(0, null);
            opt = typeof opt == 'undefined' ? 'default' : opt;//opt : default, warning, success
            var color = {
                'default': '#4698ff',
                'warning': '#ff3f1d',
                'success': '#5cb85c'
            };
            $('<div id="LoadingPopBox" style="position:fixed;top:4px;right:20px;background:' + color[opt] + ';color:#fff;padding:3px 8px;z-index:9999;border-radius: .25em;"><div>' + msg + '</div></div>').appendTo($(document.body));
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