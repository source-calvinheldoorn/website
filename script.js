// Simple gallery + lightbox
(function(){
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const downloadBtn = document.getElementById('downloadBtn');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const items = Array.from(gallery.querySelectorAll('.photo'));
  let currentIndex = -1;

  function openAt(index){
    const item = items[index];
    if(!item) return;
    const img = item.querySelector('img');
    const full = img.dataset.full || img.src;
    lightboxImg.src = full;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = item.querySelector('figcaption')?.textContent || '';
    downloadBtn.href = full;
    lightbox.setAttribute('aria-hidden','false');
    currentIndex = index;
    // focus for keyboard nav
    closeBtn.focus();
  }

  function close(){
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
    currentIndex = -1;
  }

  function showNext(){
    if(currentIndex < 0) return;
    openAt((currentIndex + 1) % items.length);
  }

  function showPrev(){
    if(currentIndex < 0) return;
    openAt((currentIndex - 1 + items.length) % items.length);
  }

  // click / keyboard to open
  items.forEach((el, idx) => {
    el.addEventListener('click', ()=> openAt(idx));
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAt(idx);
      }
    });
  });

  // controls
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // global key handlers
  document.addEventListener('keydown', (e)=>{
    if(lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowRight') showNext();
      if(e.key === 'ArrowLeft') showPrev();
    }
  });

  // click outside image closes
  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox) close();
  });

  // improve image loading on open (preload)
  gallery.querySelectorAll('img').forEach(img=>{
    const full = img.dataset.full;
    if(full){
      const pre = new Image();
      pre.src = full;
    }
  });
})();