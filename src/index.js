import themeSwitcher from './JS/switcherTheme.js';

import { Pagination } from 'tui-pagination';

// * Імпорт бібліотеки повідомлень:
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  position: 'right-top',
  opacity: 0.8,
  timeout: 3000,
  clickToClose: true,
  fontSize: '16px',
});

// * Імпорт бібліотеки axios
import axios from 'axios';

// * імпорт усього вмісту файлів:
import './JS/header';
import './JS/switcherTheme';
import './JS/mobileMenu';
import './JS/addToFavorite';
import './JS/addToRead';
import './JS/pagination';
import './JS/dots';
import './JS/scrollToUp';
import './JS/modalTeam';
import './JS/calendar';
// import './JS/weatherAPI'; // видає помилку
import './JS/newsFilters';
import './JS/searchNews';
// import './JS/readDate';
// import './JS/saveToRead';
import './JS/loading';
