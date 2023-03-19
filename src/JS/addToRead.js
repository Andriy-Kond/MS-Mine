import {
  firstDownloading,
  getFavoriteArr,
  addListenerOnGallery,
} from './addToFavorite';
// import { firstDownloadingRead, getReadArr } from './addToRead';

// * Зчитування масиву Read з localStorage
export function getReadArr() {
  const readStr = localStorage.getItem('read');
  const readArr = JSON.parse(readStr) || [];
  return readArr;
}
// */ Зчитування масиву Read з localStorage
const readArr = getReadArr(); // зчитуємо масив Read з localStorage

const uniqueDatesArr = getUniqueClickedDates(readArr); // отримую масив унікальних дат
const wrappersInRead = markupWrappersInRead(uniqueDatesArr); // розмітка врапперів з унікальними заголовками (датами)

markupOnReadPage(); // перевірка, що ми на сторінці Read і виклик розмітки

// Перевірка, що ми на сторінці read і подальша розмітка
export function markupOnReadPage() {
  if (!document.body.classList.contains('read')) {
    return;
  }
  const reviewedGallery = document.querySelector('.container--reviewed');
  // reviewedGallery.insertAdjacentHTML('afterbegin', wrappersInRead);
  reviewedGallery.innerHTML = wrappersInRead;

  // Вішаю слухача на кожен враппер і по кліку малюю розмітку по цьому врапперу
  reviewedGallery.addEventListener('click', unfoldCurrentWrapper); // розгортання обраного враппера
}

// Розмітка врапперів з унікальними заголовками (датами)
function markupWrappersInRead(uniqueDatesArr) {
  return uniqueDatesArr
    .map(date => {
      return `
      <div class="reviewed-wrapper">
        <div class="reviewed-container">
          <p class="reviewed__title">${date}</p>
          <svg class="reviewed__icon"></svg>
        </div>
      </div>
    `;
    })
    .join('');
}

// розгортання обраного враппера
function unfoldCurrentWrapper(e) {
  // console.log(e.target);

  if (!e.target.classList.contains('reviewed-wrapper')) {
    return;
  }

  const currentWrapper = e.target.querySelector('.reviewed__title');
  const wrapperDateID = currentWrapper.textContent;

  const currentParentEl = currentWrapper.closest('.reviewed-wrapper');
  currentParentEl.classList.toggle('unfolded');

  if (currentParentEl.classList.contains('unfolded')) {
    // перебирааю масив об'єктів read, шукаю в ньому дати, які збігаються з датою обраного враппера
    const listOfMarkupRead = markupRead(wrapperDateID); // повертає масив li в текстовому вигляді

    const ulGallery = document.createElement('ul'); //  додаю елемент ul
    ulGallery.classList.add('gallery', 'card', 'gallery--reviewed');

    ulGallery.innerHTML = listOfMarkupRead; // додаю картки li до ul
    currentParentEl.append(ulGallery); // додаю галерею ul до враппера

    const favoriteArr = getFavoriteArr();
    const readArr = getReadArr();
    firstDownloadingRead(readArr); // додаю іконки Already Read
    firstDownloading(favoriteArr); // додаю іконки favorite
    addListenerOnGallery();

    addListenerOnGalleryRead(); // Вішаю слухача на всю галерею щоби відслідковувати клік по посиланню Read More
  } else {
    const ulGallery = document.querySelector('.gallery--reviewed');
    ulGallery.remove();
  }
}

firstDownloadingRead(readArr); // при оновленні сторінки додаю іконки Already Read

// * Функція додає іконку до тих карток, що вже є у localStorage
// Її треба додати при кожному оновленні сторінки (після натискання на категорії чи запиту)
export function firstDownloadingRead(readArr) {
  const cards = document.querySelectorAll('.card__title');

  // якщо масив не пустий
  if (readArr.length) {
    // Встановлюю клас .is-active-read, якщо така картка є у localStorage
    for (let i = 0; i < readArr.length; i += 1) {
      for (let j = 0; j < cards.length; j += 1) {
        const accord = readArr[i].title.trim() === cards[j].textContent.trim();

        if (accord) {
          cards[j].closest('.card__item').classList.add('is-active-read');
        }
      }
    }
  }
}
// */ Функція додає іконку до тих карток, що вже є у localStorage

// Вішаю слухача на всю галерею щоби відслідковувати клік по посиланню Read More
export function addListenerOnGalleryRead() {
  const placeToRead = document.querySelector('.card');
  if (placeToRead) {
    placeToRead.addEventListener('click', setToRead);
  }
}

