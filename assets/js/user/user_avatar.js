var layer = layui.layer;
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

$("#btnChooseImage").on("click", function () {
  $("#file").click();
})
// 为文件展示框绑定change事件
$("#file").on("change", function (e) {
  var filelist = e.target.files;
  // var filelist = $("#file")[0].files;
  if (filelist.length == 0) {
    return layer.msg("请选择文件")
  }
  // 拿到用户选择的文件
  var file = e.target.files[0]
  // 根据选择的文件，创建一个对应的 URL 地址
  var newImgURL = URL.createObjectURL(file)
  // 先`销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域$image
  $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', newImgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
})
// 调用接口，把头像上传到服务器
$("#btnUpload").on("click", function () {
  // 拿到裁剪后的头像
  var dataURL = $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
  $.ajax({
    type: 'post',
    url: '/my/update/avatar',
    data: {
      avatar: dataURL
    },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message)
      }
      layui.layer.msg("头像上传成功");
      // 刷新父框架中的个人信息
      window.parent.getUserInfo();
    }
  })
})