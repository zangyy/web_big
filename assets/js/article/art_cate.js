$(function () {
    var form = layui.form
    // 文章渲染
    initArtCateList()
    // 封装文章渲染
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr);
            }
        })
    }
    var index;
    // 添加类别
    $("#btnAddCate").on("click", function () {
        // 弹出添加文档
        index = layui.layer.open({
            type: 1,
            area: ["500px", "300px"],
            title: "添加文章分类",
            content: $("#dialog-add").html()

        })
    })
    // 通过代理的方式 为form-add表单绑定submit事件
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                initArtCateList();
                layui.layer.msg(res.message)
                layui.layer.close(index);
            }
        })
    })
    var indexedit;
    // 通过代理的方式 为btn-edit表单绑定click事件
    $("tbody").on("click", "#btn-edit", function () {
        indexedit = layui.layer.open({
            type: 1,
            area: ["500px", "300px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html()
        })

        var id = $(this).attr("data-id")
        // 发起请求获取对应分类的数据
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    })

    // 通过代理的方式 为修改的表单绑定sbumit事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                layui.layer.close(indexedit);
                initArtCateList();
            }
        })
    })
    // 通过代理的方式 为删除按钮绑定click事件
    $("tbody").on("click", "#btn-del", function () {
        var id = $(this).attr("data-id")
        // 提示用户是否删除
        layui.layer.confirm("确定狠心删除我吗？", {
            icon: 5,
            title: "🈲🈲🈲🈲🈲"
        }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)

                    }
                    layui.layer.msg("负心人你做到了🌚")
                    layui.layer.close(index);
                    initArtCateList();
                }
            })
        })
    })

})