document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".mySwiper", {
    loop: true, // Enable loop
    autoplay: {
      delay: 5000, // 5 seconds
      disableOnInteraction: false, // Keep autoplay after interaction
    },
    speed: 300, // Transition speed in milliseconds (800ms = 0.8 seconds)
  });
});

let lastScrollTop = 0;
const header = document.querySelector("header");
let isScrolling;
// Function to handle the header hiding/showing
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    // User scrolled down - hide the header
    header.style.top = "-100vh"; // Adjust according to your header's height
  } else {
    // User scrolled up - show the header
    header.style.top = "0";
  }
  lastScrollTop = scrollTop;
}
// Debounce to limit the rate of scroll event handling
window.addEventListener("scroll", () => {
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(handleScroll, 10); // Adjust time for smoother response
});

document.addEventListener("DOMContentLoaded", function () {
  var cardSwiper = new Swiper(".myUniqueCardSwiper", {
    slidesPerView: 5, // Number of cards visible at once
    spaceBetween: 10, // Space between cards
    loop: false, // Enables continuous loop mode
    centeredSlides: false,
    grabCursor: true,
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 10, 
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 15, 
      },
      1024: {
        slidesPerView: 4.5,
        spaceBetween: 15, 
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const gradientBackground = document.querySelector(".gradient-background");

  if (gradientBackground) {
    // Function to update the gradient position smoothly
    const updateGradientPosition = (event) => {
      // Calculate the position of the cursor relative to the gradient container
      const rect = gradientBackground.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      // Get the dimensions of the gradient container
      const { clientWidth, clientHeight } = gradientBackground;

      // Calculate the percentage position of the mouse within the container
      const xPosPercent = (offsetX / clientWidth) * 100;
      const yPosPercent = (offsetY / clientHeight) * 100;

      // Update the gradient's position dynamically to follow the cursor smoothly
      gradientBackground.style.background = `radial-gradient(circle at ${xPosPercent}% ${yPosPercent}%, #4b2840, #3b1e5c, #0f0f0f)`;
    };

    // Add an event listener for mouse movement on the entire document
    document.addEventListener("pointermove", (event) => {
      updateGradientPosition(event);
    });

    // Prevent click-and-drag from stopping the gradient update
    gradientBackground.addEventListener("pointerdown", (event) => {
      event.preventDefault(); // Prevents the default drag behavior
      updateGradientPosition(event); // Update the gradient position on pointer down
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const gradientBackground = document.querySelector(".gradient-background");
  const backgroundVideo = document.querySelector(".background-video");
  const cards = document.querySelectorAll(".unique-card");

  let hideTimeout; // Timeout reference for delayed hide

  // Function to show video as background
  const showVideoBackground = () => {
    // Clear any pending hide actions if the user hovers onto another card
    clearTimeout(hideTimeout);
    if (backgroundVideo) {
      backgroundVideo.style.opacity = 1; // Set opacity to 100% for full visibility
      backgroundVideo.style.visibility = "visible"; // Make sure the video is visible
    }
  };

  // Function to hide video as background with fade-out effect
  const hideVideoBackground = () => {
    // Add a delay before hiding to avoid glitchy transitions
    hideTimeout = setTimeout(() => {
      if (backgroundVideo) {
        backgroundVideo.style.opacity = 0; // Fade out the video
        setTimeout(() => {
          backgroundVideo.style.visibility = "hidden"; // Hide the video after fading out
        }, 500); // Match the CSS transition duration (500ms)
      }
    }, 200); // Delay to prevent glitchiness when switching quickly (200ms)
  };

  // Attach mouse enter and leave events to each card
  cards.forEach((card) => {
    card.addEventListener("mouseenter", showVideoBackground);
    card.addEventListener("mouseleave", hideVideoBackground);
  });

  // Optional: Reset the gradient position when the mouse leaves the container
  gradientBackground?.addEventListener("mouseleave", () => {
    gradientBackground.style.background = "radial-gradient(circle at center, #4b2840, #3b1e5c, #0f0f0f)";
  });
});















