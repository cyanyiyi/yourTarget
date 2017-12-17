/**
 *住账户分享后  地址带 friendOpenid  timeStamp  自己点进来显示与好友默契
 *朋友点进来显示猜心愿
 *
 */

var main = {
    // 进入页面授权信息
    userData: {
        // city: "浦东新区",
        // country: "中国",
        // headimgurl: "http://wx.qlogo.cn/mmopen/YX1cV0PXqJGKIqw8CmlU6Sg4WfOc7hBH5QHFFLex4uW7mCFfnOmu8UKXb8Vupz2BIV8n999fNxWqjYV5nHmk5uiaSv3IYRvAa/0",
        // language: "zh_CN",
        // nickname: "华轩",
        // openid: "oYzhat4jd8FFR2IKPUEderKz8CoE",
        // privilege: Array[0],
        // province: "上海",
        // sex: 1
    },
    // 主账户
    host: {
        headUrlStr: "",
        nickNameStr: "",
        // 主账户心愿
        correct: '',
        // 提交心愿成功后的返回时间戳
        timeStamp: ""

    },

    p4Data: {
        // 正确心愿
        correct: ""
    }

};


main.init = function () {

    main.clickType = document.hasOwnProperty("ontouchstart") ? "touchstart" : "click";


    // 区分主账号页面  ?friendOpenid=abc&timeStamp=1502353182256&lookShareList=3
    main.pageType(main.getQueryString("friendOpenid"), main.getQueryString("timeStamp"), main.getQueryString("lookShareList"));


    if ($(document).height() <= 1125) {
        // console.log($(document).height())
        $(".contentBody ,.page5Con").addClass("seclaTran")
    }


    main.page1();


};

// 区分主账号页面  和  分享后朋友猜野蛮
main.pageType = function (friendOpenid, timeStamp, lookShareList) {



    var UserfreshOpenid = UT.getCookie("freshOpenid");

    // 猜一猜
    if ((window.location.href).indexOf(friendOpenid) > 0 && (window.location.href).indexOf(timeStamp) > 0 && UserfreshOpenid != friendOpenid && (window.location.href).indexOf(lookShareList) == -1) {
        // 朋友分享页面  显示好友猜一猜

        $(".page4Con5").css({
            "top": "15%",
            "left": "-10%",
            "z-index": 2,
            "-webkit-transform": "rotate(-5deg)",
            "-moz-transform": "rotate(-5deg)",
            "-ms-transform": "rotate(-5deg)",
            "-o-transform": "rotate(-5deg)",
            "transform": "rotate(-5deg)"
        });
        main.getUserInfoFriendList(friendOpenid, timeStamp, "friend", null);  ////self 或者 friend   （ 自己 或者 朋友 ）
        // console.log("朋友分享页面  显示好友猜一猜");
        ga('send', 'event', 'valentinesday', 'H5', "Page5");


        return false;
    }
    // 二次分享的好友列表
    // if ((window.location.href).indexOf(friendOpenid) > 0 && (window.location.href).indexOf(timeStamp) > 0 && (window.location.href).indexOf(lookShareList) > 0 && UserfreshOpenid != friendOpenid) {
    //     $(".page-7").css("display", "block");
    //     main.getUserInfoFriendList(friendOpenid, timeStamp, "friend",null);  ////self 或者 friend   （ 自己 或者 朋友 ）
    //     console.log("二次分享的好友列表")
    //     return false;
    // }

    // 自己进自己的分享链接
    if (UserfreshOpenid == friendOpenid) {

        $(".page-7").css("display", "block");
        main.page7();
        ga('send', 'event', 'valentinesday', 'H5', "Page11");

        main.getUserInfoFriendList(friendOpenid, timeStamp, "self", null);  ////self 或者 friend   （ 自己 或者 朋友 ）
        // console.log("自己进自己的分享链接");

        return false;
    }

    // 正常写心愿
    if ((window.location.href).indexOf(friendOpenid) == -1 && (window.location.href).indexOf(timeStamp) == -1 && (window.location.href).indexOf(lookShareList) == -1) {
        $(".page-1").css("display", "block");
        // console.log("正常写心愿")
    }


};

