document.addEventListener('DOMContentLoaded', function () {
  var swiper = new Swiper(".mySwiper", {
      loop: true, // Enable loop
      lazy: true,
      preloadImages: false,
      autoplay: {
          delay: 5000, // 5 seconds
          disableOnInteraction: false, // Keep autoplay after interaction
      } // Transition speed in milliseconds (800ms = 0.8 seconds)
  });
});

