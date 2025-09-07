/*!
  * Contra Agency  v1.0.0 (undefined)
  * Copyright 2011-2025 Samuel Podina @ Contra Agency
  * Licensed under MIT
  */
(function () {
    'use strict';

    jQuery( document ).ready( function() {
        var base = window.base;

        Drupal.behaviors.accord = {
            attach: function( context, settings ) {

                const elements = jQuery( context ).find( '.layout' ).once( 'accord' );
                elements.each( function( index, item ) {
                    if ( item.length ) {
                        init();
                    }
                } );
            }
        };

        function init() {
            base.responsiveIframe.init();
            base.header.init();
            base.accordion.init();
            base.carousel.init();
            base.pager.init();
            base.helpers.init();
            base.animations.init();
            base.readMore.init();
            base.beacon.init();
            base.headerMenus.init();
            base.messages.init();
            base.anchorsController.init();
        }
        init();

    } );

    ( function( base, $, undefined$1 ) {

        var accordion = function() {

            /*
            *   This content is licensed according to the W3C Software License at
            *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
            *
            *   Simple accordion pattern example
            */

            if ( $( '.accordion' ).length ) {

                Array.prototype.slice.call( document.querySelectorAll( '.accordion' ) ).forEach( function( accordion ) {

                    // Allow for multiple accordion sections to be expanded at the same time
                    var allowMultiple = accordion.hasAttribute( 'data-allow-multiple' );

                    // Allow for each toggle to both open and close individually
                    var allowToggle = ( allowMultiple ) ? allowMultiple : accordion.hasAttribute( 'data-allow-toggle' );

                    // Create the array of toggle elements for the accordion group
                    var triggers = Array.prototype.slice.call( accordion.querySelectorAll( '.accordion-trigger' ) );
                    Array.prototype.slice.call( accordion.querySelectorAll( '.accordion-panel' ) );

                    accordion.addEventListener( 'click', function( event ) {
                        var target = event.target;
                        if ( target.classList.contains( 'accordion-trigger' ) ) {

                            // Check if the current toggle is expanded.
                            var isExpanded = target.getAttribute( 'aria-expanded' ) == 'true';
                            var active = accordion.querySelector( '[aria-expanded="true"]' );

                            // without allowMultiple, close the open accordion
                            if ( !allowMultiple && active && active !== target ) {

                                // Set the expanded state on the triggering element
                                active.setAttribute( 'aria-expanded', 'false' );

                                // Hide the accordion sections, using aria-controls to specify the desired section
                                document.getElementById( active.getAttribute( 'aria-controls' ) ).setAttribute( 'hidden-faq', '' );

                                // When toggling is not allowed, clean up disabled state
                                if ( !allowToggle ) {
                                    active.removeAttribute( 'aria-disabled' );
                                }
                            }

                            if ( !isExpanded ) {

                                // Set the expanded state on the triggering element
                                target.setAttribute( 'aria-expanded', 'true' );

                                // Hide the accordion sections, using aria-controls to specify the desired section
                                document.getElementById( target.getAttribute( 'aria-controls' ) ).removeAttribute( 'hidden-faq' );

                                // If toggling is not allowed, set disabled state on trigger
                                if ( !allowToggle ) {
                                    target.setAttribute( 'aria-disabled', 'true' );
                                }
                            } else if ( allowToggle && isExpanded ) {

                                // Set the expanded state on the triggering element
                                target.setAttribute( 'aria-expanded', 'false' );

                                // Hide the accordion sections, using aria-controls to specify the desired section
                                document.getElementById( target.getAttribute( 'aria-controls' ) ).setAttribute( 'hidden-faq', '' );
                            }

                            event.preventDefault();
                        }
                    } );

                    // Bind keyboard behaviors on the main accordion container
                    accordion.addEventListener( 'keydown', function( event ) {
                        var target = event.target;
                        var key = event.which.toString();

                        target.getAttribute( 'aria-expanded' ) == 'true';
                        ( allowMultiple ) ? allowMultiple : accordion.hasAttribute( 'data-allow-toggle' );

                        // 33 = Page Up, 34 = Page Down
                        var ctrlModifier = ( event.ctrlKey && key.match( /33|34/ ) );

                        // Is this coming from an accordion header?
                        if ( target.classList.contains( 'accordion-trigger' ) ) {

                            // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
                            // 38 = Up, 40 = Down
                            if ( key.match( /38|40/ ) || ctrlModifier ) {
                                var index = triggers.indexOf( target );
                                var direction = ( key.match( /34|40/ ) ) ? 1 : -1;
                                var length = triggers.length;
                                var newIndex = ( index + length + direction ) % length;

                                triggers[newIndex].focus();
                                event.preventDefault();
                            } else if ( key.match( /35|36/ ) ) {

                                // 35 = End, 36 = Home keyboard operations
                                switch ( key ) {

                                    // Go to first accordion
                                    case '36':
                                    triggers[0].focus();
                                    break;

                                    // Go to last accordion
                                    case '35':
                                    triggers[triggers.length - 1].focus();
                                    break;
                                }

                                event.preventDefault();
                            }
                        }
                    } );

                    // These are used to style the accordion when one of the buttons has focus
                    accordion.querySelectorAll( '.accordion-trigger' ).forEach( function( trigger ) {
                        trigger.addEventListener( 'focus', function( event ) {
                            accordion.classList.add( 'focus' );
                        } );

                        trigger.addEventListener( 'blur', function( event ) {
                            accordion.classList.remove( 'focus' );
                        } );
                    } );

                    // Minor setup: will set disabled state, via aria-disabled, to an
                    // expanded/ active accordion which is not allowed to be toggled close
                    if ( !allowToggle ) {

                        // Get the first expanded/ active accordion
                        var expanded = accordion.querySelector( '[aria-expanded="true"]' );

                        // If an expanded/ active accordion is found, disable
                        if ( expanded ) {
                            expanded.setAttribute( 'aria-disabled', 'true' );
                        }
                    }
                } ); // end accordion
            } // end if statement

        };

        base.accordion = {
            init: accordion
        };

    }( window.base = window.base || {}, jQuery ) );

    (function (base, $, undefined$1) {

      var anchorsController = function () {

        jQuery($ => {
          // The speed of the scroll in milliseconds
          const speed = 1500;

          $('a[href*="#"]')
            .filter((i, a) => a.getAttribute('href').startsWith('#') || a.href.startsWith(`${location.href}#`))
            .unbind('click.smoothScroll')
            .bind('click.smoothScroll', event => {
              const targetId = event.currentTarget.getAttribute('href').split('#')[1];
              const targetElement = document.getElementById(targetId);

              if (targetElement) {
                event.preventDefault();
                if ($('.toolbar-tab--toolbar-item-administration').length) {
                  $('html, body').animate({ scrollTop: $(targetElement).offset().top }, speed);
                } else {
                  $('html, body').animate({ scrollTop: $(targetElement).offset().top }, speed);
                }
              }
            });




          var scrollToElementOnload = function (offsetTop, duration) {
            duration = duration || 1500;
            // offsetTop = offsetTop || 205;
            offsetTop = $('.toolbar-tab--toolbar-item-administration').length ? offsetTop || 0 : offsetTop || 0;
            // Figure out element to scroll to
            var target = $(window.location.hash);
            // Does a scroll target exist?
            if (target.length) {
              $('html, body').animate({
                scrollTop: target.offset().top - offsetTop
              }, duration, function () {
                // Callback after animation
                // Must change focus!
                var $target = $(target);
                $target.focus();
                if ($target.is(":focus")) { // Checking if the target was focused
                  return false;
                } else {
                  $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                  $target.focus(); // Set focus again
                }            var hash = window.location.hash;
                $("a[href='" + hash + "']").parent().addClass('active');
              });
            }
          };

          setTimeout(scrollToElementOnload(), 100);
        });
      };

      base.anchorsController = {
        init: anchorsController
      };

    }(window.base = window.base || {}, jQuery));

    ( function( base, $, undefined$1 ) {

        var animations = function() {
            function isScrolledIntoView( elem, delay = 300 ) {
                var docViewTop = $( window ).scrollTop();
                var docViewBottom = docViewTop + $( window ).height();

                var elemTop = $( elem ).offset().top;
                var elemBottom = elemTop + $( elem ).height();

                return ( ( elemBottom <= docViewBottom + delay ) && ( elemTop >= docViewTop ) );
              }

              $( window ).on( 'scroll', function() {
                $( '.salons-for-you-carousel article' ).each( function( i, item ) {
                    $( '.salons-left h2' ).addClass( 'animate' );
                    $( this ).css( 'transition-delay', 200 * i + 'ms' );
                    if ( isScrolledIntoView( $( this ) ) ) {
                        $( this ).addClass( 'animate' );
                    }
                } );

                $( '.block-two-col-text, .block-two-col-forty-sixty, .block-qr-code-download' ).each( function() {

                    var children = $( this ).find( '.img-col, .text-col, .right-col, .left-col' ).children();

                    children.each( function( i, element ) {
                        $( this ).css( 'transition-delay', 80 * i + 'ms' );
                    } );

                    if ( isScrolledIntoView( $( this ) ) ) {
                        $( this ).find( '.right-col' ).children().addClass( 'animate' );
                    }

                    if ( isScrolledIntoView( $( this ), 600 ) ) {
                        $( this ).find( '.img-col' ).children().addClass( 'animate' );
                        $( this ).find( '.left-col' ).children().addClass( 'animate' );
                    }

                    if ( isScrolledIntoView( $( this ), 500 ) ) {
                        $( this ).find( '.text-col' ).children().addClass( 'animate' );
                    }
                } );

            } );
        };

        base.animations = {
            init: animations
        };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

        var beaconCue = [];
        var beaconHistory = [];

        var init = function() {
            $( '[data-beacon-event="view"]' ).each( function( i ) {
                addEntry( {
                    salonId: $( this ).data( 'beacon-id' ),
                    beacon: $( this ).data( 'beacon' )
                },
                false );
            } );
            transmit();
            $( '[data-beacon-event="click"]' ).click( function() {
                addEntry( {
                    salonId: $( this ).data( 'beacon-id' ),
                    beacon: $( this ).data( 'beacon' )
                },
                true, true );
            } );
            $( '[data-beacon-event="hover"]' ).hover( function() {
                addEntry( {
                    salonId: $( this ).data( 'beacon-id' ),
                    beacon: $( this ).data( 'beacon' )
                },
                true, true );
            } );
        };

        var addEntry = function( item, transmitNow = true, onceOnly = false ) {
            if ( !onceOnly || !( isIn( beaconCue, item ) || isIn( beaconHistory, item ) ) ) {
                beaconCue.push( item );
            }
            if ( transmitNow ) {
                transmit();
            }
        };

        var addEntries = function( items, onceOnly = false ) {
            if ( !onceOnly ) {
                beaconCue = beaconCue.concat( items );
            } else {
                items.forEach( function( record ) {
                    addEntry( record, false, true );
                } );
            }
            transmit();
        };

        var isIn = function( store, item ) {
            var isHere = false;
            store.forEach( function( record ) {
                if ( record.salonId == item.salonId && record.beacon == item.beacon ) {
                    isHere = true;
                    return false;
                }
            } );
            return isHere;
        };

        var transmit = function() {
            var urlBase = location.host == 'www.goodsalonguide.com' || location.host == 'goodsalonguide.com'  ?
                'https://beacon.goodsalonguide.com/production/beacons/log' :
                'https://beacon.goodsalonguide.com/staging/beacons/log';
            var cue = JSON.stringify( beaconCue );

            if ( beaconCue.length > 0 ) {
                $.ajax( {
                    method: 'POST',
                    contentType: 'application/json',
                    url: urlBase,
                    data: cue,
                    dataType: 'json',
                    success: function( response ) {
                        beaconHistory = beaconHistory.concat( response );
                        beaconCue = [];
                    },
                    error: function( response ) {
                        console.error( response );
                    }
                } );
            }
        };

        base.beacon = {
            init,
            addEntry,
            addEntries,
            transmit
        };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

    	var carousel = function( ) {

            var salonsForYou = $( '.salons-for-you-carousel.splide' ),
                teamMembers = $( '.team-members.splide' ),
                testimonials = $( '.testimonials.splide' ),
                brands = $( '.brands.splide' );
                $( '.nav-trending.splide' );

            if ( salonsForYou.length ) {
                var wrappers = '<div class="splide__track"><div class="splide__list"></div></div>';
                $( salonsForYou ).append( wrappers );

                $( '.salons-for-you-carousel.splide article' ).each( function( i ) {
                    $( this ).prependTo( $( salonsForYou.find( '.splide__list' ) ) );
                } );

                $( '.splide__list' ).find( 'article' ).addClass( 'splide__slide' );
                var salonsForYouSlider = new Splide( '.salons-for-you-carousel', {
                    perPage: 3,
                    arrows: false,
                    pagination: false,
                    rewind: true,
                    drag: 'free',
                    breakpoints: {
                        640: {
                            perPage: 1,
                            gap: 0
                        },
                        1024: {
                            perPage: 2,
                            gap: 50
                        },
                        1280: {
                            perPage: 3,
                            gap: 70
                        }
                    }
                } );
                salonsForYouSlider.mount();
            }

            if ( teamMembers.length ) {
                var wrappers = '<div class="splide__track"><div class="splide__list"></div></div>';
                $( teamMembers ).append( wrappers );

                var elems = $( '.team-members.splide .paragraph--type--salon-team-profile' );
                $( '<div class="team-items" />' );
                elems.length;

                // if ( pArrLen >= 1 ) {


                //     if ( matchMedia ) {
                //         const mq = window.matchMedia( '(min-width: 671px)' );
                //         mq.addListener( WidthChange );
                //         WidthChange( mq );
                //     }

                //     // media query change
                //     function WidthChange( mq ) {
                //         if ( mq.matches ) {
                //             for ( var i = 0;i < pArrLen;i += 2 ) {
                //                 elems.filter( ':eq( ' + i + ' ),:eq( ' + ( i + 1 ) + ' )' ).wrapAll( itemsWrapper );
                //             };

                //             $( '.team-members.splide .team-items' ).each( function( i ) {
                //                 $( this ).appendTo( $( teamMembers.find( '.splide__list' ) ) );
                //             } );

                //             $( '.team-members .splide__list' ).find( '.team-items' ).addClass( 'splide__slide' );
                //         } else {
                //             $( '.team-members.splide .paragraph--type--salon-team-profile' ).each( function( i ) {
                //                 $( this ).appendTo( $( teamMembers.find( '.splide__list' ) ) );
                //             } );

                //             $( '.team-members .splide__list' ).find( '.paragraph--type--salon-team-profile' ).addClass( 'splide__slide' );
                //         }
                //     };

                //     // for ( var i = 0;i < pArrLen;i += 2 ) {
                //     //     elems.filter( ':eq( ' + i + ' ),:eq( ' + ( i + 1 ) + ' )' ).wrapAll( itemsWrapper );
                //     // };

                //     // $( '.team-members.splide .team-items' ).each( function( i ) {
                //     //     $( this ).appendTo( $( teamMembers.find( '.splide__list' ) ) );
                //     // } );

                //     // $( '.team-members .splide__list' ).find( '.team-items' ).addClass( 'splide__slide' );
                // } else {
                //     $( '.team-members.splide .paragraph--type--salon-team-profile' ).each( function( i ) {
                //         $( this ).appendTo( $( teamMembers.find( '.splide__list' ) ) );
                //     } );

                //     $( '.team-members .splide__list' ).find( '.paragraph--type--salon-team-profile' ).addClass( 'splide__slide' );
                // }

                $( '.team-members.splide .paragraph--type--salon-team-profile' ).each( function( i ) {
                    $( this ).appendTo( $( teamMembers.find( '.splide__list' ) ) );
                } );

                $( '.team-members .splide__list' ).find( '.paragraph--type--salon-team-profile' ).addClass( 'splide__slide' );

                var teamMembersSlider = new Splide( '.team-members.splide', {
                    perPage: 2,
                    arrows: false,
                    pagination: false,
                    rewind: true,

                    // mediaQuery: 'min',
                    breakpoints: {
                        1024: {

                            // destroy: true,

                            perPage: 1
                        }
                    }
                } );

                teamMembersSlider.mount();

                var tmo;
                $( '.team-members #range-slider' ).attr( 'max', $( '.paragraph--type--salon-team-profile.splide__slide' ).length - 2 );
                $( '.team-members #range-slider' ).on( 'input', function() {
                  clearTimeout( tmo );
                  tmo = setTimeout( () => teamMembersSlider.go( +$( this ).val() ), 100 );
                } );

                function processHandler(len) {
                    if ( teamMembersSlider.length > len ) {
                        $( '.team-members #range-slider' ).show();
                        $( '.team-members #range-slider' ).attr('max', teamMembersSlider.length - 1);
                    } else {
                        $( '.team-members #range-slider' ).hide();
                    }
                }

                var mediaQueryTeam = window.matchMedia( '(max-width: 1024px)' );
                function handleTabletChangeTeam( e ) {
                    processHandler( e.matches ? 1 : 2);
                }

                // Register event listener
                mediaQueryTeam.addListener( handleTabletChangeTeam );

                // Initial check
                handleTabletChangeTeam( mediaQueryTeam );

                // update handler on owl change
                teamMembersSlider.on( 'move', function( property ) {
                    var newVal = teamMembersSlider.index;
                    var elem = $( '.team-members.splide' );
                    $( elem ).find( '#range-slider' ).val( newVal );
                } );

                if ( $( '.team-items' ).length < 2 ) {

                    $( '.team-items' ).removeAttr( 'style' );
                }
            }

            if ( brands.length ) {
                var wrappers = '<div class="splide__track"><div class="splide__list"></div></div>';
                $( brands ).append( wrappers );

                $( '.brands.splide .field__item .field--type-image' ).each( function( i ) {
                    $( this ).prependTo( $( brands.find( '.splide__list' ) ) );
                } );

                $( '.brands .splide__list' ).find( '.field__item' ).addClass( 'splide__slide' );
                var brandsSlider = new Splide( '.brands.splide', {
                    perPage: 1,
                    arrows: false,
                    pagination: false,
                    rewind: true,
                    drag: 'free',
                    breakpoints: {
                        640: {
                            perPage: 1,
                            gap: 0
                        },
                        1024: {
                            perPage: 2,
                            gap: 16
                        },
                        1280: {
                            perPage: 1,
                            gap: 16
                        }
                    }
                } );
                brandsSlider.mount();
            }

            if ( testimonials.length ) {

                var testimonialsSlider = new Splide( '.testimonials.splide', {
                    perPage: 2,
                    arrows: false,
                    pagination: false,
                    rewind: true,
                    breakpoints: {
                        1023: {
                            perPage: 1
                        }
                    }
                } );

                testimonialsSlider.mount();

                var tmo;
                $( '#range-slider' ).attr( 'max', $( '.field__item.splide__slide' ).length - 2 );
                $( '#range-slider' ).on( 'input', function() {
                  clearTimeout( tmo );
                  tmo = setTimeout( () => testimonialsSlider.go( +$( this ).val() ), 100 );
                } );

                // update handler on owl change
                testimonialsSlider.on( 'move', function( property ) {
                    var newVal = testimonialsSlider.index;
                    var elem = $( '.testimonials.splide' );
                    $( elem ).parent().next().val( newVal );
                } );
            }

            // Create a condition that targets viewports at least 768px wide
            var mediaQuery = window.matchMedia( '(max-width: 768px)' );
            function handleTabletChange( e ) {

                // Check if the media query is true
                if ( e.matches ) {
                    if ( $( '.header-articles' ).length ) {
                        $( '.header-articles' ).find( '.view-content.row' ).addClass( 'nav-trending splide' );
                        var headerNav = $( '.nav-trending.splide' ),
                            articles = $( '.header-menu-right form, .header-articles' );
                        if ( headerNav.length ) {
                            var wrappers = '<div class="splide__track"><div class="splide__list"></div></div>';
                            $( headerNav ).append( wrappers );

                            $( '.nav-trending.splide .col-xs-12.col-sm-6.col-md-6.col-lg-4' ).each( function( i ) {
                                $( this ).prependTo( $( headerNav.find( '.splide__list' ) ) );
                            } );

                            $( '.splide__list' ).find( '.col-xs-12.col-sm-6.col-md-6.col-lg-4' ).addClass( 'splide__slide' );
                            var headerNavSlider = new Splide( '.splide', {
                                perPage: 1,
                                arrows: false,
                                pagination: false,
                                rewind: true,
                                mediaQuery: 'min',
                                breakpoints: {
                                    768: {
                                        destroy: true,
                                        perPage: 1
                                    }
                                }
                            } );
                            headerNavSlider.mount();

                            $( '.main-menu--container' ).find( '.socials' ).before( articles );
                        }
                    }
                } else {
                    if ( $( '.header-articles' ).length ) {
                        var row = $( '.header-articles' ).find( '.view-content.row' );
                        $( '.nav-trending.splide .col-xs-12.col-sm-6.col-md-6.col-lg-4' ).each( function( i ) {
                            $( this ).prependTo( row );
                        } );
                        row.removeClass( 'nav-trending splide is-overflow is-initialized' );
                        row.find( $( '.splide__track' ), $( '.splide__list' ) ).remove();
                    }
                    // var form = $( '.main-menu--container .header-menu-right' ).find( 'form' );
                    var list = $( '.main-menu--container .header-menu-left' ).find( 'form, .header-articles' );

                    $( '.main-menu--container .header-menu-right' ).append(list);
                    // form.after( list );
                }
            }

            // Register event listener
            mediaQuery.addListener( handleTabletChange );

            // Initial check
            handleTabletChange( mediaQuery );
        };

        base.carousel = {
            init: carousel
        };

    }( window.base = window.base || {}, jQuery ) );

    (function (base, $, undefined$1) {

      var mobileHanlder = function (atts) {
        atts.mobile.append(atts.form);
      };

      var desktopHandler = function (atts) {
        atts.desktop.append(atts.form);
        atts.mobile.removeClass('open');
        atts.trigger.removeClass('open');
      };

      var responsiveFormSwitcher = function (atts) {
        var mediaQuery = window.matchMedia('(max-width: 941px)');

        function handleTabletChange(e) {
          e.matches ? mobileHanlder(atts) : desktopHandler(atts);
        }

        mediaQuery.addListener(handleTabletChange);
        handleTabletChange(mediaQuery);
      };

      var headerLeftForm = function () {
        var formWrapperDesktop = $('.header-column-start');
        var mainMenuParent = $('.main-menu').parent();
        var form = $('.header-column-start form');
        var trigger = $('<button class="header-mobile-form-trigger"><span /></button>');
        var formWrapperMobile = $('<div class="header-mobile-form-wrapper" />');

        if (form.length && !$('body').hasClass('page-node-type-salon-profile')) {
          mainMenuParent.append(formWrapperMobile);
          formWrapperDesktop.prepend(trigger);

          responsiveFormSwitcher({
            desktop: formWrapperDesktop,
            mobile: formWrapperMobile,
            form: form,
            trigger: trigger,
          });

          trigger.on('click', function () {
            formWrapperMobile.toggleClass('open');
            trigger.toggleClass('open');
            if (formWrapperMobile.hasClass('open')) formWrapperMobile.find('.location.form-text').focus();
          });
        }
      };

      var headerMenus = function () {
        headerLeftForm();
      };

      base.headerMenus = {
        init: headerMenus
      };

    }(window.base = window.base || {}, jQuery));

    ( function( base, $, undefined$1 ) {

        var header = function() {
            var hamburger = document.querySelector( '.burger' );
            var header = document.querySelector( 'header' );
            var documentBody = document.querySelector( 'body' );
            var navContainer = document.querySelector( '.main-menu' );
            if ( !navContainer ) {
                return;
            }
            var navMenu = navContainer.querySelector( '.menu' );
            var clicked = navContainer.querySelectorAll( '.menu-item--expanded' );

            // var backBtn = document.querySelector( '.back-btn' );
            var backBtn = '<a href="#" class="back-btn"> &nbsp; </a>';


            if ( $( '.user-logged-in-admin' ).length ) {
                $( '.main-menu' ).addClass( 'admin-toolbar' );
            }

            $( '.menu-item--expanded .menu' ).prepend( backBtn );

            // $( '.menu-item--expanded' ).on( 'click', function( e ) {
            //     e.preventDefault();
            //     $( '.menu-item--expanded' ).find( 'ul' ).css( 'visibility', 'hidden' );
            //     $( this ).find( 'ul' ).css( 'visibility', 'visible' );
            // } );

            // var back = $( '.back-btn' );

            $( '.menu-item--expanded' ).find( '.menu' ).css( 'visibility', 'hidden' );

            hamburger.addEventListener( 'click', function() {
                header.classList.toggle( 'open' );
                documentBody.classList.toggle( 'menu-open' );
                navMenu.classList.remove( 'sub-menu-active' );
            } );

            clicked.forEach( item => {
                item.addEventListener( 'click', function( e ) {

                    // var backBtnText = $( this ).find( 'a:first-child' ).html();
                    var backBtnText = 'Back';
                    if ( e.target.parentElement.classList.contains( 'menu-item--expanded' ) ) {
                        $( this ).find( '.menu' ).find( '.back-btn' ).html( backBtnText ).css( 'color', 'transparent' );
                        $( this ).find( '.menu' ).css( 'visibility', 'visible' );
                        e.preventDefault();
                        navMenu.classList.add( 'sub-menu-active' );
                    }
                } );

                $( '.back-btn' ).on( 'click', function( e ) {
                    $( '.menu-item--expanded' ).find( '.menu' ).css( 'visibility', 'hidden' );
                    e.preventDefault();
                    navMenu.classList.remove( 'sub-menu-active' );

                    // $( '.back-btn' ).parent().css( 'visibility', 'hidden' );
                } );

                // if ( document.body.contains( back ) ) {
                //     back.addEventListener( 'click', function( e ) {
                //         e.preventDefault();
                //         navMenu.classList.remove( 'sub-menu-active' );
                //     } );
                // }
            } );


            var navbar = $( 'header' );
            var body = $( 'body' );
            var prevScrollpos = window.pageYOffset;

            window.onscroll = function() {
                var currentScrollPos = window.pageYOffset;

                if ( prevScrollpos > 62 ) {
                    navbar.addClass( 'second-nav-hide' );
                    body.addClass( 'second-nav-hide' );
                } else {
                    navbar.removeClass( 'second-nav-hide' );
                    body.removeClass( 'second-nav-hide' );
                }

                if ( prevScrollpos >= currentScrollPos ) {
                    setTimeout( function() {
                        navbar.removeClass( 'fixed' );
                        body.removeClass( 'navbar-fixed' );
                    }, 100 );
                } else {
                    navbar.addClass( 'fixed' );
                    body.addClass( 'navbar-fixed' );
                }
                prevScrollpos = currentScrollPos;
            };
        };

        base.header = {
            init: header
        };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

        var helpers = function() {

            $( '.contact--box__location' ).on( 'click', function() {
                $( '.salon-map' ).slideToggle();
            } );

            var d = new Date();
            var actualDay = d.getDay();

            $( '.opening-hours p' ).each( function() {
                var day = $( this ).attr( 'day' );

                if ( day == actualDay ) {
                    $( this ).addClass( 'text-bold' );
                }
            } );

            if ( $( '.indent' ).length ) {
                var newLine = '<br />';
                $( '.indent' ).before( newLine );
                $( '.indent' ).parent().addClass( 'title-indent' );
            }
            $( '.top-bar__right__services' ).on( 'click', function( e ) {
                e.preventDefault();
                $( '.top-bar__right__details' ).toggleClass( 'active' );
            } );

            if ( $( '.paragraph--type--salon-team-profile' ).length ) {

                if ( $( '.team-members .splide__list .paragraph--type--salon-team-profile' ).length < 2 ) {
                    $( '.team-members' ).find( '#range-slider' ).hide();
                }


                $( '.paragraph--type--salon-team-profile' ).on( 'click', function( e ) {
                    e.preventDefault();
                    $( '.paragraph--type--salon-team-profile' ).not( $( this ) ).removeClass( 'unwrap' );

                    if ( $( '.team-members' ).hasClass( 'unwrap' ) ) {
                        $( '.team-members' ).removeClass( 'unwrap' );
                    } else {
                        $( '.team-members' ).addClass( 'unwrap' );
                    }

                    $( this ).toggleClass( 'unwrap' );
                    $( '.team-members' ).removeClass( 'unwrap' );

                    // $( this ).find( '.members-descr__more' ).text( 'Show less' );

                    var text = $( this ).find( '.members-descr__more' ).text() == 'Read more' ? 'Show less' : 'Read more';
                    $( this ).find( '.members-descr__more' ).text( text );

                    // $( '.team-members' ).find( '#range-slider' ).hide();

                    // if ( !$( '.unwrap' ).length ) {
                    //     $( '.team-members' ).find( '#range-slider' ).show();
                    // }
                } );
            }

            // if ( matchMedia ) {
            //     const mq = window.matchMedia( '(max-width: 671px)' );
            //     mq.addListener( WidthChange );
            //     WidthChange( mq );
            // }

            // function WidthChange( mq ) {
            //     if ( mq.matches ) {
            //         $( '.salon-profile__section' ).each( function() {
            //             var screenHeight = $( window ).height(),
            //                 readMore = '<a href="#" class="unwrap-more">Read more</a>';
            //             $( this ).each( function() {
            //                 if ( $( this ).height() > screenHeight ) {

            //                     $( this ).find( '.text-col' ).height( '500px' );
            //                     $( this ).append( readMore );
            //                 }
            //             } );

            //         } );
            //     } else {
            //         $( '.salon-profile__section' ).removeAttr( 'style' );
            //         $( '.unwrap-more' ).remove();
            //     }
            // };


            // $( '.unwrap-more' ).on( 'click', function( e ) {
            //     e.preventDefault();

            //     $( this ).parent().removeAttr( 'style' );
            //     $( this ).hide();
            // } );

            // if ( $( '.user-register-form' ).length || $( '.user-login-form' ).length ) {

            //     function focusedInput() {
            //         var autofilledInput = $( 'input:-webkit-autofill' );

            //         if ( autofilledInput ) {
            //             $( 'input:-webkit-autofill' ).prev().hide();
            //         }
            //     }

            //     $( 'body' ).on( 'click', function() {
            //         $( '.user-register-form, .user-login-form' ).find( 'label' ).show();
            //         focusedInput();
            //     } );
            //     $( '.user-register-form, .user-login-form' ).on( 'click', function( e ) {
            //         e.stopPropagation();
            //         focusedInput();
            //     } );

            //     $( '.user-register-form, .user-login-form' ).find( 'input' ).on( 'click', function() {
            //         $( '.js-form-item label' ).show();
            //         $( this ).prev().hide();
            //         focusedInput();
            //     } );

            //     setTimeout( () => {
            //         focusedInput();
            //     }, 500 );
            // }


            if ( matchMedia ) {
                const mq = window.matchMedia( '(max-width: 768px)' );
                mq.addListener( WidthChange );
                WidthChange( mq );
            }

            function WidthChange( mq ) {
                if ( mq.matches ) {
                    if ( $( '.image-col img' ).length ) {
                        var heroSlider = '<div class="hero-slider splide"><span class="hero-slider__number"></span><div class="splide__track"><div class="splide__list"></div></div><input type="range" step="1" min="0" max="" value="0" class="slider slides-handler" id="range-slider"></div>';
                        $( '.salon-profile-page' ).prepend( heroSlider );
                        $( '.image-col img' ).clone().appendTo( $( '.hero-slider' ).find( '.splide__list' ) );
                        $( '.hero-slider' ).find( '.splide__list' ).find( 'img' ).addClass( 'splide__slide' );
                        $( '.image-col img' ).hide();
                        var salonHeroSlider = new Splide( '.hero-slider.splide', {
                            perPage: 1,
                            arrows: false,
                            pagination: false,
                            rewind: true
                        } );
                        salonHeroSlider.mount();

                        $( '.hero-slider__number' ).html( $( '.hero-slider' ).find( '.is-active' ).attr( 'aria-label' ) );
                        salonHeroSlider.on( 'moved', function() {
                            $( '.hero-slider__number' ).html( $( '.hero-slider' ).find( '.is-active' ).attr( 'aria-label' ) );
                        } );


                        var tmo;
                        $( '.hero-slider #range-slider' ).attr( 'max', $( '.hero-slider' ).find( 'img' ).length - 1 );
                        $( '.hero-slider #range-slider' ).on( 'input', function() {
                          clearTimeout( tmo );
                          tmo = setTimeout( () => salonHeroSlider.go( +$( this ).val() ), 100 );
                        } );

                        // update handler on slider change
                        salonHeroSlider.on( 'move', function( property ) {
                            var newVal = salonHeroSlider.index;
                            var elem = $( '.hero-slider.splide' );
                            $( elem ).find( '#range-slider' ).val( newVal );
                        } );

                    }
                } else {
                    $( '.hero-slider' ).remove();
                    $( '.image-col img' ).show();
                }
            }
            $( '.view-help-categories' ).find( '#views-exposed-form-help-categories-terms input' ).on( 'click', function() {
                $( this ).prev( 'label' ).hide();
            } );
            $( '.view-help-categories' ).find( '#views-exposed-form-help-categories-terms input' ).blur( function() {
                if ( !$( this ).val() ) {
                    $( this ).prev( 'label' ).show();
                }
            } );
        };

        base.helpers = {
            init: helpers
        };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

        var messages = function() {
            $( 'body' ).click( function() {
                if ( $( '[data-drupal-messages]' ).length ) {
                    $( '[data-drupal-messages]' ).fadeOut( 400 );
                }
            } );

        };

        base.messages = {
            init: messages
        };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

      var pager = function() {
          $( '.js-pager__items.pager' ).each( function() {
            var pager = $( this ).find( '.pager__item a' );
            $( 'body' );
            var items = $( this ).parent().find( '.teaser' ).length,
            max = pager.attr( 'total-pages' ),
            label = '<span class="text-bold">You have viewed ' + items + ' of ' + max + ' articles<span/>';


            var progressWidth = parseInt( items ) / parseInt( max ) * 100;
            var progress = '<div class="progressbar"><span class="progressbar-top"></span><span class="progressbar-bottom" style="width:' + progressWidth + '%;"></span></div>';
            $( this ).prepend( progress );
            $( this ).prepend( label );
          } );
      };

      base.pager = {
          init: pager
      };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

        var skipElements = function(elem) {
            var tags = [ 'EM', 'STRONG', 'BR', 'A' ];

            return elem.hasClass('socials') || tags.includes(elem.prop("tagName"));
        };

        var eachElement = function(self, originalHeight, progress, textCol, screenHeight, children) {
            self.removeClass('hidden');
            
            if ( textCol.outerHeight() / screenHeight > progress ) {
                self.addClass( 'hidden' );

                if ( textCol.outerHeight() <= originalHeight ) {
                    self.removeClass('hidden');
                }

                return true;
            } 

            return false;
        };

        var makeProgress = function(originalHeight, progress, children, textCol, screenHeight, readMore, scroll) {
            for ( let i = 0; i < children.length; i++ ) {
                var response = eachElement(children[i], originalHeight, progress, textCol, screenHeight);
                
                if ( response ) break; 
            }
            
            if (scroll) {
                $('html, body').animate({
                    scrollTop: children[0].offset().top - 100
                }, 1000);
            }

            children = children.filter( function( item ) {
                return item.hasClass('hidden');
            } );

            if ( children.length == 1 ) {
                children[0].removeClass('hidden');
                readMore.hide();
                return [];
            } else {
                if ( !children.length ) readMore.hide();
        
                return children;
            }

        };

        var readMore = function() {

            var sections = $('.salon-profile__section');
            // var sections = $('.salon-profile__section, .salons-profile__header-section');
            var header = $('.header');

            if ( sections.length ) {
                sections.each(function() {
                    var section = $(this);
                    var screenHeight = window.innerHeight - header.outerHeight();
                    var textCol = section.find('.text-col');
                    var textColWrapper = section.find('.text-col-wrapper');
                    var progress = 1.2;
                    var children = [];

                    if ( textCol.outerHeight() / screenHeight < 1.3 ) {
                        if ( textCol.outerHeight() < screenHeight * 0.8 ) {
                            textCol.parents('.row').addClass('small-text');
                        }
                    } else {
                        textColWrapper.parent().append('<div class="read-more-wrapper"><a class="read-more" href="#">Read more</a></div>');
                        var readMore = textColWrapper.parent().find('.read-more');

                        textCol.children().each(function() {
                            // skip elements
                            if ( skipElements( $(this) ) ) return; 

                            if ( $(this).children().length ) {
                                children.push($(this));
                                $(this).children().each(function() {
                                    if ( skipElements( $(this) ) ) return; 

                                    children.push( $(this) );
                                });
                            } else {
                                children.push($(this));
                            }
                        });

                        if ( children.length ) {
                            children.forEach(function(elem) {
                                elem.addClass('hidden');
                            });
                        }

                        children = makeProgress(textCol.children().outerHeight(), progress, children, textCol, screenHeight, readMore, false);
                        readMore.on( 'click', function(e) {
                            e.preventDefault();
                            progress++;
                            children = makeProgress(textCol.children().outerHeight(), progress, children, textCol, screenHeight, readMore, true);
                            
                            return false;
                        } );
                    }
                    
                    window.innerWidth > 768 && textColWrapper.css('min-height', section.height());
                });
            }

            if ( $( '.salon-profile__section.review' ).length  ) {
                var section = $( '.salon-profile__section.review' );
                var textColWrapper = section.find( '.text-col-wrapper' );
                var reviews = $( '.view-id-reviews' ).find( '.views-row' );
                if ( reviews.length > 4 ) {

                    // console.log( $( '.view-id-reviews' ).find( '.views-row' ).length );
                    $( '.salon-profile__section.review .text-col-wrapper' ).css( 'min-height', 'auto' );
                    $( '.view-id-reviews .view-content .views-row:gt(4)' ).hide();
                    $( '.salon-profile__section.review' ).find( '.read-more' ).parent().remove();
                    textColWrapper.parent().append( '<div class="more-review-wrapper"><a class="more-review" href="#">Show more reviews</a></div>' );
                    $( '.more-review' ).on( 'click', function( e ) {
                        e.preventDefault();
                        $( '.view-id-reviews .view-content .views-row' ).show();
                        $( this ).hide();
                    } );
                }
            }

        };

        base.readMore = {
            init: readMore
        };

    }( window.base = window.base || {}, jQuery ) );

    ( function( base, $, undefined$1 ) {

        var responsiveIframe = function() {
            if ( $( 'iframe' ).length ) {
                $( 'iframe[src*="youtube.com"],iframe[src*="vimeo.com"]' ).wrap( '<div class="responsive-iframe"></div>' );
            }

            if ( $( 'table' ).length ) {
                $( 'table' ).wrap( '<div class="responsive-table"></div>' );
            }

            if(!$('body').hasClass('is-member')){
              $('[data-drupal-link-system-path="node/165848"]').remove();
            }

            if($('.reveal-pass').length){
              $('.reveal-pass').on('click', function(){
                if($(this).hasClass('active')){
                  $(this).removeClass('active');
                  $('#edit-pass').attr('type','password');
                }else {
                  $(this).addClass('active');
                  $('#edit-pass').attr('type','text');
                }
              });
            }

            if($('.back-to-search-link').length){
              $('.back-to-search-link').on('click', function(e){
                e.preventDefault();
                history.back();
              });
            }
        };

        base.responsiveIframe = {
            init: responsiveIframe
        };

    }( window.base = window.base || {}, jQuery ) );

})();
//# sourceMappingURL=custom.js.map
