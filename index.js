import { shuffle } from "./modules/shuffle.js";
import { classicSongs } from "./modules/song/classic-songs.js";
import { nuSongs } from "./modules/song/nu-songs.js";
import { punkSongs } from "./modules/song/punk-songs.js";
import { indastrialSongs } from "./modules/song/indastrial-songs.js";
import { melodicSongs } from "./modules/song/melodic-songs.js";
import { thrashSongs } from "./modules/song/thrashSongs.js";
import { additional } from "./modules/song/additional.js";
import additionalNoise from "./modules/additionalNoise.js";
import { translations } from "./modules/language/language.js";
import appendLi from "./modules/appendLi.js";
import winSong from "./modules/winSong.js";
import Player from "./modules/classPlayer.js";

const welcome = document.querySelector('.welcome');
const aboutBtn = document.querySelector('.about-btn');
const musicBtn = document.querySelector('.music-btn');
const acceptBtn = document.querySelector('.accept-btn');
const cancel = document.querySelector('.cancel');

const startBtn = document.querySelector('.start-btn');
const startArrow = document.querySelector('.start-arrow');
const musicArrow = document.querySelector('.music-arrow');

const gameContainer = document.querySelector('.start-page');
const musicPage = document.querySelector('.music');
const winWrapper = document.querySelector('.win-wrapper');
const gameListWrapper = document.querySelector('.table-list');


const songCounter = document.querySelector('.score-counter');
const songLogo = document.querySelector('.song-logo');
const songName = document.querySelector('.song');
const nextBtn = document.querySelector('.next-btn');

const commonLogo = document.querySelector('.common-logo');
const commonSongName = document.querySelector('.common-song');

const restartBtn = document.querySelector('.restart-btn');

const resultBtn = document.querySelector('.result-btn');


aboutBtn.addEventListener('click', () => {
    welcome.classList.remove('hide');
    additionalNoise(additional[0].swap);
})
acceptBtn.addEventListener('click', () => {
    welcome.classList.add('hide');
    additionalNoise(additional[0].swap);

})
musicBtn.addEventListener('click', () => {
    musicPage.classList.add('show');
    additionalNoise(additional[0].swap);
})
cancel.addEventListener('click', () => {
    if (window.confirm('Do you really want to leave?')) {
        window.close();
    }
})
winWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancel')) {
        gameContainer.classList.remove('show');
        winWrapper.classList.add('hide');
        additionalNoise(additional[0].swap);

    }
})

let language = 'en';
const languageBtn = document.querySelector('.language-btn');

const switchLang = () => {
    if (language === 'en') {
        language = 'ru';
    } else {
        language = 'en';
    }
    localStorage.setItem('language', language);
    changeLanguage(language);
}

window.addEventListener('load', () => {
    if (localStorage.getItem('result')) {
        lastResult = localStorage.getItem('result');
        scoreText.textContent = translations[language].scoreFirst + lastResult + translations[language].scoreLast;
    }
    if (localStorage.getItem('language')) {
        language = localStorage.getItem('language');
    }
    changeLanguage(language);
})
languageBtn.addEventListener('click', switchLang)

const player = new Player();
const playerDom = player.createPlayer(1, 30);
mainPlayer.appendChild(playerDom)

const secondPlayer = new Player();
const playerDomCommon = secondPlayer.createPlayer(2);
commonPlayer.appendChild(playerDomCommon);

const musicPlayer = new Player();
const musicPlayerDom = musicPlayer.createPlayer(3);
music.appendChild(musicPlayerDom)

const description = document.createElement('div');
description.classList.add('description');
document.querySelectorAll('.table-list')[document.querySelectorAll('.table-list').length - 1].appendChild(description)

const queue = [classicSongs, punkSongs, indastrialSongs, nuSongs, thrashSongs, melodicSongs];
let librarySongs = [];
queue.forEach(item => {
    librarySongs = librarySongs.concat(item);
})
const musicList = document.querySelector('.music-list');
appendLi(librarySongs, musicList)

