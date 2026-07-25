// js/catalog.js - Simplified catalog logic with pagination only (Load More)

import { fetchBouquets } from './api.js';
import { renderBouquetsList } from './render.js';
import { initModalListeners } from './modal.js';

const state = {
  page: 1,
  limit: 4,
  total: 0,
  hasMore: true,
  isLoading: false,
};

const catalogListContainer = document.querySelector('#catalog-list');
const loadMoreBtn = document.querySelector('#catalog-button');
const statusMessageContainer = document.querySelector('#catalog-status-message');

function showStatusMessage(text, isError = false) {
  if (!statusMessageContainer) return;
  statusMessageContainer.style.display = 'block';
  statusMessageContainer.className = isError ? 'catalog-status-message error' : 'catalog-status-message info';
  statusMessageContainer.textContent = text;
}

function hideStatusMessage() {
  if (!statusMessageContainer) return;
  statusMessageContainer.style.display = 'none';
  statusMessageContainer.textContent = '';
}

function updateLoadMoreButton() {
  if (!loadMoreBtn) return;
  if (state.hasMore && !state.isLoading) {
    loadMoreBtn.style.display = 'inline-block';
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Show More';
  } else if (state.isLoading) {
    loadMoreBtn.style.display = 'inline-block';
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

async function loadBouquets({ append = false } = {}) {
  if (state.isLoading) return;
  state.isLoading = true;
  updateLoadMoreButton();
  hideStatusMessage();

  if (!append && catalogListContainer) {
    catalogListContainer.innerHTML = '';
  }

  try {
    const data = await fetchBouquets({
      page: state.page,
      limit: state.limit,
      category: 'all',
      search: '',
    });

    state.total = data.total;
    state.hasMore = data.hasMore;

    if (data.items.length === 0) {
      if (!append) {
        showStatusMessage('Нічого не знайдено.');
      } else {
        showStatusMessage('Ви переглянули всі доступні букети.');
      }
    } else {
      renderBouquetsList(catalogListContainer, data.items);
      if (!state.hasMore && state.page > 1) {
        showStatusMessage('Це всі доступні букети.');
      }
    }
  } catch (error) {
    console.error('Error loading catalog:', error);
    showStatusMessage('Помилка завантаження даних.', true);
    state.hasMore = false;
  } finally {
    state.isLoading = false;
    updateLoadMoreButton();
  }
}

export function initCatalog() {
  loadBouquets({ append: false });
  initModalListeners();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (state.hasMore && !state.isLoading) {
        state.page += 1;
        loadBouquets({ append: true });
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalog);
} else {
  initCatalog();
}
