/* global routie */

const SlideTransitionDelay = 500;

$(() => {
  /**
   * Installs a router that slides the slideshow to the offset based on the url hash
   *
   * The route handler also fires events:
   * - slideEnter:
   *   Fired when a new slide is selected, before the slideshow finishes transitioning to it.
   * - slideEntered:
   *   Fired after the slideshow finishes transitioning to the new slide.
   * - slideExit:
   *   Fired when a slide is being exited, before the slideshow begins transitioning away.
   * - slideExited:
   *   Fired when the slideshow finished transitioning away from an exited slide.
   *
   * NOTE: It's currently possible that a slideEnter event will be fired on a slide before the
   * slideExited handler of the same slide finished firing. Same for slideExit / slideEntered.
   */
  $('.slideshow').each((iSlideshow, slideshow) => {
    let currentSlide = null;
    $(slideshow).find('[data-slide-id]').each((iSlide, slide) => {
      routie($(slide).attr('data-slide-id'), () => {
        if (currentSlide !== null) {
          $(currentSlide).trigger('slideExit');
          window.setTimeout((exitedSlide) => {
            $(exitedSlide).trigger('slideExited');
          }, SlideTransitionDelay, currentSlide);
        }
        currentSlide = slide;
        $(slide).trigger('slideEnter');
        setTimeout((enteredSlide) => {
          $(enteredSlide).trigger('slideEntered');
        }, SlideTransitionDelay, slide);
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
    $(slide).on('slideExited', () => {
      $(slide).find('[data-option]').removeClass('active');
      $(slide).find('[data-option-show]').removeClass('active');
    });
  });
});
