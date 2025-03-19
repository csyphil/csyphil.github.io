(function($) {
    var $word = $('#word');
    var $searchText = $('#search-text');
    var debounceTimer;

    // 防抖函数：防止在快速输入时重复发送请求
    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }

    // 处理搜索建议的显示
    $searchText.keyup(function(event) {
        var keywords = $(this).val();
        if (keywords === '') {
            $word.hide();
            return;
        }

        // 防止按键时频繁请求
        debounce(function() {
            $.ajax({
                url: 'https://suggestion.baidu.com/su?wd=' + keywords,
                dataType: 'jsonp',
                jsonp: 'cb',
                beforeSend: function() {},
                success: function(res) {
                    $word.empty().show();
                    var hotList = res.s.length;
                    if (hotList) {
                        $word.css("display", "block");
                        for (var i = 0; i < hotList-1; i++) {
                            var li = $("<li><span>" + (i + 1) + "</span>" + res.s[i] + "</li>");
                            if (i === 0) {
                                li.css({ "border-top": "none" });
                            } else if (i === 1) {
                                li.find("span").css({ "color": "#fff", "background": "#ff8547" });
                            } else if (i === 2) {
                                li.find("span").css({ "color": "#fff", "background": "#ffac38" });
                            }
                            $word.append(li);
                        }
                    } else {
                        $word.hide();
                    }
                },
                error: function() {
                    $word.empty().show();
                    $word.hide();
                }
            });
        }, 300); // 300ms 防抖延迟
    });

    // 监听方向键和 Enter 键的操作
    var selectedIndex = -1;
    $(document).on('keydown', '#search-text', function(event) {
        var items = $word.find('li');
        var itemCount = items.length;

        if (event.key === 'ArrowDown') {
            // 向下箭头
            selectedIndex = Math.min(selectedIndex + 1, itemCount - 1);
            updateHighlight();
            event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            // 向上箭头
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateHighlight();
            event.preventDefault();
        } else if (event.key === 'Enter') {
            // 按下 Enter 键时选择高亮的项
            if (selectedIndex >= 0) {
                var word = items.eq(selectedIndex).text().replace(/^[0-9]/, '');
                $searchText.val(word);
                $word.empty().hide();
                $('.submit').trigger('click');
            }
        }
    });

    // 高亮当前选中的项
    function updateHighlight() {
        var items = $word.find('li');
        items.removeClass('highlight');
        if (selectedIndex >= 0 && selectedIndex < items.length) {
            items.eq(selectedIndex).addClass('highlight');
        }
    }

    // 点击某个建议时进行搜索
    $word.on('click', 'li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $searchText.val(word);
        $word.empty().hide();
        $('.submit').trigger('click');
    });

    // 点击其他地方时关闭下拉框
    $(document).on('click', '.io-grey-mode', function() {
        $word.empty().hide();
    });
})(jQuery);
