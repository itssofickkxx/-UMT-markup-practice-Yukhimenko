// js/modal.js - Modal window control (backdrop, ESC close, scroll lock, dynamic modal data, form submit)

const modalBackdrop = document.querySelector('#detail-modal');
const closeModalBtn = document.querySelector('#close-modal-button');
const modalTitle = document.querySelector('#modal-title');
const modalPrice = document.querySelector('#modal-price');
const modalDesc = document.querySelector('#modal-desc');
const modalImg = document.querySelector('#modal-img');
const orderForm = document.querySelector('.modal-order-form');

export function openModal(data = {}) {
  if (!modalBackdrop) return;

  if (modalTitle && data.title) modalTitle.textContent = data.title;
  if (modalPrice && data.price) modalPrice.textContent = `$${data.price}`;
  if (modalDesc && data.description) modalDesc.textContent = data.description;
  if (modalImg && data.image) {
    modalImg.src = data.image;
    if (data.image2x) {
      modalImg.srcset = `${data.image} 1x, ${data.image2x} 2x`;
    }
    modalImg.alt = data.title || 'Bouquet';
  }

  modalBackdrop.classList.add('is-open');
  document.body.classList.add('modal-open');
  window.addEventListener('keydown', handleKeyDown);
}

export function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  window.removeEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

export function initModalListeners() {
  if (!modalBackdrop) return;

  // Backdrop click close
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  // Close button click close
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Delegate clicks on catalogue & order buttons to open modal
  document.addEventListener('click', (event) => {
    const orderBtn = event.target.closest('.order-bouquet-btn, .menu-action-button, .hero-button, .order-button');
    if (orderBtn) {
      const card = orderBtn.closest('.bouquet-card');
      if (card) {
        openModal({
          title: card.dataset.title,
          price: card.dataset.price,
          description: card.dataset.desc,
          image: card.dataset.img,
          image2x: card.dataset.img2x
        });
      } else {
        openModal({
          title: 'Custom Order',
          price: '55',
          description: 'Our floral artists will handcraft a personalized bouquet according to your preferences.',
          image: './image/wonderful-flowers@1x.jpg',
          image2x: './image/wonderful-flowers@2x.jpg'
        });
      }
    }
  });

  // Order form submit handling
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(orderForm);
      const name = formData.get('user-name');
      alert(`Thank you, ${name || 'customer'}! Your order has been placed successfully.`);
      orderForm.reset();
      closeModal();
    });
  }

  // Footer subscription form handling
  const subscribeForm = document.querySelector('.footer-subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = subscribeForm.querySelector('input[type="email"]');
      alert(`Thank you for subscribing! Confirmation sent to ${emailInput.value}.`);
      subscribeForm.reset();
    });
  }
}
