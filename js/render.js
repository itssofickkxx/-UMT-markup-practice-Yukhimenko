// js/render.js - Bouquet card template without extra button under each card

export function createBouquetCardMarkup(bouquet) {
  const { id, title, price, description, image, image2x } = bouquet;

  const img1x = image || './image/side-view-rose@1x.jpg';
  const img2x = image2x || image || './image/side-view-rose@2x.jpg';

  return `
    <li class="catalog-item bouquet-card" data-id="${id}" data-title="${title}" data-price="${price}" data-desc="${description}" data-img="${img1x}" data-img2x="${img2x}">
      <div class="catalog-thumb">
        <img class="catalog-image" 
             src="${img1x}" 
             srcset="${img1x} 1x, ${img2x} 2x" 
             alt="${title}"
             loading="lazy" />
      </div>
      <h3 class="catalog-name">${title}</h3>
      <p class="catalog-price">$${price}</p>
    </li>
  `;
}

export function renderBouquetsList(containerElement, bouquetsArray) {
  if (!containerElement) return;
  const markup = bouquetsArray.map(createBouquetCardMarkup).join('');
  containerElement.insertAdjacentHTML('beforeend', markup);
}
