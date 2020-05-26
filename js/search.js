(function($) {
    'use strict';
     var cache = {
        data: {},
        count: 0,
        addData: function (key, data) {
            if (!this.data[key]) {
                this.data[key] = data;
                this.count++;
            }
        },
        readData: function (key) {
            return this.data[key];
        },
        deleteDataByKey: function (key) {
            delete this.data[key];
            this.count--;
        },
        deleteDataByOrder: function (num) {
            var count = 0;

            for (var p in this.data) {
                if (count >= num) {
                    break;
                }
                count++;
                this.deleteDataByKey(p);
            }
        }
    };
    function Search($elem, options) {
        this.$elem = $elem;
        this.options = options;

        this.$form = this.$elem.find('.search-form');
        this.$input = this.$elem.find('.search-inputbox');
        this.$layer = this.$elem.find('.search-layer');
        this.loaded = false;
        this.$elem.on('click', '.search-btn', $.proxy(this.submit, this));
        if (this.options.autocomplete) {
            this.autocomplete();
        }
    }
    //默认参数
    Search.DEFAULTS = {
        autocomplete: false,
        url: 'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6&q=',
        css3: false,
        js: false,
        animation: 'fade',
        getDataInterval: 200

    };
    Search.prototype.submit = function() {
        if (this.getInputVal() === '') {
            return false;
        }
        this.$form.submit();
    };
    Search.prototype.autocomplete = function() {
        var timer = null,
            self = this;
        this.$input
            .on('input', function() {
                if (self.options.getDataInterval) {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        self.getData();
                    }, self.options.getDataInterval);
                } else {
                    self.getData();
                }
            })
            .on('focus', $.proxy(this.showLayer, this))
            .on('click', function() {
                return false;
            });

        this.$layer.showHide(this.options);
        $(document).on('click', $.proxy(this.hideLayer, this));
    };

    Search.prototype.getData = function() {
        var self = this;
        var inputVal = this.getInputVal();
        if (inputVal == '') return self.$elem.trigger('search-noData');
        if(cache.readData(inputVal)) return self.$elem.trigger('search-getData',[cache.readData(inputVal)]);
        if (this.jqXHR) this.jqXHR.abort();
        // this.jqXHR=this.getAjax({
        //     url:'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1484204931352_18291&callback=jsonp18292&k=1&area=c2c&bucketid=6&q=',
        //     data:inputVal,
        //     method:'get',
        //     async:true,
        //     success:function(data){
        //         console.log(data);
        //     },
        //     error:function(data){
        //         console.log(data);
        //     }
        // });
        // this.jqXHR=this.getJSONP(
        //     'https://suggest.taobao.com/sug?code=utf-8&_ksTS=1484204931352_18291&k=1&area=c2c&bucketid=6&q='+inputVal,function(data){
        //     console.log(data);
        // });
        this.jqXHR = $.ajax({
            url: this.options.url + inputVal,
            dataType: 'jsonp'
        }).done(function(data) {
            console.log(data);
            cache.addData(inputVal, data);
            console.log(cache.data);
            console.log(cache.count);
            self.$elem.trigger('search-getData', [data]);
        }).fail(function() {
            self.$elem.trigger('search-noData');
        }).always(function() {
            self.jqXHR = null;
        });
    };
    Search.prototype.getAjax = function(options){
        var xhr=null,
            url=options.url,
            method=options.method || 'get',
            async=typeof(options.async) === 'undefined' ? true : options.async,
            data=options.data || null,
            params='',
            callback=options.success,
            error=options.error;
            if(data){
                for(var i in data){
                    params+=i+'='+data[i]+'&';
                }
                params=params.replace(/&$/,"");
            }
            if(method=='get'){
                url+='?'+params;
            }
        if(typeof XMLHttpRequest !='undefined'){
            xhr=new XMLHttpRequest();
        }else{
            xhr=new ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4){
                if((xhr.status>=200 && xhr.status<300)||xhr.status===304){
                    callback && callback(JSON.parse(xhr.responseText));
                }else{
                    error && error('请求失败');
                }
            }
        };
        xhr.open(method,url,async);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencode');
        xhr.send(params);
    };
    Search.prototype.getJSONP=function(url,callback){
        if(!url){
            return;
        }
        var a=['a','b','c','d','e','f','g','i','h','j'],
            r1=Math.floor(Math.random()*10),
            r2=Math.floor(Math.random()*10),
            r3=Math.floor(Math.random()*10),
            name='getJSONP'+a[r1]+a[r2]+a[r3],
            cbname='getJSONP.'+name;
            if(url.indexOf('?')===-1){
                url+='?jsonp='+cbname;
            }else{
                url+='&callback='+cbname;
            }
            url+='&callback=abc';
            var script=document.createElement('script');
            Search.prototype.getJSONP[name] = function(data){
                try{
                    callback && callback(data);
                }catch(e){
                    console.log(e);
                }finally{
                    delete getJSONP[name];
                    script.parentNode.removeChild(script);
                }
            };
            script.src=url;
            document.getElementsByTagName("head")[0].appendChild(script);
    };
    Search.prototype.showLayer = function() {
        if (!this.loaded) return;
        this.$layer.showHide('show');
    };
    Search.prototype.hideLayer = function() {
        this.$layer.showHide('hide');
    };

    Search.prototype.getInputVal = function() {
        return $.trim(this.$input.val());
    };
    Search.prototype.setInputVal = function(val) {
        this.$input.val(removeHtmlTags(val));

        function removeHtmlTags(str) {
            return str.replace(/<(?:[^>'"]|"[^"]*"|'[^']*')*>/g, '');
        }
    };
    Search.prototype.appendLayer = function(html) {
        this.$layer.html(html);
        this.loaded = !!html;
    };

    $.fn.extend({
        search: function(option, value) {
            return this.each(function() {
                var $this = $(this),
                    search = $this.data('search'),
                    options = $.extend({}, Search.DEFAULTS, $(this).data(), typeof option === 'object' && option);
                if (!search) {
                    $this.data('search', search = new Search($this, options));
                }
                if (typeof search[option] === 'function') {
                    search[option](value);
                }
            });
        }
    });
})(jQuery);