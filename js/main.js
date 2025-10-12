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
  const duration = 600; // durasi animasi (ms)

  // Hitung target ID kiri/kanan
  if (targetId === 'left') {
    targetId = 'review' + ((currentReview - 2 + totalReviews) % totalReviews + 1);
  } else if (targetId === 'right') {
    targetId = 'review' + ((currentReview % totalReviews) + 1);
  }

  const current = document.getElementById(`review${currentReview}`);
  const target = document.getElementById(targetId);
  if (!current || !target || current === target) return;

  // Fade out elemen aktif
  current.style.transition = 'opacity 0.6s ease';
  current.style.opacity = 0;

  // Setelah fade-out selesai
  setTimeout(() => {
    // Sembunyikan elemen lama
    current.classList.add('d-none');
    current.classList.remove('d-flex');
    current.style.transition = 'none';
    current.style.opacity = 1; // reset agar bisa dipakai lagi nanti

    // Siapkan elemen target
    target.style.transition = 'none';
    target.style.opacity = 0;
    target.classList.remove('d-none');
    target.classList.add('d-flex');

    // Reflow agar browser tahu opacity awal 0
    void target.offsetWidth;

    // Jalankan fade-in
    target.style.transition = 'opacity 0.6s ease';
    target.style.opacity = 1;

    // Hapus transition setelah selesai agar animasi konsisten di swipe berikutnya
    setTimeout(() => {
      target.style.transition = 'none';
    }, duration);

    // Update indeks review aktif
    currentReview = parseInt(targetId.replace('review', ''));
  }, duration);
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