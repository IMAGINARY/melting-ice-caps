/* global routie */
$(() => {
  $('.slideshow').each((iSlideshow, slideshow) => {
    $(slideshow).find('[data-slide-id]').each((iSlide, slide) => {
      routie($(slide).attr('data-slide-id'), () => {
        $(slideshow).css({ marginLeft: -1 * $(slide).position().left });
      });
    });
  });
});
