$(function() {
    // Localize datetime
    (function() {
        $('time').each(function() {
            // if there are multiple children it means it's a wikilink
            if(this.childNodes.length > 1) return;

            var dateStr = this.getAttribute('datetime');
            if(this.innerHTML.length == 11) {
                var date = new Date(dateStr);
                var month = '0' + (date.getMonth() + 1);
                var day = '0' + date.getDate();
                var hour = '0' + date.getHours();
                var min = '0' + date.getMinutes();
                var result =
                    month.substr(month.length - 2) + '-' +
                        day.substr(day.length - 2) + ' ' +
                        hour.substr(hour.length - 2) + ':' +
                        min.substr(min.length - 2)
            } else {
                var date = new Date(dateStr);
                var year = '' + date.getFullYear();
                var month = '0' + (date.getMonth() + 1);
                var day = '0' + date.getDate();
                var hour = '0' + date.getHours();
                var min = '0' + date.getMinutes();
                var result =
                    year + '-' +
                        month.substr(month.length - 2) + '-' +
                        day.substr(day.length - 2) + ' ' +
                        hour.substr(hour.length - 2) + ':' +
                        min.substr(min.length - 2)
            }
            this.innerHTML = result;
        });
    })();

    // Make strong>em elements to quotable
    (function() {
        var url = $('link[rel="canonical"]').attr('href');
        $('strong > em').wrap(function() {
            var text = $(this).text();
            var twitter = $('meta[name="twitter:site"').attr('content').substring(1);
            return '<a class="quotable" href="https://twitter.com/intent/tweet?via=' + twitter + '&url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text) + '" />';
        });
    })();

    // Search box
    (function() {
        var $search = $('#searchbox');
        if ($search.length === 0) return;

        $($('#searchbox')[0].form).on('submit', function() {
            var value = $search.val();
            if(value) {
                location.href = '/' + value;
            }
            return false;
        })
    })();

    // Shortcut keys
    (function() {
        var $editor = $('.editform textarea');

        // not in editor mode
        if ($editor.length) return;

        var $caret_targets = $('.caret-target');
        var caret_index = 0;
        if($caret_targets.length) navigateFocus(caret_index, true);

        // shortcuts
        var shortcuts = []
        $('.shortcut').each(function() {
            shortcuts.push($(this).data('shortcut').toUpperCase());
        });

        $(window).on('keydown', function(e) {
            if(e.metaKey || e.ctrlKey) return true;

            var keyCode = e.keyCode;
            var key = String.fromCharCode(keyCode);

            if ($('#searchbox').is(':focus')) {
                if(27 === keyCode) {
                    $('#searchbox').blur();
                    return false;
                } else {
                    return true;
                }
            }

            if(shortcuts.indexOf(key) != -1) {
                $('#shortcut_' + key).focus();
                return false;
            } else if(69 === keyCode) {
                // [E]
                $('#edit').focus();
                return false;
            } else if(191 === keyCode || 83 === keyCode) {
                // [/] or [S]earch
                $('#searchbox').focus();
                return false;
            } else if(74 === keyCode) {
                // J for down
                if($caret_targets.length) {
                    caret_index++;
                    if(caret_index >= $caret_targets.length) caret_index = 0;
                    navigateFocus(caret_index, false);
                }
                return false;
            } else if(75 === keyCode) {
                // K for up
                if($caret_targets.length) {
                    caret_index--;
                    if(caret_index < 0) caret_index = $caret_targets.length - 1;
                    navigateFocus(caret_index, false);
                }
                return false;
            } else {
                return true;
            }
        })

        function navigateFocus(index, isFirstTime) {
            $('.vcaret').removeClass('vcaret');
            $('.vcaret-parent').removeClass('vcaret-parent');

            $($caret_targets[index]).addClass('vcaret').focus();
            if(isFirstTime) return;

            $($caret_targets[index]).parent()
                .addClass('vcaret-parent')
                .on('transitionend', function() {
                    $(this).removeClass('vcaret-parent');
                }
            );
        }
    })();

    // Track outbound links
    (function() {
        var host = window.location.host;
        $('article').on('click', 'a:not(.wikipage)', function() {
            var url = String(this.href);
            if(url.indexOf('http://' + host) === 0 ||
               url.indexOf('https://' + host) === 0 ||
               url.indexOf('/') === 0) return true;
            ga('send', 'event', 'Outbound links', url);
        });
    })();
});
