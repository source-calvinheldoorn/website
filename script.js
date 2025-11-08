// Simple gallery + lightbox with metadata display
(function(){
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDetails = document.getElementById('lightboxDetails');
  const downloadBtn = document.getElementById('downloadBtn');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const items = Array.from(gallery.querySelectorAll('.photo'));
  let currentIndex = -1;

  function formatDetails(detailsObj){
    // Build small labels for date, location, camera if present
    const parts = [];
    if(detailsObj.date) parts.push(detailsObj.date);
    if(detailsObj.location) parts.push(detailsObj.location);
    if(detailsObj.camera) parts.push(detailsObj.camera);
    return parts;
  }

  function openAt(index){
    const item = items[index];
    if(!item) return;
    const img = item.querySelector('img');
    const full = img.dataset.full || img.src;
    lightboxImg.src = full;
    lightboxImg.alt = img.alt || item.dataset.title || '';
    // metadata: prefer data-* on figure; fallback to figcaption / alt
    const meta = {
      title: item.dataset.title || img.alt || '',
      subtitle: item.dataset.subtitle || '',
      date: item.dataset.date || '',
      location: item.dataset.location || '',
      camera: item.dataset.camera || ''
    };

    lightboxTitle.textContent = meta.title || meta.subtitle || '';
    // details: show date | location | camera
    const detailParts = formatDetails(meta);
    // clear old
    lightboxDetails.innerHTML = '';
    detailParts.forEach((p, i) => {
      const span = document.createElement('span');
      span.className = 'meta-item';
      span.textContent = p;
      lightboxDetails.appendChild(span);
      if(i < detailParts.length - 1){
        const sep = document.createElement('span');
        sep.className = 'meta-sep';
        sep.textContent = '·';
        sep.setAttribute('aria-hidden', 'true');
        lightboxDetails.appendChild(sep);
      }
    });

    downloadBtn.href = full;
    lightbox.setAttribute('aria-hidden','false');
    currentIndex = index;
    // focus the close button for keyboard nav convenience
    closeBtn.focus();
  }

  function close(){
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
    lightboxTitle.textContent = '';
    lightboxDetails.innerHTML = '';
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

  // Optional: simple swipe support for touch devices (basic)
  let touchStartX = null;
  lightbox.addEventListener('touchstart', (e) => {
    if(e.touches && e.touches.length === 1) touchStartX = e.touches[0].clientX;
  }, {passive:true});
  lightbox.addEventListener('touchend', (e) => {
    if(touchStartX === null) return;
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
    if(endX !== null){
      const diff = endX - touchStartX;
      if(Math.abs(diff) > 40){
        if(diff < 0) showNext();
        else showPrev();
      }
    }
    touchStartX = null;
  }, {passive:true});

})();