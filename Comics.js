const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });

const comicList = {
    'onePiece': [],
    'myHeroAcademia': [],
    'Attack on Titan': []
};

// 1. source: dm5
// 2. find all comics pages
// 3. parse down and save to ComicsController

nightmare.goto('http://www.dm5.com/manhua-haizeiwang-onepiece/')

.click('#cbc_1 > li > a:first-child')
// .wait('#cp_image')
.evaluate(() => {
    console.log(document.querySelector('.topToolBar>.center>h1').textContent);
    // console.log(document.querySelector);
    // let imgSrc = document.querySelector('#cp_image').src;
    // // let href = document.querySelectorAll('#cbc_1 > li > a')[0].href;
    // console.log('must wait');
    // console.log(imgSrc);
    // return imgSrc;
})
.then (() => console.log('done'))
.catch((e)=>console.log(e));