// Коли є клік по Read More
export function setToRead(e) {
  // Якщо клік не по Read More (посилання), то виходимо
  if (!e.target.classList.contains('card__read-more')) {
    return;
  }

  // Якщо ж клік по посиланню Read More, то виконуємо дії
  // Знаходжу поточну картку:
  const currentCardItem = e.target.closest('.card__item');
  currentCardItem.classList.add('is-active-read'); // показує іконку already read

  // Селектори для подальшого запису картки в масив
  // imageURL, category, title, description, pubDate, pubURL
  // ~imageURL
  const currentCardImg = currentCardItem.querySelector('.card__img');
  // отримую обчислений стиль background-image
  const currentCardImgStyles = window.getComputedStyle(currentCardImg);
  // видаляю непотрібні символи з url (одинарні та подвійні лапки)
  const currentCardImgUrl = currentCardImgStyles.backgroundImage
    .match(/\((.*?)\)/)[1]
    .replace(/('|")/g, '');
  // ~/ imageURL

  const currentCardCategory = currentCardItem.querySelector(
    '.plate__text--category-name'
  );
  const currentCardTitle = currentCardItem.querySelector('.card__title');
  const currentCardDescription =
    currentCardItem.querySelector('.card__description');
  const currentCardDate = currentCardItem.querySelector('.card__date');
  const currentCardUrl = currentCardItem.querySelector('.card__read-more');

  // шукаю по title:
  let indexEl = -1; // початкове значення - title не знайдений
  for (let i = 0; i < readArr.length; i += 1) {
    if (readArr[i].title === currentCardTitle.textContent.trim()) {
      indexEl = i;
      break;
    }
  }

  // Якщо такого title не існує в масиві read у Local Storage, то додаємо його туди:
  const dateNow = new Date();
  const dateNowFormatted = dateNow.toLocaleDateString('en-GB'); //09/03/2023
  if (indexEl === -1) {
    readArr.push({
      imgUrl: currentCardImgUrl,
      category: currentCardCategory.textContent.trim(),
      title: currentCardTitle.textContent.trim(),
      description: currentCardDescription.textContent.trim(),
      date: currentCardDate.textContent.trim(),
      newsUrl: currentCardUrl.href,
      visitedDate: dateNowFormatted,
    });
  }
  // інакше (якщо такий запис вже є) оновлюємо дату кліку:
  else {
    readArr[indexEl].visitedDate = dateNowFormatted;
  }

  // оновлюємо масив read у Local Storage
  localStorage.setItem('read', JSON.stringify(readArr));
}

// Спочатку розмітка div.reviewed-wrapper
// Збираю в окремий масив унікальні дати із visitedDate
function getUniqueClickedDates(readArr) {
  const datesArr = [];
  for (const item of readArr) {
    datesArr.push(item.visitedDate);
  }
  const uniqueDatesArr = datesArr.filter(
    (date, index) => datesArr.indexOf(date) === index
  );
  return uniqueDatesArr;
}

// * Розмітка галереї у кожному враппері
export function markupRead(wrapperDateIDTextContent) {
  return readArr
    .map(
      ({
        imgUrl: imageURL,
        category,
        title,
        description,
        date: pubDate,
        newsUrl: pubURL,
        visitedDate,
      }) => {
        // якщо дата в масиві не збігається з датою враппера, то нічого не робимо
        if (visitedDate !== wrapperDateIDTextContent) {
          return;
        }

        // Інакше повертаємо розмітку
        let newDescription = description || '';
        if (newDescription.length > 112) {
          newDescription = `${newDescription.slice(0, 112)}...`;
        }

        return `
      <li class="card__item">
        <!-- position: relative -->
        <div class="card__img-box">
          <div class="card__img" style="background-image: url('${imageURL}');"></div>

          <!-- position: absolute -->
          <div class="plate plate--category-name">
            <!-- textContent міняється у JS в залежності від категорії: -->
            <span class="plate__text--category-name">${category}</span>
          </div>

          <div class="plate plate--already-read">
            <span class="plate__text--already-read">Already read</span>
            <svg class="plate__icon--already-read">
              <use href="./images/icons.svg#already-read"></use>
            </svg>
          </div>

          <!-- Додавання до обраного: -->
          <button class="plate plate--add-to-favorite">
            <span class="plate--add-to-favorite-text">Add to favorite</span>
            <svg class="plate__icon--add-to-favorite">

            </svg>
          </button>
          <!--/ position: absolute -->
        </div>
        <!--/ position: relative -->

        <div class="card__info-box">
          <h2 class="card__title">${title}</h2>
          <p class="card__description">${newDescription}</p>
          <div class="card__info-box-wrapper">
            <p class="card__date">${pubDate}</p>

            <!-- посилання на новину: -->
            <a href="${pubURL}" class="card__read-more" target="_blank">Read more</a>
          </div>
        </div>
      </li>`;
      }
    )
    .join('');
}
