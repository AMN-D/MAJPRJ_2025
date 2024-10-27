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
const threshold = 25; // Set the threshold in pixels

// Function to handle the header hiding/showing
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop === 0) {
    // Always show the header when at the top of the page
    header.style.top = "0";
  } else if (scrollTop > lastScrollTop + threshold) {
    // User scrolled down more than the threshold - hide the header
    header.style.top = "-100vh"; // Adjust according to your header's height
  } else if (scrollTop < lastScrollTop - threshold) {
    // User scrolled up more than the threshold - show the header
    header.style.top = "0";
  }

  lastScrollTop = scrollTop; // Update lastScrollTop
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
      640: {
        // Up to 640px width
        slidesPerView: 1, // Show only 1 slide at a time
      },
      768: {
        // Up to 768px width
        slidesPerView: 2, // Show only 1 slide at a time
      },
      1024: {
        // Up to 1024px width
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

  let hideTimeout = null;
  let isFadingOut = false;

  // Set initial text content for heading based on screen width
  if (headingTitle) {
    headingTitle.textContent =
      window.innerWidth < 1024
        ? "Click over a card to explore"
        : "Hover over a card to explore";
  }

  // Function to show video as background and change the title instantly
  const showVideoBackground = (event) => {
    const card = event.currentTarget;
    const videoFileName = card.getAttribute("data-video");
    const newTitle = card.getAttribute("data-title");
    const newColor = card.getAttribute("data-color");

    // Cancel any ongoing fade-out action
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    isFadingOut = false;

    // Update the video source if it has changed
    if (
      backgroundVideo &&
      videoSource &&
      !videoSource.src.includes(videoFileName)
    ) {
      videoSource.src = `../static/card/${videoFileName}`;
      backgroundVideo.load();
    }

    // Play the video and ensure it is visible
    backgroundVideo.play();
    backgroundVideo.style.opacity = "1";
    backgroundVideo.style.visibility = "visible";

    // Update the heading title
    if (headingTitle) {
      headingTitle.textContent = newTitle;
    }

    // Update the line color smoothly
    if (lineElement) {
      lineElement.style.transition = "background-color 0.5s ease";
      lineElement.style.backgroundColor = newColor;
    }
  };

  // Function to hide video as background with fade-out effect
  const hideVideoBackground = () => {
    if (isFadingOut) return;
    isFadingOut = true;

    // Add a delay before hiding to avoid glitchy transitions
    hideTimeout = setTimeout(() => {
      if (backgroundVideo) {
        backgroundVideo.style.opacity = "0";
        setTimeout(() => {
          backgroundVideo.style.visibility = "hidden";
          isFadingOut = false;
        }, 200); // Match the CSS transition duration (500ms)
      }

      // Reset the heading title back to default
      if (headingTitle) {
        headingTitle.textContent =
          window.innerWidth < 1024
            ? "Click over a card to explore"
            : "Hover over a card to explore";
      }

      // Reset the line color to default smoothly
      if (lineElement) {
        lineElement.style.transition = "background-color 0.5s ease";
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

document.addEventListener("DOMContentLoaded", function () {
  const learnMoreLink = document.querySelector(".learn-more.vcm");
  const overlay = document.getElementById("info-overlay");
  const closeButton = document.getElementById("close-overlay");

  // Show overlay on link click
  learnMoreLink.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior
    overlay.classList.add("active");
  });

  // Close overlay on button click
  closeButton.addEventListener("click", function () {
    overlay.classList.remove("active");
  });

  // Optional: Close overlay when clicking outside the content
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const learnMoreLinks = document.querySelectorAll(".learn-more.vcm");

  learnMoreLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default link behavior
      const targetUrl = this.getAttribute("data-target"); // Get target URL

      // Get the current page and apply slide-out class
      const currentPage = document.body;
      currentPage.classList.add("slide-out");

      // Create a new page element for the transition
      const newPage = document.createElement('div');
      newPage.className = 'page slide-in'; // Prepare new page to slide in
      document.body.appendChild(newPage);

      // Load the new page content
      fetch(targetUrl)
        .then(response => response.text())
        .then(data => {
          newPage.innerHTML = data; // Insert new content
          currentPage.style.display = 'none'; // Hide current page
          newPage.classList.remove('slide-in'); // Remove class to slide in
        });

      // Optional: Add a delay before removing the current page
      setTimeout(() => {
        currentPage.style.display = 'none'; // Hide current page
        newPage.classList.remove('slide-in'); // Trigger the slide-in effect
      }, 500); // Match this duration with your CSS transition duration
    });
  });
});










