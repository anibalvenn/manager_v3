// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Get the current page URL
  const currentPage = window.location.pathname;

  // Get all links in the navbar
  const navbarLinks = document.querySelectorAll('.nav-link');

  // Loop through each link
  navbarLinks.forEach(function(link) {
    // Check if the link's href matches the current page URL
    if (link.getAttribute('href') === currentPage) {
      // Apply a different style to the selected link
      link.classList.add('selected');
    }
  });
});
