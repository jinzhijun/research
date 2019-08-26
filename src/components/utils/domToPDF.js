import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

// let domToPDF = function(dom,title) {
//     var title = title;
//     html2Canvas(document.querySelector(dom), {
//         allowTaint: true
//     }).then(function (canvas) {
//         let contentWidth = canvas.width
//         let contentHeight = canvas.height
//         //一页pdf显示html页面生成的canvas高度;
//         let pageHeight = contentWidth / 592.28 * 841.89
//         let leftHeight = contentHeight
//          //页面偏移
//         let position = 0
//         //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
//         let imgWidth = 595.28
//         let imgHeight = 592.28 / contentWidth * contentHeight
//         //返回图片dataURL，参数：图片格式和清晰度(0-1)
//         let pageData = canvas.toDataURL('image/jpeg', 1.0)
//         let PDF = new JsPDF('', 'pt', 'a4')
//         if (leftHeight < pageHeight) {
//             PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
//         } else {
//         while (leftHeight > 0) {
//             PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
//             leftHeight -= pageHeight
//             position -= 841.89
//             if (leftHeight > 0) {
//                 PDF.addPage()
//             }
//         }
//         }
//         PDF.save(title + '.pdf')
//     })
// }

let domToPDF = function(dom,title) {
    var title = title;
    // var element = document.querySelector(dom);    // 这个dom元素是要导出pdf的div容器 
    var element = $(dom);    // 这个dom元素是要导出pdf的div容器 
    console.log(element)
    var w = element.width();    // 获得该容器的宽
    var h = element.height();    // 获得该容器的高
    var offsetTop = element.offset().top;    // 获得该容器到文档顶部的距离
    var offsetLeft = element.offset().left;    // 获得该容器到文档最左的距离
    var canvas = document.createElement("canvas");
    var abs = 0;
    var win_i = $(window).width();    // 获得当前可视窗口的宽度（不包含滚动条）
    var win_o = window.innerWidth;    // 获得当前窗口的宽度（包含滚动条）
    if(win_o>win_i){
      abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
    }
    canvas.width = w * 5;    // 将画布宽&&高放大两倍
    canvas.height = h * 5;
    var context = canvas.getContext("2d");
     // 【重要】关闭抗锯齿
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.scale(5, 5);
    context.translate(-offsetLeft-abs,-offsetTop);    
    // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此        
    // translate的时候，要把这个差值去掉
    html2Canvas(element[0]).then(function(canvas) {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        var pageHeight = contentWidth / 592.28 * 841.89;
        //未生成pdf的html页面高度
        var leftHeight = contentHeight;
        //页面偏移
        var position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 595.28;
        var imgHeight = 592.28/contentWidth * contentHeight;
    
        var pageData = canvas.toDataURL('image/jpeg', 1.0);
    
        var pdf = new JsPDF('', 'pt', 'a4');
    
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {    // 分页
            while(leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight;
                position -= 841.89;
                //避免添加空白页
                if(leftHeight > 0) {
                pdf.addPage();
                }
            }
        }
        pdf.save(title + '.pdf')     
    })
}



export default {
    domToPDF
}


