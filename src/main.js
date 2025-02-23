import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.createElement('button');
loadMoreBtn.id = 'load-more';
loadMoreBtn.textContent = 'Load more';
loadMoreBtn.style.display = 'none';
document.body.appendChild(loadMoreBtn);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let searchQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;

  if (!searchQuery) {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  gallery.innerHTML = '';
  loader.classList.add('show');
  loadMoreBtn.style.display = 'none';

  try {
    const { hits, totalHits: total } = await fetchImages(
      searchQuery,
      currentPage
    );
    totalHits = total;

    if (hits.length === 0) {
      iziToast.error({
        message: 'No images found. Try a different search query!',
        position: 'topRight',
      });
      return;
    }

    gallery.innerHTML = renderGallery(hits);
    lightbox.refresh();

    if (totalHits > 40) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    loader.classList.remove('show');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  loader.classList.add('show');

  try {
    const { hits } = await fetchImages(searchQuery, currentPage);

    gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
    lightbox.refresh();
    smoothScroll();

    const totalPages = Math.ceil(totalHits / 40);
    if (currentPage >= totalPages) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    loader.classList.remove('show');
  }
});

function smoothScroll() {
  const cardHeight = document
    .querySelector('.gallery-item')
    .getBoundingClientRect().height;
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
