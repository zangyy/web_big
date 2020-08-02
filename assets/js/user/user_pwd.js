$(function () {
    // 获取layui提供的form
    var form = layui.form;
    // 自定义校验规则
    form.verify({
        // 密码长度
        pwd: [/^[\S]{6,12}$/, "密码必须6~12位"],
        // 新旧密码不能相同
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同"
            }
        },
        // 两次密码不相同
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不相同"
            }
        }
    })
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新密码失败")
                }
                layui.layer.msg("更新密码成功")
                // 重置表单
                $(".layui-form")[0].reset();
            }
        })
    })

})