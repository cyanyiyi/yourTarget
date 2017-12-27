var api = {};
var proxy = 'http://txktapi.lingbokeji.cn';
/**
 * 
 * @param {*} openid 
 */
api.getUserInfoByOpenid = function (openid) {
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
