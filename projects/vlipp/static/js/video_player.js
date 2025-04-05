document.addEventListener("DOMContentLoaded", function () {
    const videosContainer = document.querySelector(".custom_carousel-videos");
    const videos = document.querySelectorAll(".custom_carousel-videos video");
    const dotsContainer = document.querySelector(".custom_carousel-dots");
    const prevBtn = document.getElementById("custom_prev-btn");
    const nextBtn = document.getElementById("custom_next-btn");

    // Initialize the carousel
    let currentIndex = 0;

    // Create dots dynamically
    videos.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("custom_dot");
      if (index === 0) dot.classList.add("custom_active");
      dot.addEventListener("click", () => {
        custom_changeVideo(index);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".custom_carousel-dots .custom_dot");

    function custom_changeVideo(index) {
      // Pause the current video
      videos[currentIndex].pause();

      // Update the active dot and index
      dots[currentIndex].classList.remove("custom_active");
      currentIndex = index;
      dots[currentIndex].classList.add("custom_active");

      // Apply transform for smooth scrolling
      const offset = -currentIndex * 900; // 900px is the width of each video
      videosContainer.style.transform = `translateX(${offset}px)`;

      // Play the new video
      videos[currentIndex].currentTime = 0; // Reset to the beginning
      videos[currentIndex].play();
    }

    function custom_showNextVideo() {
      const nextIndex = (currentIndex + 1) % videos.length; // Loop back to the first video
      custom_changeVideo(nextIndex);
    }

    function custom_showPrevVideo() {
      const prevIndex = (currentIndex - 1 + videos.length) % videos.length; // Loop back to the last video
      custom_changeVideo(prevIndex);
    }

    // Add event listeners for buttons
    nextBtn.addEventListener("click", custom_showNextVideo);
    prevBtn.addEventListener("click", custom_showPrevVideo);

    // Add event listener for video end
    videos.forEach((video) => {
      video.addEventListener("ended", custom_showNextVideo);
    });

    // Show the first video initially
    custom_changeVideo(0);
  });