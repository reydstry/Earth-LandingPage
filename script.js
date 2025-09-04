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
    track.scrollTo({ left: activeIndex() * vw() });
    updateDots();
  });

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
    document.body.style.overflow = 'hidden'; 
  }
  function close(){
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function show(delta){
    idx = (idx + delta + items.length) % items.length;
    open(idx);
  }

  items.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
    img.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ open(i); }});
    img.tabIndex = 0;
  });

  btnPrev.addEventListener('click', () => show(-1));
  btnNext.addEventListener('click', () => show(1));
  btnClose.addEventListener('click', close);

  lb.addEventListener('click', (e) => {
    if(e.target === lb) close();
  });

  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('active')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') show(-1);
    if(e.key === 'ArrowRight') show(1);
  });

  const handleDotClick = (index) => {
    const slides = document.querySelectorAll('.fact-slide');
    if (slides[index]) {
      slides[index].scrollIntoView({ behavior: 'smooth' });
      updateActiveDot(index);
    }
  };
});