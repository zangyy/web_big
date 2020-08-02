$(function () {
    // 定义校验规则
    var form = layui.form;
    // 导入layer
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.trim().length > 6) {
                return "昵称必须为1~6位"
            }
        }
    })
    // 初始化用户信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取基本资料失败")
                }
                // 调用form.val()
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 重置表单数据
    $("#btnReset").on("click", function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        initUserInfo()
    })
    // 提交用户修改
    $(".layui-form").on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改基本资料失败")
                } else {
                    layer.msg("😙修改成功")
                    // 刷新父框架里的用户信息
                    window.parent.getUserInfo();
                }
            }
        })
    })
})