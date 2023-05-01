import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '35889291-72d22f1b5530e86f5c1dc0b10';

export async function queryFetch(name, page) {
  try {
    const query = `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    const response = await axios.get(query);
    const filteredResponse = response.data;
    return filteredResponse;
  } catch (error) {
    console.log(error.message);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

export function createMarkup(arr) {
  return arr.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a href="${largeImageURL}"><div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
    <p class="info-item">
      <b>Likes</b>: ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>: ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>: ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>: ${downloads}
    </p>
     </div>
    </div>
    </a>`
    )
    .join('');
}
