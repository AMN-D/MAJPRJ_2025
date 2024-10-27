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
     // Number of cards visible at once for larger screens
    spaceBetween: 10, // Space between cards
    loop: false, // Enables continuous loop mode
    centeredSlides: false,
    grabCursor: true,
    breakpoints: {
      640: { // Up to 640px width
        slidesPerView: 1, // Show only 1 slide at a time
      },
      768: { // Up to 768px width
        slidesPerView: 2, // Show only 1 slide at a time
      },
      1024: { // Up to 1024px width
        slidesPerView: 3.9, // Show 2 slides at a time
      },
      // You can add more breakpoints if needed
    },
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const gradientBackground = document.querySelector(".gradient-background");

  if (gradientBackground) {
    // Store last known gradient position
    let lastXPosPercent = 50; // Default to the center initially
    let lastYPosPercent = 50; // Default to the center initially

    // Function to update the gradient position smoothly
    const updateGradientPosition = (event) => {
      // Calculate the position of the cursor relative to the gradient container
      const rect = gradientBackground.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      // Get the dimensions of the gradient container
      const { clientWidth, clientHeight } = gradientBackground;

      // Calculate the percentage position of the mouse within the container
      let xPosPercent = (offsetX / clientWidth) * 100;
      let yPosPercent = (offsetY / clientHeight) * 100;

      // Ensure values are between 0% and 100% to avoid unexpected behavior
      xPosPercent = Math.max(0, Math.min(100, xPosPercent));
      yPosPercent = Math.max(0, Math.min(100, yPosPercent));

      // Update the gradient's position dynamically to follow the cursor smoothly
      gradientBackground.style.background = `radial-gradient(circle at ${xPosPercent}% ${yPosPercent}%, #4b2840, #3b1e5c, #0f0f0f)`;

      // Store the last known position to maintain when the cursor leaves
      lastXPosPercent = xPosPercent;
      lastYPosPercent = yPosPercent;
    };

    // Add an event listener for mouse movement within the gradient container
    document.addEventListener("pointermove", (event) => {
      updateGradientPosition(event);
    });

    // Add an event listener to maintain the last gradient position when leaving the window
    document.addEventListener("mouseleave", () => {
      // Maintain the gradient at the last known position
      gradientBackground.style.background = `radial-gradient(circle at ${lastXPosPercent}% ${lastYPosPercent}%, #4b2840, #3b1e5c, #0f0f0f)`;
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const gradientBackground = document.querySelector(".gradient-background");
  const backgroundVideo = document.querySelector(".background-video");
  const videoSource = backgroundVideo.querySelector("source");
  const cards = document.querySelectorAll(".unique-card");
  const headingTitle = document.querySelector(".heading-title");
  const lineElement = document.querySelector(".line");

  let hideTimeout; // Timeout reference for delayed hide

  // Function to show video as background and change the title instantly
  const showVideoBackground = (event) => {
    const card = event.currentTarget; // Get the card that triggered the event
    const videoFileName = card.getAttribute("data-video"); // Get the video file name from data attribute
    const newTitle = card.getAttribute("data-title"); // Get the new title from data attribute
    const newColor = card.getAttribute("data-color"); // Get the new line color from data attribute

    if (backgroundVideo && videoSource) {
      clearTimeout(hideTimeout);

      // Update the video source only if it's different
      if (!videoSource.src.includes(videoFileName)) {
        videoSource.src = `../static/card/${videoFileName}`;
        backgroundVideo.load();
      }

      backgroundVideo.play();
      backgroundVideo.style.opacity = 1;
      backgroundVideo.style.visibility = "visible";
    }

    // Update the heading title instantly
    if (headingTitle) {
      headingTitle.textContent = newTitle;
    }

    // Update the line color smoothly
    if (lineElement) {
      lineElement.style.backgroundColor = newColor;
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
        }, 500);
      }

      // Reset the heading title back to default
      if (headingTitle) {
        headingTitle.textContent = "Hover over a card to explore";
      }

      // Reset the line color to default smoothly
      if (lineElement) {
        lineElement.style.backgroundColor = "#e2e2e2";
      }
    }, 200); // Delay to prevent glitchiness when switching quickly (200ms)
  };

  // Attach mouse enter and leave events to each card
  cards.forEach((card) => {
    card.addEventListener("mouseenter", showVideoBackground);
    card.addEventListener("mouseleave", hideVideoBackground);
  });

  // Prevent resetting the gradient position to center when leaving
  gradientBackground?.addEventListener("mouseleave", () => {
    // Do not reset the gradient, maintain its last known position
  });
});




