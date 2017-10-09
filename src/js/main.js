/* global routie */
const Promise = require('bluebird');
const superagent = require('superagent');
const yaml = require('js-yaml');

const SlideTransitionDelay = 500;

function readConfig() {
  console.log('Reading config');
  const defaults = {
    allowTextSelection: true,
    showLanguageSwitcher: true,
  };
  return new Promise((accept, reject) => {
    superagent
      .get(`cfg/config.yml?cache=${Date.now()}`)
      .then((response) => {
        const config = Object.assign({}, defaults, yaml.safeLoad(response.text));
        accept(config);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function init(cfg) {
  $(() => {
    /**
     * Install toggler controls
     */
    function showOption(slide, optionID) {
      $(slide).find('[data-option]').removeClass('active');
      $(slide).find('[data-option-show]').removeClass('active');
      $(slide).find(`[data-option=${optionID}]`).addClass('active');
      $(slide).find(`[data-option-show=${optionID}]`).addClass('active');
    }
    $('.slide:has([data-option])').each((iSlide, slide) => {
      let once = false;
      $(slide).find('[data-option]').each((iOption, option) => {
        $(option).on('click', (ev) => {
          ev.preventDefault();

          if ($(option).parents('[data-option-once]').length > 0) {
            if (once) {
              return;
            }
            once = true;
          }

          showOption(slide, $(option).attr('data-option'));
        });
        showOption(slide, 'default');
      });

      // Reset all toggles when exiting the slide
      $(slide).on('slideExited', () => {
        once = false;
        showOption(slide, 'default');
      });
    });

    /**
     * Set body classes
     */
    $('.slide[data-slide-id]')
      .on('slideEnter', (ev) => {
        const slideId = $(ev.target).attr('data-slide-id');
        $(document.body).addClass(`slide-${slideId}-enter`);
      })
      .on('slideEntered', (ev) => {
        const slideId = $(ev.target).attr('data-slide-id');
        $(document.body).removeClass(`slide-${slideId}-enter`);
        $(document.body).addClass(`slide-${slideId}`);
      })
      .on('slideExit', (ev) => {
        const slideId = $(ev.target).attr('data-slide-id');
        $(document.body).addClass(`slide-${slideId}-exit`);
      })
      .on('slideExited', (ev) => {
        const slideId = $(ev.target).attr('data-slide-id');
        $(document.body).removeClass(`slide-${slideId}-exit`);
        $(document.body).removeClass(`slide-${slideId}`);
      });

    /**
     * Add a position marker in the TOC
     */
    $('.slideshow').each((iSlideshow, slideshow) => {
      const slideshowID = $(slideshow).attr('data-slideshow-id');
      $(`.toc[data-slideshow=${slideshowID}]`).each((iToc, toc) => {
        const tocMarker = $("<div class='toc-marker'></div>");
        $(tocMarker).insertBefore(toc);
        $(slideshow).on('slideEnter', (ev) => {
          const slideID = $(ev.target).attr('data-slide-id');
          const tocItem = $(toc).find(`[href*='#${slideID}']`);
          if (tocItem.length) {
            $(tocMarker).addClass('visible');
            $(tocMarker).css({
              left: tocItem.position().left,
              top: tocItem.position().top,
            });
          } else {
            $(tocMarker).removeClass('visible');
          }
        });
      });
    });

    /**
     * Autoplay / Autostop videos
     */

    $('.slide:has(video)').each((iSlide, slide) => {
      let stopRequested = false;
      let playing = false;

      $(slide).on('slideEntered', (e) => {
        $(e.target).find('video').each((iVideo, video) => {
          video.play().then(() => {
            if (stopRequested) {
              video.pause();
              video.currentTime = 0; // eslint-disable-line
              stopRequested = false;
            } else {
              playing = true;
            }
          });
        });
      });

      $(slide).on('slideExited', (e) => {
        $(e.target).find('video').each((iVideo, video) => {
          if (playing) {
            video.pause();
            video.currentTime = 0; // eslint-disable-line
            playing = false;
          } else {
            stopRequested = true;
          }
        });
      });
    });

    /**
     * Disable text selection
     */
    if (cfg.allowTextSelection === false) {
      $(document.body).addClass('disable-select');
    }

    /**
     * Hide language switcher
     */
    if (cfg.showLanguageSwitcher === false) {
      $(document.body).addClass('disable-language-switcher');
    }

    /**
     * Installs a router that slides the slideshow to the offset based on the url hash
     *
     * The route handler also fires events on the slides:
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
      // Default route
      routie('*', () => {
        routie('1');
      });
    });
  });
}

readConfig().then(cfg => init(cfg));
