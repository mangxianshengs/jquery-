(function($) {
    var transition = window.mt.transition; // transition兼容解决，transition.js

    // 提取init公共部分
    function init($elem, hiddenCallback) {

        if ($elem.is(':hidden')) {
            $elem.data('status', 'hidden');
            if (typeof hiddenCallback === 'function') hiddenCallback();

        } else {
            $elem.data('status', 'shown');
        }
    }

    // 提取show公共部分

    function show($elem, callback) {
        if ($elem.data('status') === 'show') return;
        if ($elem.data('status') === 'shown') return;
        $elem.data('status','show').trigger('show');
        callback();


    }

    function hide($elem, callback) {

        if ($elem.data('status') === 'hide') return;
        if ($elem.data('status') === 'hidden') return;
        $elem.data('status', 'hide').trigger('hide');
        callback();

    }

    // 正常显示和隐藏
    var silent = {
        init: init,
        show: function($elem) {
            show($elem, function() {
                $elem.show();
                $elem.data('status', 'shown').trigger('shown');
            });
        },
        hide: function($elem) {
            hide($elem, function() {
                $elem.hide();
                $elem.data('status', 'hidden').trigger('hidden');
            });
        }
    };
    // 带效果的显示和隐藏，css3实现方法
    var css3 = {
        fade: { 
            init: function($elem) {
                css3._init($elem, 'fadeOut');
            },
            show: function($elem) {
                css3._show($elem, 'fadeOut');
            },
            hide: function($elem) {
                css3._hide($elem, 'fadeOut');
            }
        },
        slideUpDown: { 
            init: function($elem) {
                $elem.height($elem.height());
                css3._init($elem, 'slideUpDownCollapse');
            },
            show: function($elem) {
                css3._show($elem, 'slideUpDownCollapse');
            },
            hide: function($elem) {
                css3._hide($elem, 'slideUpDownCollapse');
            }
        },
        slideLeftRight: { // 左右滚动
            init: function($elem) {
                $elem.width($elem.width());
                css3._init($elem, 'slideLeftRightCollapse');

            },
            show: function($elem) {
                css3._show($elem, 'slideLeftRightCollapse');

            },
            hide: function($elem) {
                css3._hide($elem, 'slideLeftRightCollapse');
            }
        },
        fadeSlideUpDown: { // 淡入淡出上下滚动
            init: function($elem) {
                $elem.height($elem.height());
                css3._init($elem, 'fadeOut slideUpDownCollapse');

            },
            show: function($elem) {
                css3._show($elem, 'fadeOut slideUpDownCollapse');

            },
            hide: function($elem) {
                css3._hide($elem, 'fadeOut slideUpDownCollapse');
            }
        },

        fadeSlideLeftRight: { // 淡入淡出左右滚动
            init: function($elem) {
                $elem.width($elem.width());
                css3._init($elem, 'fadeOut slideLeftRightCollapse');

            },
            show: function($elem) {
                css3._show($elem, 'fadeOut slideLeftRightCollapse');

            },
            hide: function($elem) {
                css3._hide($elem, 'fadeOut slideLeftRightCollapse');
            }
        }
    };

    css3._init = function($elem, className) {
        $elem.addClass('transition');
        init($elem, function() {
            $elem.addClass(className);

        });

    };

    css3._show = function($elem, className) {
        show($elem, function() {
            $elem.off(transition.end).one(transition.end, function() {
                $elem.data('status', 'shown').trigger('shown');
            });
            $elem.show();
            setTimeout(function() {
                $elem.removeClass(className);
            }, 20);
        });
    };

    css3._hide = function($elem, className) {
        hide($elem, function() {
            $elem.off(transition.end).one(transition.end, function() {
                $elem.hide();
                $elem.data('status', 'hidden').trigger('hidden');
            });
            $elem.addClass(className);
        });
    }

    // 带效果的显示和隐藏，js实现方法
    var js = {
        fade: { // 淡入淡出
            init: function($elem) {
                js._init($elem);
            },
            show: function($elem) {
                js._show($elem, 'fadeIn');
            },
            hide: function($elem) {

                js._hide($elem, 'fadeOut');
            }
        },
        slideUpDown: { // 上下滚动
            init: function($elem) {
                js._init($elem);
            },
            show: function($elem) {
                js._show($elem, 'slideDown');

            },
            hide: function($elem) {

                js._hide($elem, 'slideUp');

            }
        },
        slideLeftRight: { // 左右滚动
            init: function($elem) {
                js._customInit($elem, {

                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            },
            show: function($elem) {
                js._customshow($elem);
            },
            hide: function($elem) {
                js._customHide($elem, {
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            }
        },
        fadeSlideUpDown: { // 淡入淡出上下滚动
            init: function($elem) {
                js._customInit($elem, {
                    'opacity': 0,
                    'height': 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                });
            },
            show: function($elem) {
                js._customshow($elem);
            },
            hide: function($elem) {
                js._customHide($elem, {
                    'opacity': 0,
                    'height': 0,
                    'padding-top': 0,
                    'padding-bottom': 0
                });
            }
        },
        fadeSlideLeftRight: { // 淡入淡出左右滚动
            init: function($elem) {
                js._customInit($elem, {
                    'opacity': 0,
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            },
            show: function($elem) {
                js._customshow($elem);
            },
            hide: function($elem) {
                js._customHide($elem, {
                    'opacity': 0,
                    'width': 0,
                    'padding-left': 0,
                    'padding-right': 0
                });
            }
        }
    };

    js._init = function($elem, hiddenCallback) {
        $elem.removeClass('transition'); // js和transition动画冲突，在执行js前，将transition去掉，屏蔽风险。
        init($elem, hiddenCallback);
    };

    js._customInit = function($elem, options) {
        var styles = {};
        for (var p in options) {
            styles[p] = $elem.css(p);
        }

        $elem.data('styles', styles);

        js._init($elem, function() {
            $elem.css(options);
        });

    };

    js._customshow = function($elem) {
        var styles = $elem.data('styles');
        show($elem, function() {
            $elem.show();
            $elem.stop().animate($elem.data('styles'), function() {
                $elem.data('status', 'shown').trigger('shown');
            });
        });
    };

    js._customHide = function($elem, options) {
        hide($elem, function() {

            $elem.stop().animate(options, function() {
                $elem.hide();
                $elem.data('status', 'hidden').trigger('hidden');
            });
        });
    };


    js._show = function($elem, mode) {
        show($elem, function() {
            $elem.stop()[mode](function() {
                $elem.data('status', 'shown').trigger('shown');
            });
        });
    };

    js._hide = function($elem, mode) {

        hide($elem, function() {
            $elem.stop()[mode](function() {
                $elem.data('status', 'hidden').trigger('hidden');
            });
        });

    };

    var defaults = {
        css3: true,
        js: true,
        animation: 'fade'
    };

    function showHide($elem, options) {
        var mode = null;
        if (options.css3 && transition.isSupport) { //css3 transition
            mode = css3[options.animation] || css3[defaults.animation];
        } else if (options.js) { //js animation
            mode = js[options.animation] || js[defaults.animation];
        } else { // no animation
            mode = silent;
        }
        mode.init($elem);
        return {
            show: $.proxy(mode.show, this, $elem),
            hide: $.proxy(mode.hide, this, $elem),
        };
    }
    
    $.fn.extend({
        showHide: function (option) {
            return this.each(function () {
                var $this = $(this),
                    options = $.extend({}, defaults, typeof option === 'object' && option),
                    mode = $this.data('showHide');

                if (!mode) {
                    $this.data('showHide', mode = showHide($this, options));
                }

                if (typeof mode[option] === 'function') {
                    mode[option]();
                }
            });
        }
    });
})(jQuery);