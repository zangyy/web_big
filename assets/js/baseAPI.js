// 设置路径(测试)
var baseURL = "http://ajax.frontend.itheima.net";
// 设置路径(生产)
var baseURL = "http://ajax.frontend.itheima.net";
// 拦截/过滤每一次ajax请求，配置每次请求所需的参数
$.ajaxPrefilter(function (options) {
    // console.log(options); 未拼接前路径
    options.url = baseURL + options.url;
    // console.log(options); 拼接后路径
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token")
        }
    }
    options.complete = function (res) {
        var data = res.responseJSON;
        console.log(data);
        if (data.status == 1 && data.message == "身份认证失败！") {
            // 删除token
            localStorage.removeItem("token");
            // 页面跳转
            location.href = "/login.html";
        }
    }
})