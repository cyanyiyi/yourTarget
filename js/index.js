var main = {};
main.proxy = 'http://txktapi.lingbokeji.cn';
main.txkturl = '2018.0rh.cn';
main.code = undefined;
main.wish = undefined;
main.wishid = undefined;
main.mywishid = undefined;
main.openid = undefined;
main.friendOpenid = undefined;
main.nickname = '';
main.headimgurl = '';
main.init = function () {
    // main.bindEvent();
    // main.initSwipper();
    main.pageType();
    // main.pageFriendGuess();
    // main.pageGuessList();
    // main.pageHome();
}
main.pageType = function () {
    var redirect_uri = window.location.href; // http://2018.0rh.cn?openid=11
    var url_params = window.location.search.substr(1);
    main.friendOpenid = main.UT.getParam(url_params, 'openid'); // 默认分享链接上带的是friendOpenid
    main.wishid = main.UT.getParam(url_params, 'wishid');
    main.code = main.UT.getParam(url_params, 'code');
    // 有code证明是授权之后重定向的链接 不需要再授权
    if(main.code) {
        console.log('start getUserInfoByCode')
        main.api.getUserInfoByCode(main.code);
        console.log('end getUserInfoByCode')
        main.openid = main.UT.getCookie('openid');
        main.friendOpenid = main.UT.getCookie('friendOpenid');
        main.wishid = main.UT.getCookie('wishid');
        if (main.openid & main.friendOpenid & main.wishid) {
            main.api.getUserWish({ 'openid': main.openid, 'wish_openid': main.friendOpenid, 'wishid': main.wishid})
        } else {
            main.pageHome();
        }
        var url = window.location.href.split('?')[0];
        main.api.getJsConfig({
            'url':url,
            'openid':main.openid
        })
    } else {
        if (main.friendOpenid & main.wishid) {
            main.UT.setCookie('friendOpenid', main.friendOpenid);
            main.UT.setCookie('wishid', main.wishid);
        }
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8b9ddd1c943ce95f&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
    }
    
    // 朋友查愿望id 猜愿望
    // 自己查愿望id 看好友列表
    // 没有愿望id 进入首页
}
main.pageHome = function() {
    $('#home').show();
    main.initSwipper();
    main.mainSwiper.init();
    main.subSwiper.init();
    // 播放视频
    $(document).on('click touchstart', '#video-img', function () {
        $(this).hide();
        $('#video')[0].play();
    })
    // 输入目标
    $(document).on('click touchstart', '#input-target', function () {
        $("#input-tips").hide();
    })
    // 选择系统目标
    $(document).on('click touchstart', '.target-text', function () {
        $("#input-tips").hide();
        $('#input-target').val($(this).attr('target-text'));
    })
    // 提交我的目标
    $(document).on('click touchstart', '#submit-target', function () {
        var myTarget = $('#input-target').val();
        var _targetArr = ['工资翻倍收入UP', '规律生活不熬夜', '来一趟海外旅行', '脱单狂撒狗粮', '练就腹肌马甲线', '多点时间陪家人', '佛系养生不拖延', '光明正大跳广场舞', '脱贫脱肉不脱发'];
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
                $('.share-pic-layer').fadeIn();
                _targetArr = main.sort(_targetArr);
                if (_targetArr.indexOf(myTarget) === -1) {
                    _targetArr[5] = myTarget;
                }
                var saveTargetArr = main.Randomwish(_targetArr, domArrShare, domArrPic);
                var nickname = main.nickname || main.UT.getCookie('nickname');
                var avatarUrl = main.headimgurl || main.UT.getCookie('headimgurl');
                $('#selectSharewayPage').show().css('z-index', 20);
                $('#generatePic').show().css('opacity', 1);
                main.initUserinfo('.t-userinfo-nickname', '.t-userinfo-avatar', nickname, avatarUrl);
                main.api.saveUserWish({
                    'openid': main.openid || main.UT.getCookie('openid'),
                    'wish': myTarget,
                    'all_wish': saveTargetArr.toString()
                });
                var shareOpenid = main.openid || main.UT.getCookie('openid');
                var shareMywishid = main.mywishid || main.UT.getCookie('mywishid');
                var shareLink = main.txktUrl + '?openid='+shareOpenid+'&wishid='+shareMywishid;
                var resetShareOpt = {
                    title: '你能猜中我2018年的目标吗?',
                    desc: '我想的希望你也知道',
                    link: shareLink,
                    imgUrl: '',
                }
                main.generateCode(shareLink);
                main._resetShare(resetShareOpt);
                main.pageSelectShare();
                $('.share-pic-layer').fadeOut();
                $('#home').hide();
            }
        }
    });
}
main.pageSelectShare = function () {
    // 选择分享方式
    // 1.右上角分享
    $(document).on('click touchstart', '#share-ta-btn', function() { 
        $('.share-ta-layer').fadeIn("slow");
        // var shareOpenid = main.openid || main.UT.getCookie('openid');
        // var shareMywishid = main.mywishid || main.UT.getCookie('mywishid');
        // var resetShareOpt = {
        //     title: '你能猜中我2018年的目标吗?',
        //     desc: '我想的希望你也知道',
        //     link: main.txktUrl + '?openid='+shareOpenid+'&wishid='+shareMywishid,
        //     imgUrl: '',
        // }
        // main._resetShare(resetShareOpt);
    })
    $(document).on('click touchstart', '.share-ta-layer', function() { 
        $(this).toggle();
    })
    // 2.生成图片分享
    $(document).on('click touchstart', '#share-pic-btn', function() { 
        main.takeScreenshot();
        $('.share-pic-layer').fadeIn("slow");
        setTimeout(function () {
            $('.share-pic-layer').hide();
        }, 4000)
    })
    $(document).on('click touchstart', '.save-pic-layer', function() { 
        $(this).toggle();
    })
}
main.pageFriendGuess = function (data) {
    // 如果是朋友点进来 猜目标
    var d = data;
    main.wish = d.data.wish_info.wish;
    main.wishid = d.data.wish_info.wishid;
    var allWishArr = d.data.wish_info.all_wish;
    var nickname = d.data.nickname;
    var avatarUrl = d.data.headimgurl;
    var domArrGuess = $('.g-nine-text');
    var caiIndex = 0;
    var caiTargetObj = [
        { MOqibaifen: "100%", MOqiText: "我平时真没白疼你" },
        { MOqibaifen: "80%", MOqiText: "再加把劲！我们的默契就满分了！" },
        { MOqibaifen: "80%", MOqiText: "再加把劲！我们的默契就满分了！" },
        { MOqibaifen: "60%", MOqiText: "咦，没想到你这么了解我" },
        { MOqibaifen: "60%", MOqiText: "咦，没想到你这么了解我" },
        { MOqibaifen: "40%", MOqiText: "你这样会失去本宝宝的" },
        { MOqibaifen: "40%", MOqiText: "你这样会失去本宝宝的" },
        { MOqibaifen: "20%", MOqiText: "真是塑料姐妹情呀" },
        { MOqibaifen: "20%", MOqiText: "真是塑料姐妹情呀" }
    ];
    main.UT.setCookie('wishid', main.wishid);
    // 初始化用户信息
    main.initUserinfo('.g-userinfo-nickname', '.g-userinfo-avatar', nickname, avatarUrl);
    // 初始化待猜的目标
    for(var i=0; i<allWishArr.length; i++){
        (function(i){
            if(allWishArr[i] === main.wish){
                // 正确目标
                $('.g-nine-text')[i].attr('wishid', main.wishid);
            }
            $('.g-nine-text')[i].text(allWishArr[i]);
        })(i)
    }
    $('#home').hide();
    $('#friendGuess').show();

    // 朋友猜
    $(document).on('click touchstart', '.g-nine-target', function () {
        var guessed = $(this).attr('guessed')
        var guessTarget = $(this).find('.g-nine-text').text();
        var $error = $(this).find('.guess-error')
        if (guessed === "true") {
            return false;
        } else {
            $(this).attr("guessed", "true");
            if (guessTarget === main.wish) {
                // 猜对了 存好友猜的结果
                var moqifen = caiTargetObj[caiIndex].MOqibaifen;
                var guessOpenid = main.openid || main.UT.getCookie('openid');
                var guessWishid = $(this).attr('wishid') || main.wishid || main.UT.getCookie('wishid');
                $('#guess-mqd-text').text(moqifen);
                $('#guess-desc-text').text(caiTargetObj[caiIndex].MOqiText);
                main.api.saveGuessWish({
                    'wishid': guessWishid,
                    'openid': guessOpenid,
                    'score': moqifen
                })
                $('.guess-right-layer').fadeIn();
            } else {
                $error.fadeIn('slow');
            }
            caiIndex++;
        }
    });
    // 猜过后生成我的目标
    $(document).on('click touchstart', '#generate-mytarget', function () {
        main.UT.delCookie('openid');
        main.UT.delCookie('friendOpenid');
        main.UT.delCookie('wishid');
        main.UT.delCookie('wish');
        main.UT.delCookie('mywishid');
        $('#friendGuess').hide();
        $('.guess-right-layer').hide();
        main.pageHome();
    })
};
main.pageGuessList = function(data) {
    // var d = {
    //     "code":200,
    //     "msg":"",   
    //     "data":{
    //      "nickname":"该目标创建者的昵称",
    //      "headimgurl":"该目标创建者的头像地址",
    //      "is_self":1, 
    //      "friendList":[
    //       {
    //        "nickname":"昵称",
    //        "headimgurl":"头像地址",
    //        "score":"默契值"
    //       },
    //       {
    //         "nickname":"昵称",
    //         "headimgurl":"头像地址",
    //         "score":"默契值"
    //        },
    //        {
    //         "nickname":"昵称",
    //         "headimgurl":"头像地址",
    //         "score":"默契值"
    //        }
    //      ]
    //     }
        
    //    }
    var d = data;
    var friendList = d.data.friendList;
    $('#friendlist-myavatar').attr('src', d.data.headimgurl);
    $('#friendlist-mynickname').attr('src', d.data.nickname);
    if(friendList.length > 0){
        var resultHtml = '';
        for(var i=0; i<friendList.length; i++) {
            var sHtml = "<div class='guessed-friend'>" +
                            "<div class='guessed-friend-info fl'>" +
                                "<div class='guessed-friend-avatar fl'>" +
                                    "<img src='"+ friendList[i].headimgurl +"' class='wid100'>" +
                                "</div>" +
                                "<div class='guessed-friend-name fl'>"+ friendList[i].nickname +"</div>" +
                            "</div>"+
                            "<div class='guessed-friend-moqi fl'>"+ friendList[i].score +"</div>" +
                        "</div>"
            resultHtml += sHtml;
        }
        $('.have-friend').append(resultHtml);
        $('.have-friend').show();
        $('.no-friend').hide();
    } else {
        $('.have-friend').hide();
        $('.no-friend').show();
    }
    $('#guessResultList').fadeIn();
    // 再玩一次
    $(document).on('click touchstart', '#target-restart', function () {
        main.UT.delCookie('openid');
        main.UT.delCookie('friendOpenid');
        main.UT.delCookie('wishid');
        main.UT.delCookie('wish');
        main.UT.delCookie('mywishid');
        $('#guessResultList').hide();
        main.pageHome();
    })
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
            async: false,
            data: {
                code: code
            },
            success: function (d) {
                console.log('success getUserInfoByCode')
                console.log(d);
                main.openid = d.data.openid;
                main.nickname = d.data.nickname;
                main.headimgurl = d.data.headimgurl;
                main.UT.setCookie('openid', main.openid);
                main.UT.setCookie('nickname', main.nickname);
                main.UT.setCookie('headimgurl', main.headimgurl);
            },
            error: function (d) {
                console.log('error getUserInfoByCode')
                console.log(d);
            },
            complete: function () {
                $(".ajaxLayer").fadeOut();
            }
        })
        console.log('ajax end')
    },
    // /api/v1/get_js_config
    /**
     * 获取js config
     * @param {String} code
     */
    getJsConfig: function (opt) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "post",
            url: main.proxy + "/api/v1/get_js_config",
            async: false,
            data: {
                url: opt.url,
                openid: opt.openid
            },
            success: function (d) {
                main.initShareInfo(d.data);
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
     * 根据openid,wish_openid,wishid获取用户身份和愿望
     * @param {String} openid 
     */
    getUserWish: function (opt) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "get",
            url: main.proxy + "/api/v1/user_wish",
            async: false,
            data: {
                openid: opt.openid,
                wish_openid: opt.wish_openid,
                wishid: opt.wishid
            },
            success: function (d) {
                console.log(d);
                if(d.data.is_self === 0) {
                    // 朋友
                    main.pageFriendGuess(d);
                } else if (d.data.is_self === 1) {
                    // 自己
                    main.pageGuessList(d);
                }
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
     * 保存用户自己的愿望和九个要猜的愿望
     * @param {String} openid 
     */
    saveUserWish: function (opt) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "post",
            url: main.proxy + "/api/v1/user_wish",
            async: false,
            data: {
                openid: opt.openid,
                wish: opt.wish,
                all_wish: opt.all_wish,
            },
            success: function (d) {
                console.log(d);
                main.mywishid = d.data.wishid;
                main.UT.setCookie('mywishid', main.mywishid);
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
     * 保存好友猜愿望的结果
     * @param {String} openid 
     */
    saveGuessWish: function (opt) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "post",
            url: main.proxy + "/api/v1/guess_wish",
            async: false,
            data: {
                wishid: opt.wishid,
                openid: opt.openid,
                score: opt.score
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
    main.mainSwiper = new Swiper('.swiper-container-main', {
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
    main.subSwiper = new Swiper('.swiper-container-target', {
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
main._resetShare = function (opt) {
    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: opt.title,
        link: opt.link,
        imgUrl: opt.imgUrl,
        success: function () {
            opt.success()
        },
        cancel: function () {
            opt.cancel()
        }
    });
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: opt.title,
        desc: opt.desc,
        link: opt.link,
        imgUrl: opt.imgUrl,
        type: '',
        dataUrl: '',
        success: function () {
            opt.success()
        },
        cancel: function () {
            opt.cancel()
        }
    });
};
main.initShareInfo = function (data) {
    wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.noncestr,
        signature: data.signStr,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ]
    });
    wx.ready(function () {
        // 微信分享
        // 分享给朋友
        wx.onMenuShareAppMessage({
            title: '你能猜中我2018年的目标吗？', // 分享标题
            desc: '我想的希望你也知道', // 分享描述
            link: '2018.0rh.cn', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '' // 分享图标
        });
        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: '你能猜中我2018年的目标吗？', // 分享标题
            link: '2018.0rh.cn', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
        });
    });
}