// 首页
main.page1 = function () {

    ga('send', 'event', 'valentinesday', 'H5', "Page1");

    // 关闭规则页
    main.Bind(".closeRulse", function () {
        $(".page-1Rules").fadeOut();
        $(".page-1").fadeIn();
    });

    // 打开规则页
    main.Bind("#page1Rules", function () {
        $(".page-1").fadeOut();
        $(".page-1Rules").fadeIn();
        ga('send', 'event', 'valentinesday', 'H5', "Page2");

    });

    // 去提交心愿
    main.Bind("#MakeWish", function () {
        $(".page-1").fadeOut();
        $(".page-2").fadeIn();
        ga('send', 'event', 'valentinesday', 'H5', "start");

        // 引导填写动画
        main.page2Ani();
        // tip

    });



};

// 页面二许愿
main.page2 = function () {
    ga('send', 'event', 'valentinesday', 'H5', "Page3");

    // 光标落入清空值
    $("#page2Text").focus(function () {
        $(this).val('');
    });
    var vla_13 = '';
    UT.Query("#page2Text").oninput = function () {
        if (GetLength(this.value) <= 13) {
            vla_13 = this.value;
        } else {
            this.value = vla_13;
        }
    };
    function GetLength(str) {
        return str.replace(/[^\x00-\xff]/g, "aa").length;
    }

    // main.page2Ani();//ce

    // var WishArr = ["乘热气球", "共进烛光晚餐", "做一对猫奴", "体验极限运动", "做背包客", "看演唱会", "回家见爸妈", "承包电影院", "freestyle"];
    // $(".formBody ul li").on(main.clickType, function () {
    //
    //     $("#page2Text").val(WishArr[$(this).index()]);
    //
    //     console.log(WishArr[$(this).index()])
    //
    // });



    var sw = new Sswiper('#swiperBox1', {
        //stopProp:false, //stopPropagation   没有被其他才Sswiper嵌套 ，stopProp不必写，或为false
        width: 630, //若宽不是100% ，请设置具体的宽
        height: 180, //若高不是100% ，请设置具体的高
        prevButton: '.swiper-button-prev', //默认.swiper-button-prev
        nextButton: '.swiper-button-next', //默认.swiper-button-next
        //initialSlide:0, //初始化显示第几页   if(len <= optional.initialSlide){ self.activeIndex = 0;}
        direction: "horizontal",// vertical 是垂直 ，horizontal 或者默认是水平
        loop: true, //是否循环
        // autoplay:2000, //单位 ms  自动循环播放 ，要在循环模式下使用
        //pagination:'.swiper-pagination',//小圆点
        //speed:300, //单位 ms 运动一屏的速度
        //easing:'ease-out',  // linear ease-in ease-out 运动缓冲
        //slowDown:false, //首尾页 拖动是否可以缓冲 ，在 不循环模式下使用不缓冲
        onSlideChangeStart: function (index) {
            //console.log('swiper Start--||' + index);
        },
        onSlideChangeEnd: function (index) {
            //console.log('swiper End--||' + index);
        }
    });



    var WishArr = ["乘热气球", "共进烛光晚餐", "做一对猫奴", "体验极限运动", "做背包客", "看演唱会", "回家见爸妈", "承包电影院", "freestyle"];

    // 提供的选项     选择
    $(".dataText").on("click", function () {
        if (!sw.isReady()) {
            // alert("滑动中阻止其他操作")
            return false;
        } else {

            $("#page2Text").val($(this).attr("dataText"));
            // console.log($(this).attr("dataText"))
        }


    });

    // 提交心愿

    $("#SubmitWish").unbind("click").click(function () {

        // });

        // main.Bind("#SubmitWish", function () {
        // alert("心愿是:"+$("#page2Text").val());
        // 主账户心愿

        var $page2TextVal = $("#page2Text").val();

        if ($page2TextVal == '') {
            // alert("输入心愿让TA猜猜吧");
            // console.log("输入心愿让TA猜猜吧");
            $(".page2Error").html('输入心愿让TA猜猜吧');
            setTimeout(function () {
                $(".page2Error").html('');
            }, 3000);
            return;
        }




        if (!(/^([\u4E00-\u9Fa5]|[a-zA-Z]|\d|\s)*$/.test($page2TextVal))) {

            $(".page2Error").html('心愿格式支持汉字,字母,数字');
            setTimeout(function () {
                $(".page2Error").html('');
            }, 3000);
            return;
        }
        $(".page2Error").html('');

        // function isName(v) {
        //     return (); //汉字 字母  数字  空格
        // }

        ga('send', 'event', 'valentinesday', 'H5', "submit");

        main.p4Data.correct = $page2TextVal;

        // $(".page-2").fadeOut();
        var $subXinYPage = $(".subXinYPage");
        $subXinYPage.fadeIn();
        // var openid = "abc";
        // var nickName = "哈哈";
        // var headUrl = "http";
        // var desire = "心愿";
        // alert( [2,1,3].indexOf(0))
        // var userStatus = WishArr.indexOf(main.host.correct) == -1 ? 1 : 3;   //指定数组不需要审核
        var timeStamp = new Date().getTime();
        // UT.setCookie("freshOpenid", Result.data.openid);//设置 Cookie
        // UT.setCookie("freshHeadimgurl", Result.data.headimgurl);//设置 Cookie
        // UT.setCookie("freshNickname", Result.data.nickname);//设置 Cookie

        console.log(UT.getCookie("freshNickname"));

        main.Register(UT.getCookie("freshOpenid"), UT.getCookie("freshNickname"), UT.getCookie("freshHeadimgurl"), main.p4Data.correct, timeStamp, $("#SubmitWish"));


        // 本地测试
        // $(".subXinYPage").fadeOut();
        // main.page3();


    });


};

