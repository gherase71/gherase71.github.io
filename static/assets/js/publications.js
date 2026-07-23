/**
 * JS: Get your publications from the HAL API, parse and display them.
 *     Manage buttons of selected publications and all publications.
 *     Generate the year filter.
 * Usage: content/research/publications.md
 */



( function () {
    'use strict';

    var cfg = {
        // ==========================================================
        // HAL API url
        // By default this searches by author full name (authFullName_t).
        // Replace "Firstname Lastname" with your own name, or, for a more
        // reliable match, use your HAL author identifier instead:
        // https://api.archives-ouvertes.fr/search/?q=authIdHal_s:your-hal-id&...
        // ==========================================================
        halUrl: 'https://api.archives-ouvertes.fr/search/?q=structId_i:1548325+AND+authFullName_t:"Cristian Preda"&rows=500&fl=title_s,authFullName_s,producedDateY_i,journalTitle_s,abstract_s,uri_s&sort=producedDateY_i+desc&wt=json',
        loading: 'Loading publications…',
        error: 'Unable to load publications. Please try again later.',
        noResults: 'No publications found.',
        visitHal: 'View on HAL'
    };

    var halLoaded = false;
    var buttons   = document.querySelectorAll( '.pub_toggle_btn' );
    var sections  = document.querySelectorAll( '.pub_section' );
    var halSelect = document.getElementById( 'pub_filter_hal' );


    // -----------------------------------------------------------------------
    // Tab toggle
    // -----------------------------------------------------------------------
    buttons.forEach( function ( btn ) {
        btn.addEventListener( 'click', function () {
            var target = btn.dataset.target;

            buttons.forEach( function ( b ) {
                b.classList.remove( 'pub_toggle_btn--active' );
                b.setAttribute( 'aria-selected', 'false' );
            } );
            btn.classList.add( 'pub_toggle_btn--active' );
            btn.setAttribute( 'aria-selected', 'true' );

            sections.forEach( function ( s ) {
                s.classList.remove( 'pub_section--active' );
                s.setAttribute( 'aria-hidden', 'true' );
            } );
            var active = document.getElementById( 'pub_section_' + target );
            if ( active ) {
                active.classList.add( 'pub_section--active' );
                active.setAttribute( 'aria-hidden', 'false' );
            }

            if ( target === 'hal' ) {
                fetchHAL();
            }
        } );
    } );


    // -----------------------------------------------------------------------
    // Year filter logic
    // -----------------------------------------------------------------------
    var majorSelect = document.getElementById( 'pub_filter_major' );
    if ( majorSelect ) {
        majorSelect.addEventListener( 'change', function () {
            applyYearFilter( '#pub_section_major .pub_card', majorSelect.value );
        } );
    }

    function attachHalYearFilter() {
        if ( ! halSelect ) { return; }
        halSelect.addEventListener( 'change', function () {
            applyYearFilter( '#pub_section_hal .pub_card', halSelect.value );
        } );
    }

    function applyYearFilter( selector, year ) {
        document.querySelectorAll( selector ).forEach( function ( card ) {
            card.style.display = ( year === 'all' || card.dataset.year === year ) ? '' : 'none';
        } );
    }


    // -----------------------------------------------------------------------
    // HAL fetch & render
    // -----------------------------------------------------------------------
    function fetchHAL() {
        if ( halLoaded || ! cfg.halUrl ) { return; }

        var section     = document.getElementById( 'pub_section_hal' );
        var placeholder = section && section.querySelector( '.pub_hal_placeholder' );
        
        if ( placeholder ) placeholder.textContent = cfg.loading;

        fetch( cfg.halUrl )
            .then( function ( response ) { return response.json(); } )
            .then( function ( data ) {
                halLoaded = true;
                renderHAL( data.response.docs, section );
            } )
            .catch( function ( err ) {
                console.error( 'HAL fetch failed:', err );
                if ( placeholder ) {
                    placeholder.textContent = cfg.error;
                    placeholder.classList.add( 'pub_error' );
                }
            } );
    }

    function renderHAL( docs, section ) {
        var placeholder = section.querySelector( '.pub_hal_placeholder' );
        if ( placeholder ) placeholder.remove();

        if ( ! docs || docs.length === 0 ) {
            section.insertAdjacentHTML( 'beforeend', '<p class="pub_empty">' + escHtml( cfg.noResults ) + '</p>' );
            return;
        }

        var years = [];
        var html  = '<div class="pub_grid">';

        docs.forEach( function ( pub ) {
            var title    = pub.title_s ? pub.title_s[0] : 'Untitled';
            var authors  = pub.authFullName_s ? pub.authFullName_s.join( ', ' ) : '';
            var year     = pub.producedDateY_i ? String( pub.producedDateY_i ) : '';
            var journal  = pub.journalTitle_s || '';
            var uri      = pub.uri_s || '';
            var abstract = pub.abstract_s ? pub.abstract_s[0] : '';

            if ( year && years.indexOf( year ) === -1 ) years.push( year );

            html += '<div class="pub_card" data-year="' + escAttr( year ) + '">';
            html += '<div class="pub_card_infos">';
            html += '<h3 class="pub_title">' + escHtml( title ) + '</h3>';
            if ( authors ) html += '<p class="pub_authors">' + escHtml( authors ) + '</p>';
            var meta = [];
            if ( year ) meta.push( escHtml( year ) );
            if ( journal ) meta.push( escHtml( journal ) );
            if ( meta.length ) html += '<p class="pub_meta">' + meta.join( ' · ' ) + '</p>';
            html += '</div>';
            if ( abstract ) html += '<p class="pub_abstract">' + escHtml( abstract.substring(0, 200) ) + (abstract.length > 200 ? '…' : '') + '</p>';
            if ( uri ) html += '<a class="pub_link" href="' + escAttr( uri ) + '" target="_blank" rel="noopener noreferrer">' + escHtml( cfg.visitHal ) + '</a>';
            html += '</div>';
        } );

        html += '</div>';
        section.insertAdjacentHTML( 'beforeend', html );

        if ( halSelect ) {
            years.sort( function ( a, b ) { return Number( b ) - Number( a ); } );
            years.forEach( function ( y ) {
                var opt = document.createElement( 'option' );
                opt.value = y;
                opt.textContent = y;
                halSelect.appendChild( opt );
            } );
            halSelect.disabled = false;
            attachHalYearFilter();
        }
    }

    // Escaping
    function escHtml( str ) { return String( str ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&#039;' ); }
    function escAttr( str ) { return String( str ).replace( /"/g, '&quot;' ).replace( /'/g, '&#039;' ); }

    // Note: selected publication cards already have their data-year attribute set
    // at build time by the Hugo template (layouts/partials/publication-card.html),
    // so no client-side stamping is needed here.

}() );