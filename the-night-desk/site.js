(() => {
  'use strict';

  const cases = {
    carbon: {
      image: 'carbon-copy.png',
      alt: 'Investigators comparing paperwork at a street-side evidence table',
      caption: '01 / Compare the paperwork. Look for what repeats.',
    },
    bottom: {
      image: 'false-bottom.png',
      alt: 'Two investigators examining the lifted panel of a crate outside Canal Freight',
      caption: '02 / A closer look beneath the surface.',
    },
    seal: {
      image: 'borrowed-seal.png',
      alt: 'Investigators examining documents and a seal outside the records hall',
      caption: '03 / Follow the paper trail to the records hall.',
    },
  };

  const caseButtons = document.querySelectorAll('[data-case]');
  const caseImage = document.getElementById('case-image');
  const caseCaption = document.getElementById('case-caption');

  if (caseImage && caseCaption) {
    for (const button of caseButtons) {
      button.addEventListener('click', () => {
        const selected = cases[button.dataset.case];
        if (!selected) return;
        for (const other of caseButtons) {
          other.setAttribute('aria-pressed', String(other === button));
        }
        caseImage.src = `assets/${selected.image}`;
        caseImage.alt = selected.alt;
        caseCaption.textContent = selected.caption;
      });
    }
  }

  const openers = document.querySelectorAll('[data-gallery-open]');
  if (!openers.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'screenshot-dialog';
  dialog.setAttribute('aria-label', 'Game screenshot viewer');
  dialog.setAttribute('aria-describedby', 'screenshot-dialog-caption');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'screenshot-dialog__close';
  closeButton.textContent = 'Close ×';
  closeButton.setAttribute('aria-label', 'Close screenshot viewer');
  closeButton.autofocus = true;

  const image = document.createElement('img');
  image.className = 'screenshot-dialog__image';
  const caption = document.createElement('p');
  caption.id = 'screenshot-dialog-caption';
  caption.className = 'screenshot-dialog__caption';
  dialog.append(closeButton, image, caption);
  document.body.append(dialog);

  let opener;
  let previousOverflow;

  for (const button of openers) {
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => {
      const activeCase = button.dataset.galleryOpen === 'case';
      const sourceImage = activeCase ? caseImage : button.querySelector('img');
      const source = activeCase
        ? caseImage?.src
        : button.dataset.image || sourceImage?.src;
      if (!source) return;

      // On older browsers, the full-size image remains available directly.
      if (typeof dialog.showModal !== 'function') {
        window.location.assign(source);
        return;
      }
      image.src = source;
      image.alt = activeCase
        ? caseImage.alt
        : button.dataset.alt || sourceImage?.alt || 'The Night Desk development screenshot';
      caption.textContent = activeCase
        ? caseCaption?.textContent || ''
        : button.dataset.caption || image.alt;
      opener = button;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    });
  }

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  });
  // Native dialog handles Escape, focus containment, and background inertness.
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
})();
