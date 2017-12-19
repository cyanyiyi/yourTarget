//----------------------------
//
// main.js
// 创奇世界h5
// 业务逻辑
//
//----

var cqsj = {};

cqsj.url = window.location.href;
cqsj.userCode;
cqsj.userName = "";
cqsj.userAvatar = "";
cqsj.tel = "";
cqsj.imgs = [
    'http://ome0dl4la.bkt.clouddn.com/background.jpg',
    'img/preview-apk.jpg'
];
cqsj.per = '';
cqsj.newimages = [];
cqsj.count = 0;
cqsj.done = false;

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

cqsj.start = function () {
    cqsj.initShareInfo();
    cqsj.handleLowScreen();
    cqsj.handleImageList();
    cqsj.loadImages();
    cqsj.handleListener();
}

cqsj.initShareInfo = function () {
    var currUrl = cqsj.url.replace(window.location.hash, '');
    $.getJSON('http://www.sphinxcapital.com.cn/wxapi/signature.php?url=' + encodeURIComponent(currUrl)).done(function (data) {
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        });
    });

    wx.ready(function () {
        // 微信分享
        wx.onMenuShareAppMessage({
            title: "《男人装》柳岩带你进入传奇世界",
            desc: "首个最爽战斗嗨趴，邀你来玩！",
            link: "http://www.sphinxcapital.com.cn/cqsj/apk.html",
            imgUrl: 'http://ome0dl4la.bkt.clouddn.com/share_img.png'
        });

        wx.onMenuShareTimeline({
            title: "《男人装》柳岩带你进入传奇世界",
            link: "http://www.sphinxcapital.com.cn/cqsj/apk.html",
            imgUrl: 'http://ome0dl4la.bkt.clouddn.com/share_img.png'
        });
    });
}

// cqsj.checkIfHasUserInfo = function() {
//     // 是否已经授权
//     var hasOauthCode = cqsj.url.indexOf('code=');
//     if (hasOauthCode != -1) {
//         cqsj.userCode = cqsj.url.split('code=')[1].split('&')[0].trim();
//         if (cqsj.userCode != "" || cqsj.userCode != "snsapi_userinfo" || cqsj.userCode != "snsapi_base") {
//             cqsj.getUesrInfo();
//         } else {
//             cqsj.getOauth();
//         }
//     } else {
//         cqsj.getOauth();
//     }
// }

// cqsj.getUesrInfo = function() {
//     $.getJSON('http://www.sphinxcapital.com.cn/wxapi/getUserInfo.php?code=' + cqsj.userCode).done(function(data) {
//         cqsj.userName = data.nickname;
//         cqsj.avatar = data.headimgurl;
//         cqsj.start();
//     }).error(function(data){
//         console.log(data);
//         cqsj.userName = "";
//         cqsj.avatar = "";
//         cqsj.start();
//     });
// }

// // 跳转授权页
// cqsj.getOauth = function() {
//     var currUrl = cqsj.url.replace(window.location.hash, '');
//     window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8e5bbc9c79b5686d&redirect_uri="+encodeURIComponent(currUrl)+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
// }

cqsj.initMovie = function () {
    var video = document.getElementById('video');
    video.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
        video.play();
    }, false);
}

cqsj.handleLowScreen = function () {
    if ($(window).height() < 420) {
        $('body').addClass('low-screen-height');
    } else if ($(window).height() > 600) {
        $('body').addClass('height-screen-height');
    }

    if ($(window).width() / $(window).height() > 0.72) {
        $('body').addClass('low-screen-ratio');
    }
}

// 图片处理，包括是否加载高清图
cqsj.handleImageList = function () {
    // 匹配高清屏
    if (window.devicePixelRatio > 1.5) {
        cqsj.imgs[cqsj.imgs.length] = "sprite/style-index@2x.png";
    } else {
        cqsj.imgs[cqsj.imgs.length] = "sprite/style-index.png";
    }

    cqsj.len = cqsj.imgs.length;
    cqsj.per = (1 / cqsj.len);
}

// 请求图片，核心方法
cqsj.imageloadpost = function () {
    var self = this;
    self.count++;

    // 完成loading
    if (self.count == self.len) {
        setTimeout(function () {
            $('.b-loading__text').addClass('hide');
            $('.b-loading__text-done').addClass('animate');
            $('#button-show').show().addClass('animate');
        }, 2500);
    }
};

// 执行图片加载
cqsj.loadImages = function () {
    var self = this;
    for (var i = 0; i < self.len; i++) {
        self.newimages[i] = new Image();
        self.newimages[i].src = self.imgs[i];
        self.newimages[i].onload = function () {
            self.imageloadpost();
        }
        self.newimages[i].onerror = function () {
            self.imageloadpost();
        }
    }
};

cqsj.switchPageWithTransition = function (from, to, duration) {
    $(from).animate({ opacity: 0 }, duration, function () {
        $(from).css('opacity', 1);
        $(from).addClass('hide');
        $(to).removeClass('hide');
    });
}