function refresh() {
    while (gameListWrapper.firstChild) {
        gameListWrapper.removeChild(gameListWrapper.firstChild);
    }
    songName.classList.remove('win');
    songCounter.textContent = 0;
    index = 0;
    count = 5;
    shuffleSongs = shuffle(queue[index]);
    winner = winSong(shuffleSongs);
    appendLi(shuffleSongs, gameListWrapper);
    player.audioPath = shuffleSongs[winner[1]].src;
    // console.log('winner', winner)
    nextBtn.disabled = true;
    nextBtn.textContent = translations[language].nextBtn;
    startLvls.forEach(item => item.classList.remove('active'));
    startLvls[0].classList.add('active');
    gameContainer.classList.add('show');
    additionalNoise(additional[0].swap);
}
function resetLogoAndText() {
    songLogo.src = './assets/icons/question-mark.svg';
    commonLogo.src = './assets/icons/question-mark.svg';
    songName.textContent = '******';
    commonSongName.textContent = '******';
    description.textContent = '';
    currentDescription = '';
    secondPlayer.audioPath = '';
}
let shuffleSongs, winner, count;
const startLvls = document.querySelectorAll('.start-lvl');

startBtn.addEventListener('click', () => {
    musicPlayer.isPlay();
    refresh();
    resetLogoAndText();
})
musicArrow.addEventListener('click', () => {
    additionalNoise(additional[0].swap);
    musicPage.classList.remove('show');
})

startArrow.addEventListener('click', () => {
    additionalNoise(additional[0].swap);
    gameContainer.classList.remove('show');
    player.isPlay();
    if (secondPlayer.audioPath) {
        secondPlayer.isPlay()
    }
    setTimeout(() => {
        while (gameListWrapper.firstChild) {
            gameListWrapper.removeChild(gameListWrapper.firstChild);
        }
        startBtn.disabled = false;
    }, 1000);
    startBtn.disabled = true;
})

let index = 0;
let currentDescription;
gameListWrapper.addEventListener('click', (event) => {
    if (!songName.classList.contains('win')) {
        if (event.target.classList.contains('list-item') && +event.target.getAttribute('data-song') == winner[1]) {
            player.isPlay();
            additionalNoise(additional[0].win);
            event.target.classList.remove('default');
            event.target.classList.add('right');
            songName.textContent = shuffleSongs[winner[1]].title;
            songName.textContent = winner[0];
            songLogo.src = shuffleSongs[winner[1]].logo;
            console.log(shuffleSongs[winner[1]].logo, songLogo.src)
            songName.classList.add('win');
            console.log('score', count)
            songCounter.textContent = Number(songCounter.textContent) + Number(count);
            index += 1;
            if (index != queue.length) {
                nextBtn.disabled = false;
            }
            win();
        } else if (event.target.classList.contains('list-item') && !event.target.classList.contains('error')) {
            additionalNoise(additional[0].fail);
            event.target.classList.remove('default');
            event.target.classList.add('error');
            count -= 1;
        }
    }
    if (event.target.getAttribute('data-song')) {
        currentDescription = event.target.getAttribute('data-song')
        commonLogo.src = shuffleSongs[currentDescription].logo;
        description.textContent = shuffleSongs[currentDescription].story[language];
        commonSongName.textContent = shuffleSongs[currentDescription].title;
        secondPlayer.audioPath = shuffleSongs[currentDescription].src;
        play2.classList.remove('pause');
    }
})

nextBtn.addEventListener('click', () => {
    if (index != queue.length) {
        const startLVL = document.querySelectorAll('.start-lvl');
        startLVL[index - 1].classList.remove('active');
        startLVL[index].classList.add('active');
        count = 5;
        resetLogoAndText()
        songName.classList.remove('win');
        player.isPlay();
        if (secondPlayer.audioPath) {
            secondPlayer.isPlay();
            secondPlayer.audioPath = ''
        };
        while (gameListWrapper.firstChild) {
            gameListWrapper.removeChild(gameListWrapper.firstChild);
        }
        shuffleSongs = shuffle(queue[index]);
        winner = winSong(shuffleSongs);
        appendLi(shuffleSongs, gameListWrapper);
        player.audioPath = shuffleSongs[winner[1]].src;
        nextBtn.disabled = true;
    } else {
        winWrapper.classList.remove('hide');
        player.isPlay();
        if (secondPlayer.audioPath) {
            secondPlayer.isPlay()
            secondPlayer.audioPath = '';
        }
    }
})

let lastResult = 0;
const scoreText = document.querySelector('.score');

