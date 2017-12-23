var main = {};
main.init = function() {
    // this.initShareInfo();
    main.bindEvent();
}
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

main.initUserinfo = function(nickName, avatarUrl) {
    $('.t-userinfo-avatar img').attr("src", avatarUrl);
    $('.t-userinfo-nickname').text(nickName);

}

main.generateCode = function(url) {
    console.log(url);
    var codeEl = $('#share-code')[0];
    var width = codeEl.offsetWidth;
    var height = codeEl.offsetHeight;
    var qrcode = new QRCode(codeEl, {
        width : width,
        height : height
    });
    qrcode.makeCode(url);
}

main.takeScreenshot = function() {
    var cntElem = $('#generatePic')[0];
    var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
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
            console.log(canvas);
            // var url = canvas.toDataURL();
            $('#generatePicShow').append(canvas).show();
        }
    });
}

main.sort = function (ARR) {
    ARR.sort(function () {
        return 0.5 - Math.random()
    });
    return ARR;
};

main.Randomwish = function ($domArr, target) {
    var _target = main.sort(target);
    console.log(_target);
    for (var i = 0; i < $domArr.length; i++) {
        (function(i){
            $($domArr[i]).text(_target[i])
        })(i)
    }

};

main.bindEvent = function() {
    // 选择系统目标
    $(".target-text").click(function () {
        $('#input-target').val($(this).attr('target-text'));
    })
    // 生成我的目标海报
    $("#submit-target").on("click", function () {      
        var myTarget = $('#input-target').val();
        var _targetArr = ['目标1','目标2','目标3','目标4','目标5','目标6','目标7','目标8','目标9'];
        var $domArr = $('.t-nine-text');
        console.log(myTarget);
        if(!myTarget){
            $('.one-input').addClass('bounce').find('#input-target').addClass('red-input');
            setTimeout(function(){
                $('.one-input').removeClass('bounce').find('#input-target').removeClass('red-input');
            },2000)
        } else {
            $('#generatePic').show();
            if (_targetArr.indexOf(myTarget) === -1) {
                _targetArr[5] = myTarget;
                console.log(2222)
            }
            var nickName = '柳岩';
            var avatarUrl = './img/ly2.jpg';
            main.initUserinfo(nickName, avatarUrl);
            main.Randomwish($domArr, _targetArr);
            main.generateCode('www.tx.com?id=1');         
            main.takeScreenshot();
            $('#home').hide();
        }
    });
}
main.init();