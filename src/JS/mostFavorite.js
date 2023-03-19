import NewsApi from './newsAPI';
import getWeather from './weatherAPI';
import { favoriteResponseMarkup } from './markup';
import { firstDownloading, getFavoriteArr } from './addToFavorite';
import { firstDownloadingRead, getReadArr } from './addToRead';

const cardList = document.querySelector('.card');
const newsRequest = new NewsApi();

newsRequest
  .getMostViewedArticles()
  .then(response => {
    cardList.innerHTML = favoriteResponseMarkup(response);
    getWeather();
    // додаю іконки сердець до необхідних карток
    const favoriteArr = getFavoriteArr();
    const readArr = getReadArr();
    firstDownloading(favoriteArr);
    firstDownloadingRead(readArr);
  })
  .catch(error => console.log(error.message));
