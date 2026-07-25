// js/catalog.js - Single application state, pagination (Load More), filtering, search, and loading/error states

import { fetchBouquets } from './api.js';
import { renderBouquetsList } from './render.js';
import { initModalListeners } from './modal.js';

// Single source of truth application state
const state = {
  page: 1,
  limit: 4,
  category: 'all',
  search: '',
  total: 0,
  hasMore: true,
  isLoading: false,
};

// DOM elements
const catalogListContainer = document.querySelector('#catalog-list');
const loadMoreBtn = document.querySelector('#catalog-button');
const categoryFilterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.querySelector('#catalog-search-input');
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

  if (!append) {
    if (catalogListContainer) catalogListContainer.innerHTML = '';
  }

  try {
    const data = await fetchBouquets({
      page: state.page,
      limit: state.limit,
      category: state.category,
      search: state.search,
    });

    state.total = data.total;
    state.hasMore = data.hasMore;

    if (data.items.length === 0) {
      if (!append) {
        showStatusMessage('Нічого не знайдено за вашим запитом. Спробуйте обрати іншу категорію.');
      } else {
        showStatusMessage('Ви переглянули всі доступні букети.');
      }
    } else {
      renderBouquetsList(catalogListContainer, data.items);
      if (!state.hasMore && state.page > 1) {
        showStatusMessage('Це всі букети в цій колекції.');
      }
    }
  } catch (error) {
    console.error('Error loading catalog:', error);
    showStatusMessage('Помилка завантаження даних. Перевірте підключення до мережі або локального сервера.', true);
    state.hasMore = false;
  } finally {
    state.isLoading = false;
    updateLoadMoreButton();
  }
}

export function initCatalog() {
  // Load initial page
  loadBouquets({ append: false });

  // Init Modal listeners
  initModalListeners();

  // Load More button click
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (state.hasMore && !state.isLoading) {
        state.page += 1;
        loadBouquets({ append: true });
      }
    });
  }

  // Category filter buttons
  if (categoryFilterBtns.length > 0) {
    categoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoryFilterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        state.category = e.currentTarget.dataset.category || 'all';
        state.page = 1; // reset page on filter change
        loadBouquets({ append: false });
      });
    });
  }

  // Search input with debounce
  if (searchInput) {
    let timeoutId;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        state.search = e.target.value;
        state.page = 1; // reset page on search change
        loadBouquets({ append: false });
      }, 300);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalog);
} else {
  initCatalog();
}
