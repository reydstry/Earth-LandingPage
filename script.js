document.addEventListener('DOMContentLoaded', function(){
  const track = document.getElementById('factsTrack');
  const prev  = document.querySelector('.facts-arrow.prev');
  const next  = document.querySelector('.facts-arrow.next');
  const dotsWrap = document.getElementById('factsDots');
  const slides = Array.from(track.querySelectorAll('.fact-slide'));
  const grid = document.querySelector('.gallery-grid');
  const lb   = document.getElementById('lightbox');
  const lbImg= lb.querySelector('.lb-img');
  const lbCap= document.getElementById('lbCaption');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');
  const btnClose= lb.querySelector('.lb-close');

  function vw(){ return track.clientWidth; }

  // Dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Ke slide ' + (i+1));
    b.addEventListener('click', () => {
      track.scrollTo({ left: i * vw(), behavior: 'smooth' });
    });
    dotsWrap.appendChild(b);
  });

  function activeIndex(){
    return Math.round(track.scrollLeft / vw());
  }
  function updateDots(){
    const idx = activeIndex();
    dotsWrap.querySelectorAll('button').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  track.addEventListener('scroll', updateDots);
  window.addEventListener('resize', () => {
    // jaga posisi saat resize
    track.scrollTo({ left: activeIndex() * vw() });
    updateDots();
  });

  // Akses keyboard
  track.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft'){ e.preventDefault(); prev.click(); }
    if(e.key === 'ArrowRight'){ e.preventDefault(); next.click(); }
  });

  // Init
  updateDots();

  const items = Array.from(grid.querySelectorAll('.gallery-item img'));
  let idx = 0;

  function open(i){
    idx = i;
    const img = items[idx];
    lbImg.src = img.getAttribute('data-full') || img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.closest('figure').querySelector('figcaption')?.textContent || '';
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // kunci scroll belakang
  }
  function close(){
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // kosongkan src untuk hemat memori (opsional)
    // lbImg.src = '';
  }
  function show(delta){
    idx = (idx + delta + items.length) % items.length;
    open(idx);
  }

  // Buka dari grid
  items.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
    img.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ open(i); }});
    img.tabIndex = 0; // akses keyboard
  });

  // Kontrol lightbox
  btnPrev.addEventListener('click', () => show(-1));
  btnNext.addEventListener('click', () => show(1));
  btnClose.addEventListener('click', close);

  // Tutup jika klik area gelap (bukan gambar/btn)
  lb.addEventListener('click', (e) => {
    if(e.target === lb) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('active')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') show(-1);
    if(e.key === 'ArrowRight') show(1);
  });

  // Remove any arrow button event listeners and keep only the dots navigation logic
  const handleDotClick = (index) => {
    const slides = document.querySelectorAll('.fact-slide');
    if (slides[index]) {
      slides[index].scrollIntoView({ behavior: 'smooth' });
      updateActiveDot(index);
    }
  };
});