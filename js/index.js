var main = {};
main.proxy = 'http://txktapi.lingbokeji.cn';
main.myTarget = '目标1';
main.init = function () {
    // main.getUserInfoByOpenid("wx8b9ddd1c943ce95f");
    // this.initShareInfo();
    main.initSwipper();
    main.bindEvent();
    main.initSwipper();
}
main.pageType = function () {
    var redirect_uri = window.location.href; // http://2018.0rh.cn?openid=11
    var url_params = window.location.search.substr(1);
    var friendOpenid = main.util.getParam(url_params, 'openid'); // 默认分享链接上带的是friendOpenid
    var wishid = main.util.getParam(url_params, 'wishid');
    var code = main.util.getParam(url_params, 'code');
    if (friendOpenid && wishid) {
        main.UT.setCookie('friendOpenid', friendOpenid);
        main.UT.setCookie('wishid', wishid);
    } else if (code) {
        // main.UT.setCookie('code', code);
        main.api.getUserInfoByCode(code);
        $('#home').show();
    } else {
        var openid = main.UT.getCookie('openid');
        var nickName = main.UT.getCookie('nickName');
        var headimgurl = main.UT.getCookie('headimgurl');
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8b9ddd1c943ce95f&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";

    }
    
    // 朋友查愿望id 猜愿望
    // 自己查愿望id 看好友列表
    // 没有愿望id 进入首页
}
main.UT = {
    setCookie: function (n, v) {
        var Days = 7;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = n + "=" + escape(v) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (n) { 
        var arr, reg = new RegExp("(^| )" + n + "=([^;]*)(;|$)"); 
        if (arr = document.cookie.match(reg)) { 
            return unescape(arr[2]); 
        } else { 
            return null; 
        } 
    },
    delCookie: function (n) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = main.UT.getCookie(n);
        if (cval != null) { document.cookie = n + "=" + cval + ";expires=" + exp.toGMTString(); }
    },
    getParam: function (url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var matchArr = url.match(reg);
        if (matchArr && matchArr[2]) {
            return matchArr[2];
        } else {
            return null;
        }
    }
}
main.api = {
    /**
     * 根据code获取微信用户信息
     * @param {String} code
     */
    getUserInfoByCode: function (code) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "post",
            url: main.proxy + "/api/v1/weixinLogin",
            data: {
                code: code
            },
            success: function (d) {
                console.log(d);
                var openid = d.data.openid;
                var nickname = d.data.nickname;
                var headimgurl = d.data.headimgurl;
                main.UT.setCookie('openid', openid);
                main.UT.setCookie('nickname', nickName);
                main.UT.setCookie('headimgurl', headimgurl);
            },
            error: function (d) {
                console.log(d);
            },
            complete: function () {
                $(".ajaxLayer").fadeOut();
            }
        })
    },
    
    /**
     * 根据openid获取用户信息
     * @param {String} openid 
     */
    getUserInfoByOpenid: function (openid) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "get",
            url: main.proxy + "/api/v1/user_info",
            data: {
                openid: openid
            },
            success: function (d) {
                console.log(d);
            },
            error: function (d) {
                console.log(d);
            },
            complete: function () {
                $(".ajaxLayer").fadeOut();
            }
        })
    }
}


main.initSwipper = function () {
    var mainSwiper = new Swiper('.swiper-container-main', {
        direction: 'vertical',
        onInit: function (opt) { //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(opt); //隐藏动画元素 
            swiperAnimate(opt); //初始化完成开始动画
        },
        onSlideChangeEnd: function (opt) {
            console.log(opt.activeIndex);
            if (opt.activeIndex === 1) {
                $('#video')[0].pause();
            }
        }
    })
    var subSwiper = new Swiper('.swiper-container-target', {
        direction: 'horizontal',
        loop: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        onInit: function (opt) {},
        onSlideChangeEnd: function (opt) {}
    })
    // mainSwiper.init();
    // subSwiper.init();
}
main._setShare = function ($title, $desc, $link, $imgUrl, $success, $error) {
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
main.initShareInfo = function () {
    var currUrl = cqsj.url.replace(window.location.hash, '');
    $.getJSON('http://www.sphinxcapital.com.cn/wxapi/signature.php?url=' + encodeURIComponent(currUrl)).done(function (data) {
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        });
    });

    wx.ready(function () {
        // 微信分享
        // 分享给朋友
        wx.onMenuShareAppMessage({
            title: '', // 分享标题
            desc: '', // 分享描述
            link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '' // 分享图标
        });
        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: '', // 分享标题
            link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
        });
    });
}

