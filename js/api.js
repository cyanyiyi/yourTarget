; (function () {

    main.getUserInfoFriendList = function (openid, timeStamp, user, friendOpenid) {

        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "post",
            url: "../getUserInfoFriendList",
            data: {
                "openid": openid,
                "timeStamp": timeStamp,
                "user": user  //self 或者 friend   （ 自己 或者 朋友 ）
            },
            datatype: "json",

            success: function (Result) {
                // console.log(Result);
                $(".ajaxLayer").fadeOut();
                // 三处同时使用这一个借口  friendOpenid判断结果页    user判断朋友猜  还是自己看点开的好友列表也

                if (Result.isSuccess == true && Result.code == 0 && Result.data) {



                    if (friendOpenid != null) {


                        //结果页面
                        return;
                    }

                    if (user == "self") {

                        var friendListObj = Result.data.friendList;
                        // $(".PMxinyuan").html(Result.data.desireStr);

                        if (friendListObj == '') {
                            $(".Pm-conBody").append("<p style='font-size: 25px;width: 350px;'><img src='img/noList.png' class='ab-c-w' style='top:-50%'></p>");
                            return;
                        }

                        var PmHtml = function (friendHeadUrl, friendNickName, friendOpenid) {

                            var FriendNickNameG;
                            try {
                                FriendNickNameG = decodeURIComponent(friendNickName);
                            } catch (e) {  //fresh
                                FriendNickNameG = "fresh";
                            }

                            var html = '<div class="PmText" dataOpenid="' + friendOpenid + '"><div class="userHeader"><img src="' + friendHeadUrl + '" alt=""> ' +
                                '</div> <div class="userName">' + FriendNickNameG + '</div>  </div>';
                            $(".Pm-conBody").append(html);

                            // var html = '<div class="PmText"><div class="userHeader"><img src="' + friendHeadUrl + '" alt=""> ' +
                            //     '</div> <div class="userName">friendNickName</div> <div class="userHeart"> <img src="img/xin.png" alt=""> ' +
                            //     '<img src="img/xin.png" alt=""> <img src="img/xin.png" alt=""> </div> <div class="userGx">(默契爆表) </div> </div>';
                            // $(".Pm-conBody").append(html)

                        };


                        $.each(friendListObj, function (i, j) {
                            // console.log(j);
                            PmHtml(j.friendHeadUrl, j.friendNickName, j.friendOpenid);
                        });

                        var Scroll = new iScroll("Pm-conBody2", { hScrollbar: false, vScrollbar: true, hideScrollbar: false });

                        main.page7();
                        //自己进来  获取好友列表
                        return;
                    }

                    if (user == "friend") {
                        // 好友猜一猜  返回正确心愿  头像 名称
                        $(".page-4").css("display", "block");
                        main.p4Data.correct = Result.data.desireStr;
                        main.host.headUrlStr = Result.data.headUrlStr;
                        main.host.nickNameStr = Result.data.nickNameStr;
                        main.page4(Result.data.headUrlStr, Result.data.nickNameStr);

                        //朋友猜页面
                    }





                } else {
                    // // 没有心愿时
                    // if (user == "self" && Result.code == 5051) {
                    //     $(".Pm-conBody").html(Result.errMsg)
                    // } else {
                    //     // alert("发生了点意外:" + Result.errMsg)
                    //     alert("网络不给力,请您刷新后重试!")
                    // }

                    if (Result.code == "5051") {
                        alert("用户在对应时段未发表心愿");
                    } else if (Result.code == "5053") {
                        alert("该朋友信息不存在")
                    } else {
                        alert("网络不给力,请您刷新后重试!");
                    }

                }




            },
            error: function (Result) {
                alert("网络不给力！");

            },
            complete: function () {
                $(".ajaxLayer").fadeOut();
            }
        });


    };




    // 提交心愿
    main.Register = function (openid, nickName, headUrl, desire, timeStamp, BtnDOM) { //写 留言
        main.btnDisable(BtnDOM);
        $.ajax({
            type: "post",
            url: "../setUserInfo",
            data: {
                "desire": desire,
                "openid": openid,
                "nickName": nickName,
                "headUrl": headUrl,
                "timeStamp": timeStamp
                // "userStatus": userStatus
            },
            datatype: "json",
            success: function (Result) {
                // console.log(Result);
                var $subXinYPage = $(".subXinYPageImg");
                if (Result.isSuccess == true && Result.code == 0) {



                    var $link = 'http://valentinesday.comeyes.cn/index.html?friendOpenid=' + openid + "&timeStamp=" + timeStamp;
                    var $imgUrl = "http://valentinesday.comeyes.cn/img/FXIMG.jpg";
                    _setShare("Fresh | 你懂我的心吗", "专属我们的七夕，你猜我的心愿是什么？", $link, $imgUrl, function () {
                        ga('send', 'event', 'valentinesday', 'H5', "Share2");
                        window.location.href = "http://valentinesday.comeyes.cn/index.html?friendOpenid=" + openid + "&timeStamp=" + timeStamp;
                    }, function () {

                    });


                    // 分享用     链接上的
                    main.host.timeStamp = Result.data.timeStamp;

                    setTimeout(function () {
                        $subXinYPage.addClass("subXinYPageAni");
                    }, 3000);

                    // 动画开始时事件
                    $subXinYPage[0].addEventListener("webkitAnimationStart", function () {
                        // console.log("subXinYPageAni动画开始");
                    });
                    // 动画结束时事件
                    $subXinYPage[0].addEventListener("webkitAnimationEnd", function () {
                        // console.log("subXinYPageAni动画结束");
                        $(".page-2").fadeOut();
                        $('.subXinYPage').fadeOut();


                        main.page3();


                    })
                } else {
                    //询问  errMsg  属性名
                    $(".page-2").fadeIn();
                    $(".subXinYPage").fadeOut();
                    $(".page2Error").html(Result.errMsg);
                    alert(Result.errMsg);

                }

                // Object {isSuccess: true, code: 0, data: Object}
            },
            error: function (Result) {
                alert("网络不给力！");

            },
            complete: function () {
                main.btnDisable(BtnDOM);
            }
        });
    };

    // 在 朋友和自己的页面里 都获取 用户心愿。   (自己点自己的链接进来还需要获取朋友列表 ：头像，昵称，状态 )
    main.setFriendList = function (openid, timeStamp, friendOpenid, friendNickName, friendHeadUrl, friendStatus) { //得到留言
        // alert(openid); alert(timeStamp); alert(friendOpenid); alert(friendNickName); alert(friendHeadUrl); alert(friendStatus);
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "post",
            url: "../setFriendList",
            data: {
                "openid": openid,
                "timeStamp": timeStamp,
                "friendOpenid": friendOpenid,
                "friendNickName": friendNickName,
                "friendHeadUrl": friendHeadUrl,
                "friendStatus": friendStatus
            },
            datatype: "json",
            success: function (Result) {
                // console.log(Result);
                $(".ajaxLayer").fadeOut();
                if (Result.isSuccess == true && Result.code == 0) {
                    // 保存成功
                    $(".page4Error,.caiYes").fadeIn();
                    $(".page-4").css({
                        "filter": "blur(5px)",
                        "-webkit-filter": "blur(5px)"
                    });

                    var $link = "http://valentinesday.comeyes.cn/endPage.html?hostOpenid=" + openid + "&timeStamp=" + timeStamp + "&friendOpenid=" + friendOpenid;
                    var $imgUrl = "http://valentinesday.comeyes.cn/img/FXIMG.jpg";
                    _setShare("Fresh | 七夕心愿TA来猜", "前方高能，一波狗粮正在来袭~", $link, $imgUrl, function () { }, function () { });

                } else {
                    // Result.errMsg
                    alert(Result.errMsg)
                    // alert("网络异常,请刷新后重试")
                }
            },
            error: function (Result) {
                alert("网络不给力！");

            },
            complete: function () {
                $(".ajaxLayer").fadeOut();
            }
        });
    };

    var oAuthUrl = "http://wechat.fresh.com/get-weixin-code.html?appid=wxecb7a88c6c3090c5&scope=snsapi_userinfo&state=hello-world&redirect_uri=" + encodeURIComponent(window.location.href);

    main.Auth = function (code) {
        $(".ajaxLayer").fadeIn();
        $.ajax({
            type: "get",
            url: "../oauth",
            data: { "code": code },
            datatype: "json",
            success: function (Result) {
                // console.log(Result);
                $(".ajaxLayer").fadeOut();
                if (Result.isSuccess == true && Result.code == 10000) {
                    // 授权信息赋值
                    // main.userData = Result.data;
                    UT.setCookie("freshOpenid", Result.data.openid);//设置 Cookie
                    UT.setCookie("freshHeadimgurl", Result.data.headimgurl);//设置 Cookie
                    UT.setCookie("freshNickname", Result.data.nickname);//设置 Cookie

                    console.log(Result.data.nickname);


                    if (Result.isSuccess == true && Result.data.errcode == 40001) {
                        window.location.href = oAuthUrl;
                    }

                    $(document).ready(function () {

                        main.init();
                    })
                } else {


                    alert("网络不给力哦！");
                }

            },
            error: function (Result) {
                alert("网络不给力！");

            },
            complete: function () {
                $(".ajaxLayer").fadeOut();
            }
        });
    };


    /**/
    var linkUrl = "http://valentinesday.comeyes.cn/";

    if (window.location.href.indexOf("chinacloudsites") != -1) {
        linkUrl = "http://fresh-valentinesday.chinacloudsites.cn/";
    }

    var openid = UT.getCookie("freshOpenid");// 从 Cookie 取 授权openid

    if (!openid) {
        var code = UT.GetUrl("code"); // oAuthUrl 跳回来会带 code
        if (code) {
            main.Auth(code);
            // console.log("获取code:")
        } else {
            window.location.href = oAuthUrl;
        }
    } else {


        $(document).ready(function () {

            main.init();

            // console.log(openid)
            // console.log("有openid:")
        })


    }
}());
