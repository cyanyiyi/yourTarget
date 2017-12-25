; (function () {
    var proxy = 'http://txktapi.lingbokeji.cn';
    main.getUserInfoByOpenid = function(openid) {
        $.ajax({
            type: "get",
            url: "http://txktapi.lingbokeji.cn/api/v1/user_info",
            data: {
                openid: "wx8b9ddd1c943ce95f"
            },
            datatype: "json",
            success: function(d){
                console.log(d);
            },
            error: function(d) {
                console.log(d);
            }
        })
    }
}());
