var UT = {
    Query: function (e) { return document.querySelector(e); },
    QueryAll: function (e) { return document.querySelectorAll(e); },
    Bind: function (e, fn) { UT.Query(e).addEventListener("click", fn, false); },
    Bind2: function (e, fn) { UT.Query(e).addEventListener("touchstart", fn, false); },
    show: function (e) { var aE = UT.QueryAll(e); for (var i = 0; i < aE.length; i++) { aE[i].style.display = "block"; } },
    hide: function (e) { var aE = UT.QueryAll(e); for (var i = 0; i < aE.length; i++) { aE[i].style.display = "none"; } },
    IOS: function () { return navigator.userAgent.match(/iPhone|ipad|iPod/i) ? true : false; },
    GetUrl: function (s) { var r = new RegExp("(^|&)" + s + "=([^&]*)(&|$)", "i"); var a = window.location.search.substr(1).match(r); if (a != null) { return a[2]; } else { return null; } },
    isMobile: function (v) { return (/^1(3\d|(4[5|7|9])|(5[0-3|5-9])|(7[0|1|3|5-8])|(8\d))-?\d{4}-?\d{4}$/.test(v)); },
    isPass: function (v) { return (/^([a-zA-Z]|\d){6,12}$/.test(v)); },
    isUserName: function (v) { return (/^[a-zA-Z][\w._]{2,15}$/.test(v)); },
    
    setCookie: function (n, v) {
        var Days = 7;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = n + "=" + escape(v) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (n) { var arr, reg = new RegExp("(^| )" + n + "=([^;]*)(;|$)"); if (arr = document.cookie.match(reg)) { return unescape(arr[2]); } else { return null; } },
    delCookie: function (n) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = UT.getCookie(n);
        if (cval != null) { document.cookie = n + "=" + cval + ";expires=" + exp.toGMTString(); }
    },
    getParam: function (url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var matchArr = url.match(reg);
        if (matchArr && matchArr[2]) {
            return matchArr[2];
        } else {
            return null;
        }
    }
};