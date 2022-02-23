$(".highlight").wrap("<div class='code-wrapper' style='position:relative'></div>");
/*create copy button after page loaded*/
!function (e, t, a) {
    /* code */
    var initCopyCode = function () {
        var copyHtml = '';
        copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
        copyHtml += '  <i class="fa fa-clipboard"></i><span>copy</span>';
        copyHtml += '</button>';
        $(".highlight .code").before(copyHtml);
        var clipboard = new ClipboardJS('.btn-copy', {
            target: function (trigger) {
                return trigger.nextElementSibling;
            }
        });
        clipboard.on('success', function (e) {
            e.trigger.innerHTML = "<i class='fa fa-check' style='color:green'></i><span style='color:green'>copy success</span>"
            setTimeout(function () {
                e.trigger.innerHTML = "<i class='fa fa-clipboard'></i><span>copy</span>"
            }, 1000)
            e.clearSelection();
        });
        clipboard.on('error', function (e) {
            e.trigger.innerHTML = "<i class='fa fa-exclamation' style='color:red'></i><span style='color:red'>copy success</span>"
            setTimeout(function () {
                e.trigger.innerHTML = "<i class='fa fa-clipboard'></i><span>copy</span>"
            }, 1000)
            e.clearSelection();
        });
    }
    initCopyCode();
}(window, document);