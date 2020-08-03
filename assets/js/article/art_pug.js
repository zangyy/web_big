$(function () {
    var form = layui.form;
    initCate()
    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            type: "get",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.massage)
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr);
                form.render()
            }
        })
    }



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮 绑定click事件
    $("#btnfile").on("click", function () {
        $("#coverFile").click();
    })

    // 监听coverFile的change事件 获取用户选择的文件列表
    $("#coverFile").on("chenge", function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]

        if (file.length == 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 确定发布状态
    var state = "已发布"

    $("#savebtn1").on("click", function () {
        state = '已发布'
    })
    $("#savebtn2").on("click", function () {
        state = '草稿'
    })
    // 添加文章(上面的两个按钮 点击哪个都能触发)
    $("#form-add").on("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", state);
        // base64是字符串
        // 生成二进制图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)
                // ajax一定要饭菜回调函数里面
                // 因为生成文件是耗时操作 异步 所以必须保证发送ajax的时候图片已经生成 所以必须放到回到函数里

                publishArticle(fd)
            })


    })
    // 定义发布ajax
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.massage)
                }
                layer.msg(res.massage)
                // 发布文章成功后 跳转到列表页面
                // location.href = "/article/art_list.html"
                window.parent.document.getElementById("a2").click();
            }
        })
    }
})