$(function() {
    var $word = $('#word');
    var $searchText = $('#search-text');

    $searchText.keyup(function() {
        var keywords = $(this).val();
        if (keywords == '') {
            $word.hide();
            return;
        }

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
});