main.initUserinfo = function (nickSelector, avatarSelector, nickName, avatarUrl) {
    $(nickSelector).text(nickName);
    $(avatarSelector).find('img').attr("src", avatarUrl);

}

main.generateCode = function (url) {
    console.log(url);
    var codeEl = $('#share-code')[0];
    var width = codeEl.offsetWidth;
    var height = codeEl.offsetHeight;
    var qrcode = new QRCode(codeEl, {
        width: width,
        height: height
    });
    qrcode.makeCode(url);
}

main.takeScreenshot = function () {
    var cntElem = $('#generatePic')[0];
    var shareContent = cntElem; //需要截图的包裹的（原生的）DOM 对象
    var width = shareContent.offsetWidth; //获取dom 宽度
    var height = shareContent.offsetHeight; //获取dom 高度
    var canvas = document.createElement("canvas"); //创建一个canvas节点
    var scale = 3; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
    html2canvas($("#generatePic"), {
        canvas: canvas,
        onrendered: function (canvas) {
            var strDataURI = canvas.toDataURL("image/jpeg");
            // $('#generatePicShow').show().find('img').attr('src', strDataURI);
            $('#generatePicShow').find('img').attr('src', strDataURI);
            setTimeout(function () {
                $('#generatePicShow').show();
                $('.save-pic-layer').show().delay(1000).fadeOut('slow');
            }, 4000);
        }
    });
}

main.sort = function (ARR) {
    ARR.sort(function () {
        return 0.5 - Math.random()
    });
    return ARR;
};