cqsj.handleListener = function () {

    $('#button-show').on('click', function () {
        cqsj.switchPageWithTransition('.b-page-loading', '.b-page-movie', 200);

        var loadingInterval_index = 0;
        var loadingInterval = setInterval(function () {
            if (loadingInterval_index == 0) {
                $('#video-loading').text("正在加载.");
            } else if (loadingInterval_index == 1) {
                $('#video-loading').text("正在加载..");
            } else {
                $('#video-loading').text("正在加载...");
            }
            loadingInterval_index = ++loadingInterval_index % 3;
        }, 500);

        var video = document.getElementById('video');
        video.play();

        // $video.on('waiting', function(){
        // });

        var $video = $('#video');
        $video.on('playing', function () {
            clearInterval(loadingInterval);
            $('.b-video__placeholder').addClass('hide');
            $('#button-skip').removeClass('hide');
        });

        $video.on('ended', function () {
            cqsj.switchPageWithTransition('.b-page-movie', '.b-page-generate', 300);

            setTimeout(function () {
                $('.b-page-generate').addClass('animate');
            }, 300);
        });
    });

    $('#button-again').click(function () {
        cqsj.switchPageWithTransition('.b-page-edit', '.b-page-movie', 400);

        $('#video')[0].play();

        $('#video').bind('ended', function () {
            cqsj.switchPageWithTransition('.b-page-movie', '.b-page-edit', 300);
        });
    });

    $('#button-skip').click(function () {
        var video = document.getElementById('video');
        video.pause();

        if (cqsj.done) {
            cqsj.switchPageWithTransition('.b-page-movie', '.b-page-edit', 300);
        } else {
            cqsj.switchPageWithTransition('.b-page-movie', '.b-page-generate', 300);

            setTimeout(function () {
                $('.b-page-generate').addClass('animate');
            }, 300);
        }
    });

    // 获取电话
    // $('#button-generate').click(function() {
    //     var tel = $('#input').val();
    //     if(!(/^1[34578]\d{9}$/.test(tel))){
    //         $('#input-shake').addClass('animate');
    //         $('body').addClass('error');
    //         return false;
    //     } else {
    //         $('#input-shake').removeClass('animate');
    //         $('body').removeClass('error');
    //     }

    //     cqsj.tel = tel;
    //     cqsj.generateImage();
    //     cqsj.done = true;

    //     $('.b-page-generate .b-option').addClass('hide');
    //     $('.b-page-generate .b-option-done').removeClass('hide');

    //     cqsj.sendToServerWithTelephoneAndName(cqsj.tel, cqsj.userName);

    //     // 进入分享页
    //     setTimeout(function(){
    //         cqsj.switchPageWithTransition('.b-page-generate', '.b-page-edit', 400);
    //     }, 2500);
    // });

    $('#input').bind('focus', function () {
        if ($('body').hasClass('error')) {
            $('#input-shake').removeClass('animate');
            $('body').removeClass('error');
        }
    });

    // 获取姓名
    $('#button-generate').click(function () {
        var value = $('#input').val();
        if (value == "") {
            $('#input-shake').addClass('animate');
            $('body').addClass('error');
            return false;
        } else {
            $('#input-shake').removeClass('animate');
            $('body').removeClass('error');
        }

        cqsj.userName = value;
        cqsj.generateImage();
        cqsj.done = true;

        $('.b-page-generate .b-option').addClass('hide');
        $('.b-page-generate .b-option-done').removeClass('hide');

        // 进入分享页
        setTimeout(function () {
            cqsj.switchPageWithTransition('.b-page-generate', '.b-page-edit', 400);
        }, 2500);
    });
}

// cqsj.sendToServerWithTelephoneAndName = function(telphone, name) {
//     $.getJSON('http://www.sphinxcapital.com.cn/wxapi/saveToDatabase.php?telphone=' + telphone + '&nickname=' + name).done(function(data) {
//         console.log(data);
//     });
// }

// 生成邀请函图片
cqsj.generateImage = function () {
    var browserWidth = 666;
    var browserHeight = 666;
    $('#canvas').css({ 'width': browserWidth, 'height': browserHeight });

    var canvas = document.getElementById("canvas");
    canvas.width = browserWidth * 2;
    canvas.height = browserHeight * 2;
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = 'img/preview-apk.jpg';
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 加自定义内容
        ctx.font = '50px verdana';
        ctx.textAlign = "center";
        ctx.fillStyle = "#E9E1C9";

        ctx.save();

        //transform(X_scale, X_skew, Y_skew, Y_scale, dx, dy) 
        ctx.transform(1, 0, 0, 1, browserWidth - 63, browserHeight - 50);
        ctx.rotate(Math.PI / 27);

        ctx.fillText(cqsj.fittingString(ctx, cqsj.userName, 400), 0, 0);
        ctx.restore();

        // 转化为图片
        var strDataURI = canvas.toDataURL("image/jpeg");
        $('.b-preview__canvas').attr('src', strDataURI);
    }
}

cqsj.fittingString = function (c, str, maxWidth) {
    var width = c.measureText(str).width;
    var ellipsis = '…';
    var ellipsisWidth = c.measureText(ellipsis).width;
    if (width <= maxWidth || width <= ellipsisWidth) {
        return str;
    } else {
        var len = str.length;
        while (width >= maxWidth - ellipsisWidth && len-- > 0) {
            str = str.substring(0, len);
            width = c.measureText(str).width;
        }
        return str + ellipsis;
    }
}

// 需求变更，先关闭登陆态
// cqsj.checkIfHasUserInfo();
cqsj.start();
