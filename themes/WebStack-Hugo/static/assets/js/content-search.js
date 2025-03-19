$(function() {
    var $searchText = $('#search-text');

    // 监听回车键来触发搜索
    $searchText.keyup(function(event) {
        if (event.keyCode === 13) {  // 如果按下回车键（Enter）
            var word = $(this).val();
            if (word !== '') {
                // 这里可以执行你的搜索操作，例如提交表单或者发起搜索请求
                $('.submit').trigger('click');  // 假设这里是触发搜索提交按钮的点击事件
            }
        }
    });

    // 如果点击了搜索框外面，关闭搜索词建议（如果需要）
    $(document).on('click', '.io-grey-mode', function() {
        $word.empty().hide();
    });
});