main.initUserinfo = function (nickSelector, avatarSelector, nickname, avatarUrl) {
    $(nickSelector).text(nickname);
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
    return _target;

};

main.bindEvent = function () {
    
    // // 选择分享方式
    // // 1.右上角分享
    // $(document).on('click', '#share-ta-btn', function() { 
    //     console.log('邀ta猜');
    //     $('.share-ta-layer').fadeIn("slow");
    //     var shareOpenid = main.openid || main.UT.getCookie('openid');
    //     var shareMywishid = main.mywishid || main.UT.getCookie('mywishid');
    //     var resetShareOpt = {
    //         title: '你能猜中我2018年的目标吗?',
    //         desc: '我想的希望你也知道',
    //         link: main.txktUrl + '?openid='+shareOpenid+'&wishid='+shareMywishid,
    //         imgUrl: '',
    //     }
    //     main._resetShare(resetShareOpt);
    // })
    // $(document).on('click', '.share-ta-layer', function() { 
    //     $(this).toggle();
    // })
    // // 2.生成图片分享
    // $(document).on('click', '#share-pic-btn', function() { 
    //     console.loh('生成图片猜')
    //     main.takeScreenshot();
    //     $('.share-pic-layer').fadeIn("slow");
    //     setTimeout(function () {
    //         $('.share-pic-layer').hide();
    //     }, 4000)
    // })
    // $(document).on('click', '.save-pic-layer', function() { 
    //     $(this).toggle();
    // })
}
main.init();