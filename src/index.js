import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { queryFetch, createMarkup } from './helpers';

let inputValue = '';
let simpleLightBox;
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
// const loadBtn = document.querySelector('.load-more');

const guard = document.querySelector('.js-guard');
const options = {
  root: null,
  rootMargin: '900px',
  threshold: 0,
};
const observer = new IntersectionObserver(onPagination, options);

formRef.addEventListener('submit', onSubmit);
// loadBtn.addEventListener('click', onNewImages);

async function onSubmit(e) {
  e.preventDefault();
  // loadBtn.style.display = 'none';
  galleryRef.innerHTML = '';
  inputValue = e.target.elements.searchQuery.value.trim();

  if (!inputValue) {
    Notiflix.Notify.failure('Please, fill the input!');
    return;
  }

  const result = await queryFetch(inputValue);

  if (result.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
    // Не рендерит если меншь 40 в общем
    // Не рендерит если 40+, но меньше 80
    if (result.hits.length < 40) {
      // Notiflix.Notify.info(
      //   "We're sorry, but you've reached the end of search results."
      // );
      // loadBtn.style.display = 'none';
    } else {
      observer.observe(guard);
      // loadBtn.style.display = 'block';
    }

    galleryRef.insertAdjacentHTML('beforeend', createMarkup(result));
    let simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    e.target.reset();
  }
}

// async function onNewImages() {
//   // inputValue = formRef.elements.searchQuery.value.trim();
//   const result = await queryFetch(inputValue);

//   if (result.hits.length < 40) {
//     loadBtn.style.display = 'none';
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }

//   galleryRef.insertAdjacentHTML('beforeend', createMarkup(result));
//   simpleLightBox = new SimpleLightbox('.gallery a').refresh();
// }

function onPagination(entries, observer) {
  console.log(entries);
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      const result = await queryFetch(inputValue);

      if (result.hits.length < 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      galleryRef.insertAdjacentHTML('beforeend', createMarkup(result));
      let simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    }
  });
}