//提交后自己看到的心愿墙   许愿墙
main.page3 = function () {
    // 朋友打开祝福随机 domArr 内容容器  blessing祝福数组 correct正确祝福

    var domArr = [".ZF-text1", ".ZF-text2", ".ZF-text3", ".ZF-text4", ".ZF-text6", ".ZF-text7", ".ZF-text8", ".ZF-text9"];
    var blessingArr = ["迪士尼看烟花", "王者开黑", "浪漫摩天轮", "Fresh面部SPA", "看电影", "为爱鼓掌", "Fresh七夕礼盒", "烛光晚餐", "江边夜游轮"];
    if (blessingArr.indexOf(main.p4Data.correct) != "-1") {
        blessingArr.splice(blessingArr.indexOf(main.p4Data.correct), 1)
    }
    main.Randomwish(domArr, blessingArr);
    // 显示对应内容
    $(".page-4,.TiJiaoTopBody,.page4BtnBody").fadeIn();
    // 卡片墙动画
    $(".ZF-text5").html(main.p4Data.correct);
    $(".page4Con5").addClass("P3Anition");

    // 显示分享引导
    $("#page4YQC,.Fx-layer").on("click", function () {
        $(".Fx-layer").toggle();
        ga('send', 'event', 'valentinesday', 'H5', "Share1");

    });


};
//朋友猜页面   朋友点开进来看到的心愿墙
main.page4 = function (P4headerSrc, nickNameStr) {

    ga('send', 'event', 'valentinesday', 'H5', "Page4");

    $(".page-4,.CaiTopBody").fadeIn();

    $(".P4headerImg>img").attr("src", P4headerSrc);
    // decodeURIComponent("yulyulc_%F0%9F%8C%9E")

    try {
        $(".P4headerName").html(decodeURIComponent(nickNameStr));

    } catch (e) {  //fresh
        $(".P4headerName").html("fresh");
    }
    // 朋友打开祝福随机 domArr 内容容器  blessing祝福数组 correct正确祝福
    var domArr = [".ZF-text1", ".ZF-text2", ".ZF-text3", ".ZF-text4", ".ZF-text5", ".ZF-text6", ".ZF-text7", ".ZF-text8", ".ZF-text9"];
    var blessingArr = ["迪士尼看烟花", "王者开黑", "浪漫摩天轮", "Fresh面部SPA", "看电影", "为爱鼓掌", "Fresh七夕礼盒", "烛光晚餐", "江边夜游轮"];

    main.RandomwishCai(domArr, blessingArr, main.p4Data.correct);

    var isClick = false;
    var caiIndex = 0;
    var page4ErrorText = ['还能好好做朋友吗', '友谊的小船说翻就翻', '只想露出没默契的笑容', '卸下你爱我的伪装吧', '没默契=没关系'];
    var xinYTextObj = [
        {MOqibaifen: "100%", MOqiTitle: "天生一对", MOqiText: "命中注定，没有人比你们更相配。"},
        {MOqibaifen: "88%", MOqiTitle: "心有灵犀", MOqiText: "最好的默契莫过于，我心里想的你都懂。"},
        {MOqibaifen: "77%", MOqiTitle: "珠联璧合", MOqiText: "陪伴才是最长情的告白。"},
        {MOqibaifen: "66%", MOqiTitle: "默契正好", MOqiText: "简单的默契，幸福的刚好。"},
        {MOqibaifen: "55%", MOqiTitle: "爱的洒脱", MOqiText: "爱上一匹野马，可我家里没有草原。"},
        {MOqibaifen: "44%", MOqiTitle: "来日方长", MOqiText: "岁月静好,时光不负有心人。"},
        {MOqibaifen: "33%", MOqiTitle: "爱不单行", MOqiText: "手牵手,漫漫长路一起走。"},
        {MOqibaifen: "22%", MOqiTitle: "类似爱情", MOqiText: "嘘~恋爱的气息正在发酵"},
        {MOqibaifen: "11%", MOqiTitle: "人艰不拆", MOqiText: "我终于发现了，你是来找茬的吧？！"}
    ];
    // 选择正确心愿
    $(".page4Bg").on("click", function () {
        caiIndex++;
        if ($(this).attr("data-isClick") == "true") {
            return false;
        } else {

            $(this).attr("data-isClick", "true");
            $(this).find(".ZF_RGBA").fadeIn();

            if ($(this).find(".ZF-text").html() === main.p4Data.correct) {
                ga('send', 'event', 'valentinesday', 'H5', "Page8");

                // console.log("猜对了");
                // console.log(caiIndex);
                $(".MOqiTitle>p>b").html((xinYTextObj[caiIndex - 1]).MOqiTitle);
                $(".MOqiTitle>p>span").html((xinYTextObj[caiIndex - 1]).MOqibaifen);
                $(".MOqiText").html((xinYTextObj[caiIndex - 1]).MOqiText);

                // UT.setCookie("freshOpenid", Result.data.openid);//设置 Cookie
                // UT.setCookie("freshHeadimgurl", Result.data.headimgurl);//设置 Cookie
                // UT.setCookie("freshNickname", Result.data.nickname);//设置 Cookie

                // 自己
                $(".AheaderImg>img").attr("src", UT.getCookie("freshHeadimgurl"));
                // decodeURIComponent
                try {
                    $(".AheaderName").html(decodeURIComponent(UT.getCookie("freshNickname")));
                } catch (e) {  //fresh
                    $(".AheaderName").html("fresh");
                }

                // 主用户
                $(".BheaderImg>img").attr("src", main.host.headUrlStr);

                try {
                    $(".BheaderName").html(decodeURIComponent(main.host.nickNameStr));
                } catch (e) {  //fresh
                    $(".BheaderName").html("fresh");
                }

                // 保存猜状态
                main.setFriendList(main.getQueryString("friendOpenid"), main.getQueryString("timeStamp"), UT.getCookie("freshOpenid"), UT.getCookie("freshNickname"), UT.getCookie("freshHeadimgurl"), caiIndex)
            } else {
                // 猜错

                // $(".P4Text").html($(this).find(".ZF-text").html());
                // 添加模糊层
                $(".page-4").css({
                    "filter": "blur(5px)",
                    "-webkit-filter": "blur(5px)"
                });
                // console.log(caiIndex)
                if (caiIndex == 8) {

                    $(".caiNO").css({
                        "background": "url(../img/page4-caiNo8.png) no-repeat",
                        "height": "315px"
                    });

                    $(".page4Error,.NObtn8Body").fadeIn();

                    ga('send', 'event', 'valentinesday', 'H5', "Page7");

                } else {
                    $(".page4Error,.caiNO").fadeIn();
                    ga('send', 'event', 'valentinesday', 'H5', "Page6");

                }




            }
        }
    });

    //关闭猜错
    $(".caiNO").on("click", function () {
        $(".page4Error,.caiNO").fadeOut();
        $(".page-4").css({
            "filter": "blur(0)",
            "-webkit-filter": "blur(0)"
        });
    });

    // 关闭猜错  8 次

    $(".NObtn8Close").on("click", function () {

        $(".page4Error,.NObtn8Body").fadeOut();
        $(".page-4").css({
            "filter": "blur(0)",
            "-webkit-filter": "blur(0)"
        });
    });

    $(".NObtn8").on("click", function () {
        ga('send', 'event', 'valentinesday', 'H5', "buygift");

        window.location.href = 'http://cn.fresh.com/cn/lipcare-tint-shine-all-tint/freshxbeast%20%E6%BE%84%E7%B3%96%E6%8A%A4%E5%94%87%E7%A4%BC%E7%9B%92(%E9%99%90%E9%87%8F50%E5%A5%97)/H00000828.html#prevPage=menu&start=9&cgid=all-tint';
    });

    // 猜对  查看默契度
    $(".caiYesBtn").on("click", function () {
        $(".page-4").fadeOut();
        $(".page-5").fadeIn();

        ga('send', 'event', 'valentinesday', 'H5', "Page9");
        ga('send', 'event', 'valentinesday', 'H5', "result");

    });
    // 买礼物   猜对页面给惊喜
    $(".giveLove").on("click", function () {
        $(".page-6").fadeIn();
        ga('send', 'event', 'valentinesday', 'H5', "Page10");
        ga('send', 'event', 'valentinesday', 'H5', "purchase");

        var $imgUrl = "http://valentinesday.comeyes.cn/img/FXIMG.jpg";
        _setShare("Fresh | 七夕心愿TA来猜", "七夕来了，你能猜中我的心愿吗？", "http://valentinesday.comeyes.cn/", $imgUrl, function () {
        }, function () {
        })

    });
    // 再猜一次
    $("#P4Again").on("click", function () {
        $(".page4Error").fadeOut();
    });
    // 关闭礼盒
    main.Bind(".boxClose", function () {
        $(".page-6").fadeOut();
        var $link = "http://valentinesday.comeyes.cn/endPage.html?hostOpenid=" + main.getQueryString("friendOpenid") + "&timeStamp=" + main.getQueryString("timeStamp") + "&friendOpenid=" + UT.getCookie("freshOpenid");
        var $imgUrl = "http://valentinesday.comeyes.cn/img/FXIMG.jpg";
        _setShare("Fresh | 七夕心愿TA来猜", "前方高能，一波狗粮正在来袭~", $link, $imgUrl, function () {

        }, function () {

        });

    });
    main.Bind(".boxBtn", function () {
        // alert("秒礼物去了")
        ga('send', 'event', 'valentinesday', 'H5', "giftec");

        window.location.href = "http://cn.fresh.com/cn/lipcare-tint-shine-all-tint/freshxbeast%20%E6%BE%84%E7%B3%96%E6%8A%A4%E5%94%87%E7%A4%BC%E7%9B%92(%E9%99%90%E9%87%8F50%E5%A5%97)/H00000828.html#prevPage=menu&start=9&cgid=all-tint";
    });

    // 我也要玩 P5Iplay
    // main.Bind("#P5Iplay", function () {
    //     // alert("我也要玩");
    //     window.location.href = "index.html";
    // });s

};



