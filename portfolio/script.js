// Initialize EmailJS
(function () {
  emailjs.init("DM1brbjs8Tjil1RjT"); // Your actual public key
})();

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
    });

    // Close mobile menu after clicking
    document.getElementById("nav-menu").classList.remove("active");
    document.getElementById("hamburger").classList.remove("active");
  });
});

// Hamburger menu toggle
document.getElementById("hamburger").addEventListener("click", function () {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("active");
  this.classList.toggle("active");
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

// Simple animation for skills on hover
document.querySelectorAll(".skill").forEach((skill) => {
  skill.addEventListener("mouseenter", () => {
    skill.style.transform = "scale(1.05)";
  });
  skill.addEventListener("mouseleave", () => {
    skill.style.transform = "scale(1)";
  });
});

// Add some dynamic content or effects if needed
// For example, a simple typewriter effect for the hero text
const heroText = document.querySelector(".hero-content h1");
const text = heroText.textContent;
heroText.textContent = "";
let i = 0;

function typeWriter() {
  if (i < text.length) {
    heroText.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}

// Start typewriter effect after page load
window.addEventListener("load", () => {
  setTimeout(typeWriter, 1000);
});

// Contact form submission with EmailJS
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("from_name").value.trim();
  const email = document.getElementById("from_email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validate form
  if (!name || !email || !subject || !message) {
    showFormMessage("Please fill in all required fields.", "error");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage("Please enter a valid email address.", "error");
    return;
  }

  // EmailJS configuration
  const serviceID = "service_xbnkqbl";
  const templateID = "template_qkwmn5u";
  const publicKey = "DM1brbjs8Tjil1RjT";

  // Prepare template parameters
  const templateParams = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
    to_email: "someone@gmail.com",
  };

  // Show loading state
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  btnText.style.display = "none";
  btnLoading.style.display = "inline-block";
  submitBtn.disabled = true;

  // Send email using EmailJS
  emailjs
    .send(serviceID, templateID, templateParams, publicKey)
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
        showFormMessage("Sent successfully!", "success");
        document.getElementById("contactForm").reset();
      },
      function (error) {
        console.log("FAILED...", error);
        showFormMessage(
          "Sorry, there was an error sending your message. Please try again later.",
          "error"
        );
      }
    )
    .finally(function () {
      // Reset button state
      btnText.style.display = "inline-block";
      btnLoading.style.display = "none";
      submitBtn.disabled = false;
    });
});

// Function to show form messages
function showFormMessage(message, type) {
  const messageDiv = document.getElementById("form-message");
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = "block";

  // Scroll to message immediately and center it
  setTimeout(() => {
    messageDiv.scrollIntoView({ behavior: "auto", block: "center" });
  }, 100);

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);
  }
}
// Profile image change functionality
document.getElementById("profile-image").addEventListener("click", function () {
  const newImageUrl = prompt("Enter the URL of your profile image:");
  if (newImageUrl && newImageUrl.trim() !== "") {
    this.src = newImageUrl.trim();
    // You could also save this to localStorage for persistence
    localStorage.setItem("profileImage", newImageUrl.trim());
  }
});

// Load saved profile image on page load
window.addEventListener("load", function () {
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    document.getElementById("profile-image").src = savedImage;
  }

  // Animate stats counters
  animateCounters();
});

// Animate counters function
function animateCounters() {
  const counters = document.querySelectorAll(".stat h4");
  const speed = 200; // The lower the number, the faster the animation

  counters.forEach((counter) => {
    const target = parseInt(counter.innerText);
    let count = 0;
    const increment = target / speed;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.floor(count) + "+";
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + "+";
      }
    };

    // Start animation when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCount();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

// Animate progress bars
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill");

  progressBars.forEach((bar) => {
    const percentage = bar.getAttribute("data-percentage");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small delay for better visual effect
            setTimeout(() => {
              bar.style.width = percentage + "%";
            }, 300);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(bar);
  });
}

// Initialize all animations on page load
window.addEventListener("load", function () {
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    document.getElementById("profile-image").src = savedImage;
  }

  // Animate stats counters
  animateCounters();

  // Animate progress bars
  animateProgressBars();
});

// Active navigation underline functionality
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100; // Offset for header height
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// Update active navigation on scroll
window.addEventListener("scroll", updateActiveNavLink);

// Update active navigation on page load
window.addEventListener("load", () => {
  updateActiveNavLink();
  // Existing load event code...
  setTimeout(typeWriter, 1000);
});

// Blog filtering functionality
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const blogPosts = document.querySelectorAll(".blog-post");
  const loadMoreBtn = document.querySelector(".load-more-btn");

  // Initially show only first 3 posts
  let visiblePosts = 3;
  showPosts(visiblePosts);

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      blogPosts.forEach((post) => {
        if (
          filterValue === "all" ||
          post.getAttribute("data-category") === filterValue
        ) {
          post.style.display = "block";
          // Add fade-in animation
          setTimeout(() => {
            post.style.opacity = "1";
            post.style.transform = "translateY(0)";
          }, 100);
        } else {
          post.style.opacity = "0";
          post.style.transform = "translateY(20px)";
          setTimeout(() => {
            post.style.display = "none";
          }, 300);
        }
      });

      // Reset visible posts counter when filtering
      visiblePosts = 4;
      updateLoadMoreButton();
    });
  });

  // Load more functionality
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visiblePosts += 3;
      showPosts(visiblePosts);
      updateLoadMoreButton();
    });
  }

  function showPosts(count) {
    const allPosts = document.querySelectorAll(".blog-post");
    allPosts.forEach((post, index) => {
      if (index < count) {
        post.style.display = "block";
        setTimeout(() => {
          post.style.opacity = "1";
          post.style.transform = "translateY(0)";
        }, index * 100);
      }
    });
  }

  function updateLoadMoreButton() {
    const allPosts = document.querySelectorAll(".blog-post");
    const visiblePostsCount = document.querySelectorAll(
      '.blog-post[style*="display: block"]'
    ).length;

    if (visiblePostsCount >= allPosts.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
    }
  }

  // Initialize load more button state
  updateLoadMoreButton();
});
