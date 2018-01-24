const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });

const comicList = {
    'onePiece': [],
    'myHeroAcademia': [],
    'Attack on Titan': []
};

// Solution 1 (failed):
//   1. goto http://www.dm5.com/manhua-haizeiwang-onepiece/
//   2. find the latest link (ex: http://www.dm5.com/m570154/)
//   3. goto the latest link 
//   4. find the pages 
//   5. interately goto link+page (ex: http://www.dm5.com/m570154/#ipg1)

//   It failed when it parsed all the imgs. Nightmare iterately goto 16 web
//   pages and parse down the img, and then it shutdown without any error msgs.

// Solution 2 (success):
//   1. same as Solution 1
//   2. same as Solution 1
//   3. parse the id (ex: http://www.dm5.com/m570154/ -> m570154)
//   4. goto https://www.manhuaren.com/${id}/
//   5. parse down all the imgs by get img.dataset.src (because it will get 
//         the default imgs if directly get img.src)


// 1. source: dm5
// 2. find all comics pages
// 3. parse down and save to ComicsController

(function() {
    let DM5Parser = (function() {
        return {
            // 1. get latest comics(, one piece now)
            // 2. get latestComics
            // 3. iterate the latestComics
            //   - goto
            //   - get length of imgs
            //   - iterate the imgs
            //     --  goto and return img.src

            findLatestComics: function(latestNum) {
                let latestComics;
                return nightmare.goto('http://www.dm5.com/manhua-haizeiwang-onepiece/')
                    .evaluate((latestNum) => {
                        return [...document.querySelectorAll(`#detail-list-select-1 > li:nth-child(-n + ${latestNum}) > a`)].map((link) => {
                            return {
                                url: link.href,
                                imgs: []
                            }
                        });
                    }, latestNum)
                    .then((list) => {
                        latestComics = list;
                        return latestComics.reduce((accumulator, comic) => {
                                return accumulator.then(() => {
                                    return this.parseImgs(comic);
                                })
                            }, Promise.resolve())
                            .then(() => latestComics);
                    }).catch(console.log)
            },
            parseImgs: function(comic) {
                return nightmare.goto(comic.url)
                    .evaluate(() => {
                        return document.querySelector('#chapterpager > a:last-child').textContent;
                    }).then(length => {
                        return nightmare.goto(comic.url.replace('dm5', 'manhuaren'))
                            .evaluate(() => {
                                return [...document.querySelectorAll('#cp_img > img')].map(img => img.dataset.src);
                            })
                            .then((imgs) => {
                                comic.imgs = imgs;
                            });
                    })
            }
        };
    })();

    let ComicController = (function() {
        let comics = [];
        return {
            updateComics: function(callback) {
                DM5Parser.findLatestComics(1)
                    .then(data => {
                        comics = data;
                        callback()
                    });
            },
            getComics: function() {
                return comics;
            }
        };
    })();

    // ComicController.updateComics(() => {
    //     console.log(ComicController.getComics());
    // });

    module.exports = ComicController;
})();