(function () {

    var linkUrl = "http://valentinesday.comeyes.cn/";

    if (window.location.href.indexOf("chinacloudsites") != -1) {
        linkUrl = "http://fresh-valentinesday.chinacloudsites.cn/";
    }

    $.ajax({
        url: './jssdk',
        type: "GET",
        data: {
            url: encodeURIComponent(window.location.href.split('#')[0])
        },
        dataType: "JSON",
        success: function (result) {
            // console.log(result)
            if (result.code == 0) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: result.data.appId, // 必填，公众号的唯一标识
                    timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
                    signature: result.data.signature,// 必填，签名，见附录1
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {

                    $(document).ready(function () {
                        // 默认分享文案
                        var $imgUrl = "http://valentinesday.comeyes.cn/img/FXIMG.jpg";
                        _setShare("Fresh | 七夕心愿TA来猜", "我想和你一起实现的七夕心愿，你能猜中吗？", linkUrl, $imgUrl,function(){},function(){})

                    });

               });

            }
        }
    });

    var _setShare;
    _setShare = function ($title, $desc, $link, $imgUrl,$success,$error) {

        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: $desc,
            link: $link,
            imgUrl: $imgUrl,
            success: function () {
                $success()
            },
            cancel: function () {
                $error()
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: $title,
            desc: $desc,
            link: $link,
            imgUrl: $imgUrl,
            type: '',
            dataUrl: '',
            success: function () {
                $success()
            },
            cancel: function () {
                $error()
            }
        });


    };

    window._setShare = _setShare;

})();







