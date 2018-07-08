(function($, undefined) {

var headings = $('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')

if (headings.length > 0) {
  // Highlight ToC item on click
  $('.ToC-Item a').on('click', function () {
    $('.ToC-Item').removeClass('is-active')
    $(this).closest('.ToC-Item').addClass('is-active')
  })

  // Highlight ToC item on page load
  $('a[href="' + window.location.hash + '"]').closest('.ToC-Item').addClass('is-active')

  // Highlight ToC item on scroll
  $(window).on('scroll', function () {
    var tocPosition = $('.ToC').offset().top

    headings.each(function (heading) {
      if ($(window).scrollTop() >= $(this).offset().top - 10) {
        $('.ToC-Item').removeClass('is-active')
        $('a[href="#' + $(this).attr('id') + '"]').closest('.ToC-Item').addClass('is-active')
      }
    })
  })
}

// Smooth scrolling for Table of Content
// Source from CSS-Tricks: https://css-tricks.com/snippets/jquery/smooth-scrolling/
// Select all links with hashes
$('.ToC-Item a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 300, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          }
        });
      }
    }
  });

})(jQuery);