main.page7 = function () {

    $(".PmText").on("click", function () {

        var endfriendOpenid = $(this).attr("dataOpenid");
        // console.log($(this).attr("dataOpenid"));
        // main.getQueryString("friendOpenid"), main.getQueryString("timeStamp"),
        window.location.href = "endPage.html?hostOpenid=" + main.getQueryString("friendOpenid") + "&timeStamp=" + main.getQueryString("timeStamp") + "&friendOpenid=" + endfriendOpenid;

    });

    main.Bind(".PMBoxGo", function () {
        // console.log("PMBoxGo")
        window.location.href = "http://cn.fresh.com/cn/lipcare-tint-shine-all-tint/freshxbeast%20%E6%BE%84%E7%B3%96%E6%8A%A4%E5%94%87%E7%A4%BC%E7%9B%92(%E9%99%90%E9%87%8F50%E5%A5%97)/H00000828.html#prevPage=menu&start=9&cgid=all-tint";
        // console.log("PMBoxGo      end;;;;")
    });
    // $(".PMBoxGo").on("click", function () {
    //
    //
    // });


    // 关闭礼盒
    // main.Bind(".boxClose", function () {
    //     $(".page-6").fadeOut();
    // });
    // main.Bind(".boxBtn", function () {
    //     // alert("秒礼物去了")
    //     ga('send', 'event', 'valentinesday', 'H5', "giftec");
    //
    // });


    // console.log(Scroll)
};


// ios 跳转后返回不刷新
$(function () {
    var num = 0;
    document.body.onpageshow = function () {
        num++;
        if (num == 2) {
            // console.log("刷新1");
            window.location.reload();
        }
    };
});











