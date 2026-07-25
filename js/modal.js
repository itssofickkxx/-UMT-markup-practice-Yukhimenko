// js/modal.js - Dual modal management: Order Modal (Header) and Product Details Modal

const orderModal = document.querySelector('#header-order-modal');
const detailsModal = document.querySelector('#detail-modal');

export function closeAllModals() {
  const activeModals = document.querySelectorAll('.modal-background.is-open');
  activeModals.forEach(m => m.classList.remove('is-open'));
  document.body.classList.remove('modal-open');
  window.removeEventListener('keydown', handleKeyDown);
}

export function openModalElement(modalEl) {
  if (!modalEl) return;
  closeAllModals();
  modalEl.classList.add('is-open');
  document.body.classList.add('modal-open');
  window.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    closeAllModals();
  }
}

export function openProductDetails(data = {}) {
  if (!detailsModal) return;

  const titleEl = detailsModal.querySelector('#modal-title');
  const priceEl = detailsModal.querySelector('#modal-price');
  const descEl = detailsModal.querySelector('#modal-desc');
  const imgEl = detailsModal.querySelector('#modal-img');

  if (titleEl && data.title) titleEl.textContent = data.title;
  if (priceEl && data.price) priceEl.textContent = `$${data.price}`;
  if (descEl && data.description) descEl.textContent = data.description;
  if (imgEl && data.image) {
    imgEl.src = data.image;
    if (data.image2x) {
      imgEl.srcset = `${data.image} 1x, ${data.image2x} 2x`;
    }
    imgEl.alt = data.title || 'Bouquet';
  }

  openModalElement(detailsModal);
}

export function openOrderModal() {
  if (!orderModal) return;
  openModalElement(orderModal);
}

export function initModalListeners() {
  // Backdrop and Close button click for all modals
  document.querySelectorAll('.modal-background').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-modal-close], .close-modal-button')) {
        closeAllModals();
      }
    });
  });

  // Global click delegator
  document.addEventListener('click', (e) => {
    // Header / Hero / Mobile menu order button -> Open Order Modal
    const orderBtn = e.target.closest('.order-button, .hero-button, .menu-action-button');
    if (orderBtn) {
      e.preventDefault();
      openOrderModal();
      return;
    }

    // "Buy now" inside Product Details modal -> Open Order Modal
    const buyNowInModal = e.target.closest('#modal-buy-now-btn');
    if (buyNowInModal) {
      e.preventDefault();
      openOrderModal();
      return;
    }

    // Bouquet item click (in Bestsellers or Catalog) -> Open Product Details Modal
    const bouquetCard = e.target.closest('.bouquet-card, .products-item');
    if (bouquetCard && !e.target.closest('button')) {
      const title = bouquetCard.dataset.title || bouquetCard.querySelector('.products-description, .catalog-name')?.textContent?.trim();
      const priceRaw = bouquetCard.dataset.price || bouquetCard.querySelector('.products-text, .catalog-price')?.textContent?.trim();
      const price = priceRaw ? priceRaw.replace('$', '') : '35';
      const description = bouquetCard.dataset.desc || 'Each stem is carefully selected to create a bouquet that radiates freshness, elegance, and the gentle charm of spring. Whether you’re celebrating a birthday, sending love, or simply brightening someone’s day, this arrangement is sure to bring warm smiles and lasting impressions.';
      const img = bouquetCard.dataset.img || bouquetCard.querySelector('img')?.src;
      const img2x = bouquetCard.dataset.img2x || img;

      openProductDetails({ title, price, description, image: img, image2x: img2x });
    }
  });

  // Form submission inside Order Modal
  if (orderModal) {
    const form = orderModal.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('user-name') || 'Customer';
        alert(`Thank you, ${name}! Your order has been placed successfully.`);
        form.reset();
        closeAllModals();
      });
    }
  }
}
