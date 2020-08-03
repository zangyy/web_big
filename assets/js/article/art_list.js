$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n < 10 ? n + "0" : n;
    }
    // 定义一个查询的参数对象 将请求的数据的时候 需要请求对象参数提交到服务器
    var q = {
        pagenum: 1, //页码
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的Id
        state: "", //文章的状态，可选：已发布|草稿
    }
    // 渲染
    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
                // 文章分页
                renderPage(res.total)
            }
        })
    }


    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                // 通过layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // 文章类别渲染
    initCate()


    // 为筛选表单绑定 submit事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染表单
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: "pageBox", //分页的容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候 触发jump回调
            jump: function (obj, first) {
                // 把最新的页码值 赋值到q查询参数中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len)
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('渣男?', {
            icon: 5,
            title: 'Σ(っ °Д °;)っ'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})