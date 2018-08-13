(function($, undefined) {

$(document.body).on('click', '.code-preview-tab', function(e) {
  var tab = $(this)
  ,   wrapper = tab.parents('.code-preview')
  ,   tabs = wrapper.find('.code-preview-tab')
  ,   contents = wrapper.find('.code-preview-content')
  ,   index
  ,   content
  ;

  // Find index of tab
  tabs.each(function(i) { if (tab.is(this)) { index = i; } });

  // Use the same index to get the content for the tab
  content = $(contents.get(index));

  // Change the is-selected class to the new tab
  tabs.not(tab).removeClass('is-selected');
  tab.addClass('is-selected');

  // Show the content of the new tab
  contents.not(content).addClass('is-hidden');
  content.removeClass('is-hidden');
});

//
// Initialize code blocks
//

var modes = {
  'text/html'      : 'html',
  'text/css'       : 'css',
  'text/javascript': 'javascript',
  'text/react'     : 'javascript'
};

$(function() {
  $('.code-preview-content > pre').each(function() {
    var pre = $(this);
    pre.height(150);

    var content = pre.parent();
    var mimeType = content.attr('data-mime-type') || 'text/html';
    var kind = modes[mimeType];

    if (kind == 'react') {
      kind = 'javascript';
    }

    var editor = ace.edit(this);
    editor.setTheme("ace/theme/xcode");
    editor.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    });
    editor.on('focus', function() {
      pre.addClass('is-focused');
      editor.setOptions({
        highlightActiveLine: true,
        highlightGutterLine: true
      });
    });
    editor.on('blur', function() {
      pre.removeClass('is-focused');
      editor.setOptions({
        highlightActiveLine: false,
        highlightGutterLine: false
      });
    });

    var session = editor.getSession();
    session.setUseWorker(false);
    session.setMode('ace/mode/' + kind);
  });
});

})(jQuery);
