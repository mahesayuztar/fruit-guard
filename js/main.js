window.addEventListener("scroll", function() {
  const navbar = document.getElementById("mainNavbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

let currentIndex = 0;
let isAnimating = false;

function nextImage(cont) {
  if (isAnimating) return; // cegah klik beruntun
  isAnimating = true;

  const container = document.getElementById(cont);
  const images = container.querySelectorAll('img');
  const total = images.length;
  const start = container.scrollLeft;
  const width = container.clientWidth;
  const end = width * ((currentIndex + 1) % total);
  const duration = 600; // ms
  const startTime = performance.now();

  function animateScroll(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // easing halus

    container.scrollLeft = start + (end - start) * ease;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      currentIndex = (currentIndex + 1) % total;

      // reset agar loop mulus tanpa patah
      if (currentIndex === 0) container.scrollLeft = 0;

      isAnimating = false;
    }
  }

  requestAnimationFrame(animateScroll);
}

let currentReview = 1; // review yang tampil pertama
const totalReviews = 3; // jumlah total review

function swipeReview(targetId) {
  if(targetId=='left') {
    targetId = 'review'+((currentReview-1)%totalReviews || totalReviews);
  }
  else if(targetId=='right'){
    targetId = 'review'+((currentReview+1)%totalReviews || totalReviews);
  }
  const current = document.getElementById(`review${currentReview}`);
  const target = document.getElementById(targetId);
  if (!current || !target || current === target) return;

  // Fade out yang sekarang
  current.classList.add('fading-out');
  current.classList.remove('active');

  // Setelah fade out selesai (0.6s), baru ganti elemen
  setTimeout(() => {
    current.classList.add('d-none');
    current.classList.remove('d-flex', 'fading-out');

    // Tampilkan elemen target
    target.classList.remove('d-none');
    target.classList.add('d-flex');
    
    // Reflow supaya browser tangkap transisi baru
    void target.offsetWidth;

    // Fade in elemen baru
    target.classList.add('active');

    // Update current
    currentReview = parseInt(targetId.replace('review', ''));
  }, 600); // waktu disamakan dengan transition: 0.6s
}

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('.fade-in-element');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // stop observasi supaya animasi 1x aja
      }
    });
  }, { threshold: 0.25 }); // elemen dianggap “terlihat” ketika 20% masuk viewport

  elements.forEach(el => observer.observe(el));
});

const track = document.querySelector('.carousel-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let index = 0;

nextBtn.addEventListener('click', () => {
  const items = document.querySelectorAll('.product-item');
  if (index < items.length - 3) index++;
  track.style.transform = `translateX(-${index * (100/3)}%)`;
});

prevBtn.addEventListener('click', () => {
  if (index > 0) index--;
  track.style.transform = `translateX(-${index * (100/3)}%)`;
});