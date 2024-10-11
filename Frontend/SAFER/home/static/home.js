document.addEventListener('DOMContentLoaded', function () {
  var swiper = new Swiper(".mySwiper", {
      loop: true, // Enable loop
      autoplay: {
          disableOnInteraction: false, // Keep autoplay after interaction
      },
      speed: 300, // Transition speed in milliseconds (800ms = 0.8 seconds)
  });
});