function win() {
    if (index === queue.length) {
        nextBtn.disabled = false;
        nextBtn.textContent = translations[language].finish;
        lastResult = songCounter.textContent;
        scoreText.textContent = translations[language].scoreFirst + lastResult + translations[language].scoreLast;
        localStorage.setItem('result', lastResult);
        if (Number(songCounter.textContent) != queue.length * 5) {
            restartBtn.classList.add('visible');
        }
    }
}

let target = 0;

function changeLanguage(lang) {
    languageBtn.textContent = translations[lang].langBtn;
    acceptBtn.textContent = translations[lang].acceptBtn;
    startBtn.textContent = translations[lang].startBtn;
    resultBtn.textContent = translations[lang].resultBtn;
    aboutBtn.textContent = translations[lang].aboutBtn;
    musicBtn.textContent = translations[lang].musicBtn;
    restartBtn.textContent = translations[lang].restartBtn;
    nextBtn.textContent = translations[lang].nextBtn;
    document.querySelector('.warning-text').textContent = translations[lang].warning;
    document.querySelector('.welcome-text').textContent = translations[lang].welcome;
    document.querySelector('.choose-text').textContent = translations[lang].chooseSong;
    document.querySelectorAll('.start-lvl').forEach((item, index) => {
        item.textContent = translations[lang].LVL[index];
    })
    document.querySelector('.congratulations').textContent = translations[lang].congratulations;
    scoreText.textContent = translations[lang].scoreFirst + lastResult + translations[lang].scoreLast;
    if (currentDescription && secondPlayer.audioPath) {
        description.textContent = shuffleSongs[currentDescription].story[language];
    }
    musicDescription.textContent = librarySongs[target].story[language];
    if (index === queue.length) {
        nextBtn.textContent = translations[language].finish;
    }
}

resultBtn.addEventListener('click', () => {
    additionalNoise(additional[0].swap);
    winWrapper.classList.remove('hide');
    if (lastResult < queue.length * 5) {
        restartBtn.classList.add('visible');
    }
})
restartBtn.addEventListener('click', () => {
    musicPlayer.isPlay();
    resetLogoAndText()
    refresh();
    winWrapper.classList.add('hide');
    if (!gameContainer.classList.contains('show')) {
        gameContainer.classList.add('show');
    };
    additionalNoise(additional[0].again);
    restartBtn.classList.remove('visible');
})


const musicLogo = document.querySelector('.music-logo');
const musicDescription = document.querySelector('.music-description');
const musicTitle = document.querySelector('.title');
const musicName = document.querySelector('.name');
const proControls = document.querySelector('.pro-controls');

const songArrowLeft = document.createElement('div');
const songArrowRight = document.createElement('div');
songArrowLeft.classList.add('song-arrow', 'left-arrow');
songArrowRight.classList.add('song-arrow', 'right-arrow');
proControls.appendChild(songArrowLeft);
proControls.appendChild(play3);
proControls.appendChild(songArrowRight);

musicPlayer.audioPath = librarySongs[0].src;
musicLogo.src = librarySongs[0].logo;
musicDescription.textContent = librarySongs[0].story[language];
musicTitle.textContent = librarySongs[0].title;
musicName.textContent = librarySongs[0].song;


let check = 0;

let listItems = document.querySelectorAll('.list-item');
listItems[target].classList.add('active');

musicList.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-song')) {
        target = e.target.getAttribute('data-song');
        changeSong(target);
    }
})
songArrowLeft.addEventListener('click', () => {
    check -= 1;
    if (check < 0) {
        check = librarySongs.length - 1
    }
    changeSong(check);

})
songArrowRight.addEventListener('click', () => {
    check = Number(check) + 1;
    if (check > librarySongs.length - 1) {
        check = 0;
    }
    changeSong(check);
})
const rock = document.querySelector('.rock');
rock.onclick = disturbed;
function disturbed() {
    additionalNoise(additional[0].ya);
}
musicPlayer.nextSong(target, librarySongs.length, changeSong);
function changeSong(num) {
    listItems.forEach(item => {
        item.classList.remove('active');
    })
    check = num;
    musicPlayer.audioPath = librarySongs[num].src;
    musicDescription.textContent = librarySongs[num].story[language];
    musicLogo.src = librarySongs[num].logo;
    musicTitle.textContent = librarySongs[num].title
    musicName.textContent = librarySongs[num].song;
    listItems[num].classList.add('active');
    musicPlayer.toggleAudio();
    musicPlayer.nextSong(+num, librarySongs.length, changeSong);
}

