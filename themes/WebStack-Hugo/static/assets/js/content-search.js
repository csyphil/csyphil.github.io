$(function() {
    var $word = $('#word');
    var $searchText = $('#search-text');
    var debounceTimeout;
    var currentIndex = -1;

    $searchText.keyup(function(e) {
        clearTimeout(debounceTimeout);
        var keywords = $(this).val();
        if (keywords == '') {
            $word.hide();
            return;
        }

        debounceTimeout = setTimeout(function() {
            $.ajax({
                url: 'https://suggestion.baidu.com/su?wd=' + keywords,
                dataType: 'jsonp',
                jsonp: 'cb',
                beforeSend: function() {
                    // 可以加入加载提示
                },
                success: function(res) {
                    $word.empty().show();
                    if (res.s && res.s.length > 0) {
                        $word.css("display", "block");
                        for (var i = 0; i < res.s.length; i++) {
                            var li = $("<li><span>" + (i + 1) + "</span>" + res.s[i] + "</li>");

                            // 添加不同的样式
                            if (i === 0) {
                                li.addClass("first-suggestion");
                            } else if (i === 1) {
                                li.addClass("second-suggestion");
                            } else if (i === 2) {
                                li.addClass("third-suggestion");
                            }

                            $word.append(li);
                        }
                    } else {
                        $word.hide();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $word.empty().show();
                    $word.hide();
                    alert("搜索建议加载失败，请稍后再试！");
                }
            });
        }, 300); // 延迟 300ms
    });

    $word.on('click', 'li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $searchText.val(word);
        $word.empty().hide();
        $('.submit').trigger('click');
    });

    $(document).on('click', '.io-grey-mode', function() {
        $word.empty().hide();
    });

    // 处理键盘事件
    $searchText.keydown(function(e) {
        var suggestions = $('#word li');
        if (e.keyCode === 38) {  // 上箭头
            if (currentIndex > 0) {
                currentIndex--;
                highlightSuggestion(currentIndex);
            }
        } else if (e.keyCode === 40) {  // 下箭头
            if (currentIndex < suggestions.length - 1) {
                currentIndex++;
                highlightSuggestion(currentIndex);
            }
        } else if (e.keyCode === 13) {  // Enter键
            selectSuggestion(currentIndex);
        }
    });

    // 高亮当前选中的建议
    function highlightSuggestion(index) {
        $('#word li').removeClass('highlight').eq(index).addClass('highlight');
    }

    // 选择当前建议
    function selectSuggestion(index) {
        var selectedSuggestion = $('#word li').eq(index).text();
        $searchText.val(selectedSuggestion);
        $word.empty().hide();
    }
});
