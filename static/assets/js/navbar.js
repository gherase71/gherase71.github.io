/**
 * JS: Manages the mobile navbar — hamburger toggle and Research dropdown.
 * Usage: layouts/_default/baseof.html
 *
 * Behaviour:
 *   - Hamburger button opens/closes the full nav menu on mobile.
 *   - The "Research" dropdown opens on hover (CSS) on desktop, and on click
 *     (JS) on mobile, so both cases are handled without interfering.
 *   - All DOM queries are guarded: if an element is missing the script exits
 *     cleanly instead of throwing an uncaught TypeError.
 */

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------------------------------
    // Element references — bail out early if any required element is absent.
    // -----------------------------------------------------------------------

    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    const dropbtn   = document.getElementById('dropbtn-research');
    const dropdown  = document.getElementById('dropdown-research');

    if (!hamburger || !navMenu || !dropbtn || !dropdown) {
        console.warn('navbar.js: one or more expected elements were not found in the DOM.');
        return;
    }


    // -----------------------------------------------------------------------
    // Hamburger — toggles the full nav menu open/closed on mobile.
    // -----------------------------------------------------------------------

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);

        // Keep screen readers in sync with the visible state.
        hamburger.setAttribute('aria-expanded', isOpen);
    });


    // -----------------------------------------------------------------------
    // Research dropdown — only intercept clicks on mobile.
    // On desktop the dropdown is handled entirely by CSS (:hover).
    // -----------------------------------------------------------------------

    dropbtn.addEventListener('click', (e) => {
        // Check whether the hamburger is visible to determine if we're on mobile.
        const isMobile = window.getComputedStyle(hamburger).display !== 'none';

        if (isMobile) {
            // Prevent the click from bubbling up and immediately closing the menu.
            e.stopPropagation();
            dropdown.classList.toggle('open');
        }
    });

});