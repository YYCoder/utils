/**
 * Created by yuanye on 17/01/05.
 * 动态加载JS插件
 * 两个方法: sync(同步加载)和async(异步加载)
 */
(function() {

    //用于检测JS是否加载完毕,及修改JS的加载状态
    var load = {
        _loadList: {},
        isLoaded: function(url) {
            return this._loadList[url] === true;
        },
        modLoad: function(url) {
            this._loadList[url] = true;
        }
    };

    // 加载JS函数
    function loadScript(url, isAsync) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = isAsync;
        script.src = url;

        document.head.appendChild(script);
        return script;
    };

    var exports = {
        // 同步加载
        sync: function(url) {
            !load.isLoaded[url] || loadScript(url, false);
            load.modLoad(url);
        },

        // 异步加载
        async: function(url, done) {
            var script;
            if (load.isLoaded[url]) {
                load.modLoad(url);
                done && done();
            } else {
                script = loadScript(url, true);
                // IE不支持onload,支持onreadystatechange
                if (document.all) {
                    script.onreadystatechange = function() {
                        var state = this.readyState;
                        if (state === 'loaded' || state === 'complete') {
                            load.modLoad(url);
                            done && done();
                        }
                    }
                } else {
                    script.onload = function() {
                        load.modLoad(url);
                        done && done();
                    }
                }
            }
        }
    };

    // 将exports添加到全局
    window.loadScript = exports;

})()
