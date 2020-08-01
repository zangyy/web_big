$(function () {
    // getUserInfo 获取用户信息
    function getUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            // jquery中的ajax 专门设置请求头信息
            // 注意：headers区分大小写
            // headers: {
            //     Authorization: localStorage.getItem("token")
            // },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取用户信息失败")
                }
                renderAvatar(res.data)
            }
        })
    }

    // 获取用户信息
    getUserInfo()

    // 渲染用户头像
    function renderAvatar(user) {
        // 获取用户和名称
        var name = user.nickname || user.username;
        // 设置欢迎文本
        $("#welcome").html("欢迎&nbsp&nbsp" + name);
        // 判断 用户头像信息 如果有就渲染图片 没有就渲染文字
        if (user.user_pic !== null) {
            $(".layui-nav-img").attr("src", user.user_pic).show();
            $(".text-avatar").hide();
        } else {
            $(".layui-nav-img").hide()
            var first = name[0].toUpperCase();
            $(".text-avatar").show().html(first);
        }
    }
    // 引入layer变量
    var layer = layui.layer;
    // 退出登录
    $("#btnloginOut").on("click", function () {
        // 提示用户是否退出
        layer.confirm("确定狠心离开我吗", {
            icon: 5,
            title: "🈲🈲🈲🈲🈲"
        }, function (index) {
            // 清空token
            localStorage.removeItem("token");
            // 重新进入登录页面
            location.href = "/login.html"
        })
    })
})