main.Randomwish = function (target, domArrS, domArrP) {
    var _target = main.sort(target);
    console.log(_target);
    for (var i = 0; i < domArrS.length; i++) {
        (function (i) {
            if (domArrS) {
                $(domArrS[i]).text(_target[i]);
            }
            if (domArrP) {
                $(domArrP[i]).text(_target[i]);
            }
        })(i)
    }

};
main.friendGuess = function () {
    // 如果是朋友点进来 猜目标
    var nickName = '柳岩';
    var avatarUrl = './img/ly2.jpg';
    var myTarget = '测试目标';
    var _targetArr = ['目标1', '目标2', '目标3', '目标4', '目标5', '目标6', '目标7', '目标8', '目标9'];
    var domArrGuess = $('.g-nine-text');
    var caiIndex = 0;
    var page4ErrorText = ['还能好好做朋友吗', '友谊的小船说翻就翻', '只想露出没默契的笑容', '卸下你爱我的伪装吧', '没默契=没关系'];
    var caiTargetObj = [
        { MOqibaifen: "默契度 100%", MOqiText: "命中注定，没有人比你们更相配。" },
        { MOqibaifen: "默契度 88%", MOqiText: "最好的默契莫过于，我心里想的你都懂。" },
        { MOqibaifen: "默契度 77%", MOqiText: "陪伴才是最长情的告白。" },
        { MOqibaifen: "默契度 66%", MOqiText: "简单的默契，幸福的刚好。" },
        { MOqibaifen: "默契度 55%", MOqiText: "爱上一匹野马，可我家里没有草原。" },
        { MOqibaifen: "默契度 44%", MOqiText: "岁月静好,时光不负有心人。" },
        { MOqibaifen: "默契度 33%", MOqiText: "手牵手,漫漫长路一起走。" },
        { MOqibaifen: "默契度 22%", MOqiText: "嘘~恋爱的气息正在发酵" },
        { MOqibaifen: "默契度 11%", MOqiText: "我终于发现了，你是来找茬的吧？！" }
    ];
    main.initUserinfo('.g-userinfo-nickname', '.g-userinfo-avatar', nickName, avatarUrl);
    if (_targetArr.indexOf(myTarget) === -1) {
        _targetArr[5] = myTarget;
    }
    main.Randomwish(_targetArr, domArrGuess);
    $('#home').hide();
    $('#friendGuess').show();

    // 朋友猜
    $(document).on('click', '.g-nine-target', function () {
        var guessed = $(this).attr('guessed')
        var guessTarget = $(this).find('.g-nine-text').text();
        var $error = $(this).find('.guess-error')
        if (guessed === "true") {
            return false;
        } else {
            $(this).attr("guessed", "true");
            if (guessTarget === myTarget) {
                // 猜对了
                $('#guess-mqd-text').text(caiTargetObj[caiIndex].MOqibaifen);
                $('#guess-desc-text').text(caiTargetObj[caiIndex].MOqiText);
                $('.guess-right-layer').fadeIn();
                main.initSwipper();
            } else {
                $error.fadeIn('slow');
            }
            caiIndex++;
        }
    });
    // 猜过后生成我的目标
    $(document).on('click', '#generate-mytarget', function () {
        $('#friendGuess').hide();
        $('.guess-right-layer').hide();
        $('#home').fadeIn();
    })
};
main.bindEvent = function () {
    // main.friendGuess();
    // 输入目标
    // $('#input-target').change(function(){
    //     console.log($(this).val().length);
    // })
    // 选择系统目标
    $(document).on('click', '.target-text', function () {
        $('#input-target').val($(this).attr('target-text'));
    })
    // 提交我的目标
    $("#submit-target").on("click", function () {
        var myTarget = $('#input-target').val();
        var _targetArr = ['目标1', '目标2', '目标3', '目标4', '目标5', '目标6', '目标7', '目标8', '目标9'];
        var domArrShare = $('.s-nine-text');
        var domArrPic = $('.t-nine-text');
        if (myTarget.length > 10) {
            var $lengthTips = $('.length-layer');
            $lengthTips.fadeIn('slow');
            setTimeout(function () {
                $lengthTips.fadeOut();
            }, 1000)
        } else {
            if (!myTarget) {
                $('.one-input').addClass('bounce').find('#input-target').addClass('red-input');
                setTimeout(function () {
                    $('.one-input').removeClass('bounce').find('#input-target').removeClass('red-input');
                }, 2000)
            } else {
                _targetArr = main.sort(_targetArr);
                $('#selectSharewayPage').show();
                $('#generatePic').show();
                $('#home').hide();
                if (_targetArr.indexOf(myTarget) === -1) {
                    _targetArr[5] = myTarget;
                }
                var nickName = '柳岩';
                var avatarUrl = './img/ly2.jpg';
                main.initUserinfo('.t-userinfo-nickname', '.t-userinfo-avatar', nickName, avatarUrl);
                main.Randomwish(_targetArr, domArrShare, domArrPic);
                main.generateCode('www.tx.com?id=1');
            }
        }
    });
    // 选择分享方式
    // 1.右上角分享
    $("#share-ta-btn").on('click', function () {
        $('.share-ta-layer').fadeIn("slow");
    })
    $('.share-ta-layer').on('click', function () {
        $(this).toggle();
    })
    // 2.生成图片分享
    $("#share-pic-btn").on('click', function () {
        main.takeScreenshot();
        $('.share-pic-layer').fadeIn("slow");
        setTimeout(function () {
            $('.share-pic-layer').hide();
        }, 5000)
    })
    $('.save-pic-layer').on('click', function () {
        $(this).toggle();
    })
    // 播放视频
    $(document).on('click', '#video-img', function () {
        $(this).hide();
        $('#video')[0].play();
    })


}
main.init();