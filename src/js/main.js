/* global routie */
$(() => {
  /**
   * Installs a router that slides the slideshow to the offset based on the url hash
   *
   * The route handler also fires slideEnter and slideExit events
   */
  $('.slideshow').each((iSlideshow, slideshow) => {
    let currentSlide = null;
    $(slideshow).find('[data-slide-id]').each((iSlide, slide) => {
      routie($(slide).attr('data-slide-id'), () => {
        if (currentSlide !== null) {
          $(currentSlide).trigger('slideExit');
        }
        currentSlide = slide;
        $(slide).trigger('slideEnter');
        $(slideshow).css({ marginLeft: -1 * $(slide).position().left });
      });
    });
  });

  /**
   * Install toggler controls
   */
  $('.slide:has([data-option])').each((iSlide, slide) => {
    $(slide).find('[data-option]').each((iOption, option) => {
      $(option).on('click', (ev) => {
        ev.preventDefault();
        const selected = $(option).attr('data-option');
        $(slide).find('[data-option]').removeClass('active');
        $(option).addClass('active');
        $(slide).find('[data-option-show]').removeClass('active');
        $(slide).find(`[data-option-show=${selected}]`).addClass('active');
      });
    });

    // Reset all toggles when exiting the slide
    $(slide).on('slideExit', () => {
      $(slide).find('[data-option]').removeClass('active');
      $(slide).find('[data-option-show]').removeClass('active');
    });
  });
});
