;(function (main) {

    main.btnDisable = function (DOM) {
        var element = DOM;
        return element.attr("disabled") ? element.attr("disabled", false) : element.attr("disabled", true);
    };

    main.BanSliding = (function () {
        document.querySelector('body').addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    }());

    main.Bind = function (obj, callBack) {

        var dom = document.querySelector(obj);
        if (dom.addEventListener) {
            dom.addEventListener("touchend", callBack, false);
        }
        else if (window.attachEvent) {
            dom.attachEvent('on' + "touchend", callBack);
        }
        else {
            dom['on' + "touchend"] = callBack;
        }

        // document.querySelector(obj).addEventListener("click",callBack,false);
    };

    main.typeOf = function (o) {
        var _toString = Object.prototype.toString;
        var _type = {
            'undefined': 'undefined',
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Function]': 'function',
            '[object RegExp]': 'regexp',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object Error]': 'error'
        };
        return _type[typeof o] || _type[_toString.call(o)] || (o ? 'object' : 'null');
    };

    main.getQueryString = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);//获取当前url中
        if (r != null) {
            return (r[2]);
        } else {
            return null;
        }
    };

    // 数组随机位置
    //sort 是对数组进行排序
    //他的是这样工作的。每次从数组里面挑选两个数 进行运算。如果传入的参数是0 两个数位置不变。如果参数小于0 就交换位置 如果参数大于0就不交换位置
    //恰好。我们利用了这一点使用了0.5 - Math.random  这个运算的结果要么是大于0,要么是小于0.这样要么交换位置，要么不交换位置。
    main.sort = function (ARR) {

        if (main.typeOf(ARR) != "array") {
            return;
        }
        ARR.sort(function () {
            return 0.5 - Math.random()
        });
        return ARR;
    };

    // 朋友打开祝福随机 domArr 内容容器  blessing祝福数组 correct正确语句
    main.Randomwish = function (domArr, blessing) {
        // 指定的dom插入指定内的随机数据    选取其中一个DOM插入正确数据
        if (main.typeOf(domArr) != "array" || main.typeOf(blessing) != "array") {
            return;
        }
        blessing = main.sort(blessing);
        for (var i = 0; i < domArr.length; i++) {
            $(domArr[i]).html(blessing[i])
        }

    };

    // 朋友打开祝福随机 domArr 内容容器  blessing祝福数组 correct正确语句
    main.RandomwishCai = function (domArr, blessing ,correct) {
        // 指定的dom插入指定内的随机数据    选取其中一个DOM插入正确数据
        if (main.typeOf(domArr) != "array" || main.typeOf(blessing) != "array") {
            return;
        }
        blessing = main.sort(blessing);
        for (var i = 0; i < domArr.length; i++) {
            $(domArr[i]).html(blessing[i])
        }
        if (blessing.indexOf(correct) == "-1") {  //correct
            // 随机DOM插入正确数据
            var okElement = Math.floor(Math.random() * domArr.length + 1) - 1;
            $(domArr[okElement]).html(correct);
        }
    };


    main.after = (function () {

        Function.prototype.after = function (fn) {
            var self = this;
            return function () {
                var ret = self.apply(this, arguments);
                if (ret === "nextSuccessor") {
                    return fn.apply(this, arguments);
                }
                return ret;
            };
        };


    }());

    // 提交心愿页面动画
    main.page2Ani = function () {

        // var domArr = [[".kaP1",kaP1Callback], [".kaP2",kaP2Callback], [".page2man",page2manCallback], [".page2woman",page2womanCallback]];
        // var domArr = ['.kaP1', ".kaP2",".page2man", ".page2woman"];
        // var positi = [["0", "0"], ["0", "0"], ['204px', '0'], ["403px", "512px"]];
        var kaP1 = function () {

            var $kaP1=$(".kaP1");
            $kaP1.addClass("P2KaOpacity");
            // 动画开始时事件
            $kaP1[0].addEventListener("webkitAnimationStart", function () {

            });
            // 动画结束时事件
            $kaP1[0].addEventListener("webkitAnimationEnd", function () {
                $(".kaP2").fadeIn().addClass("P2KaAni");
                kaP2();
                page2man();
                page2woman();

            });

            // $(".kaP1").animate({
            //     // top: "50px",
            //     // left: "105px"
            //     opacity: 1
            // }, 1000, function () {
            //     $(".kaP2").fadeIn().addClass("P2KaAni");
            //     kaP2();
            //     page2man();
            //     page2woman();
            // });
        };
        var kaP2 = function () {
            $(".kaP2").animate({

                width: "418px",
                top: "50px",
                left: "105px"
            }, 1000, function () {
                // page2man();
                // page2woman();
            });
        };
        var page2man = function () {
            $(".page2man").animate({
                top: "204px",
                left: 0
            }, 800, function () {

            });
        };
        var page2woman = function () {
            $(".page2woman").animate({
                top: "403px",
                left: "512px"
            }, 800, function () {

                var $page2Tip = $(".page2Tip");

                $page2Tip.fadeIn();
                setTimeout(function () {
                    $page2Tip.fadeOut();
                }, 5000);
                main.Bind(".page2Tip", function () {
                    $page2Tip.fadeOut();
                });
                // 动画结束显示输入框
                $("#page2Text,.formBody,.page2BtnBody").fadeIn();
                main.page2();

            });
        };
        kaP1();
        main.page2Ul()
    };


    // 提交心愿li 点击背景色
    main.page2Ul = function () {


        // $(".formBody ul li").on("click", function () {
        //     $(this).css({
        //         backgroundColor: "#46545e",
        //         color: "#ffffff"
        //     }).siblings().css({
        //         backgroundColor: "#ffffff",
        //         color: "#46545e"
        //     })
        // })




    };






}(main));