console.log('ДОБРО ПОЖАЛОВАТЬ НА ВИКТОРИНУ : УГАДАЙ МЕЛОДИЮ. Суть сводится к простому : угадал - ты победил, нет - welcome to the our club ,buddy');
console.log(`Авторское приложение ,схожее на songbird. Удачи!`);
console.log(`P.S. Если вам лень угадывать все время и хотите быстрее проверить работоспособность ... На 130 строке есть посдказка,которую можно раскомитить`)
console.log(`Вёрстка, дизайн, UI всех трёх страниц приложения +60: \n
+Стартовая страница приложения (вёрстка адаптивная - проверяется на ширине от 1920рх до 360рх) +20 \n
+Страница викторины (вёрстка адаптивная - проверяется на ширине от 1920рх до 360рх) +30 \n
+Страница с результатами (вёрстка адаптивная - проверяется на ширине от 1920рх до 360рх) +10 \n`);
console.log(`+Аудиоплеер +30(можно выбрать только один из трёх пунктов) \n
стандартный HTML5 +10 \n
кастомный, функционал полностью такой же, как в демо приложения, могут быть небольшие отличия в оформлении, например, может отличаться по цвету: +20 \n
+у кастомного аудиоплеера из предыдущего пункта есть регулятор громкости звука +30 \n`);
console.log(`Верхняя панель страницы викторины +20 \n
+правильное отображение счета игры +10 \n
+текущий вопрос выделяется стилем +10 \n`);
console.log(`Блок с вопросом +20 \n
+подстановка дефолтного изображения и замена названия птицы на символы (***), пока игрок не выберет правильный ответ +10 \n
+при выборе правильного ответа в блоке с вопросом отображается изображение и название загаданной птицы +10\n`);
console.log(`Блок с вариантами ответов (названия птиц(песен)) +60 \n
+цветовая индикация правильного/неправильного ответа в виде индикаторов разного цвета рядом с названием птицы: +10 \n
+звуковая индикация правильного/неправильного ответа: +30 \n
+при выборе правильного или неправильного ответа издаются разные звуковые сигналы: +10 \n
+при выборе неправильного ответа проигрывание аудиоплеера не должно останавливаться: +10 \n
+при выборе правильно ответа проигрывание аудиоплеера должно остановиться: +10 \n
+при клике по названию птицы в блоке с описанием птицы отображается информацию о ней: +10 \n
+если правильный ответ уже дан, возможность просматривать описания птиц при клике по вариантам ответов остаётся, цвет индикаторов при этом не изменяется: +10`);
console.log(`Блок с описанием птицы: +30 \n
+пока игрок не кликнул по названию птицы из списка, в блоке выводится короткий текст с предложением послушать плеер и выбрать название птицы, чей голос прозвучал +10 \n
+при клике по названию птицы из списка, в блоке с описанием птицы появляется актуальная информация о ней +20 \n
Информация о птице включает:
+изображение \n
+название (на русском и на латыни) \n
+аудиоплеер с записью голоса \n
+дополнительное описание птицы.\n`);
console.log(`Кнопка перехода к следующему вопросу +30 \n
+пока не выбран правильный ответ, кнопка не активна, нет возможности перейти к следующему заданию. Активное и неактивное состояние кнопки визуально отличаются, например, активная кнопка имеет зеленый, не активная - серый цвет +10 \n
+после правильного ответа на последний вопрос игрок переходит к странице с результатами викторины +10 \n
+страница с результатами содержит количество набранных баллов и кнопку с предложением сыграть ещё раз (или уведомление об окончании игры, если набрано максимальное количество баллов) +10 \n`)
console.log(`Extra scope +20 \n
Можно выбрать предложенные варианты или придумать свои, аналогичные им по сложности\n
+локализация приложения на два языка, выбранный язык хранится в local storage и сохраняется при перезагрузке +10 \n
+-создание галереи всех птиц приложения c информацией о них (фото, аудио, название, описание) +10\n
+сделал аналогию на музыкальный плеер с автопроигрыванием,информаций о песне,названием и лого`);