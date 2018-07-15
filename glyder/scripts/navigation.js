(function($, undefined) {

// Handle selected classes on nav items
$(document.body).on('click', '[data-nav] [data-nav-item]', function() {
  var item = $(this);
  item.parents('[data-nav]').find('.sg-is-selected').removeClass('sg-is-selected');
  item.addClass('sg-is-selected');
});

// Open collapsed items on click
$(document.body).on('click', '[data-expanded=false]', function() {
  var item = $(this);
  item.attr('data-expanded', 'true');
  item.parents('li').find('[data-expander]').addClass('sg-is-expanded');
  item.parents('li').find('ul').slideDown(200);
});

// Close expanded items on click
$(document.body).on('click', '[data-expanded=true]', function() {
  var item = $(this);
  item.attr('data-expanded', 'false');
  item.parents('li').find('[data-expander]').removeClass('sg-is-expanded');
  item.parents('li').find('ul').slideUp(200);
});

$('.ChromeNav-GroupTitle').on('click', function () {
  $(this).closest('.ChromeNav-Group').toggleClass('is-expanded')
})

})(jQuery);
