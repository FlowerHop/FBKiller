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
    const Nightmare = require('nightmare');
    const nightmare = Nightmare({ show: false });




    let DM5Parser = (function() {
        return {
            // 1. get latest comics(, one piece now)
            // 2. get latestComics
            // 3. iterate the latestComics
            //   - goto
            //   - get length of imgs
            //   - iterate the imgs
            //     --  goto and return img.src

            // return a promise which returns an array storing the latest chapters of comic
            findLatestComics: function(comic, latestNum) {
                return nightmare.goto(comic.urls['dm5'])
                    .evaluate((comic, latestNum) => {
                        let list = [...document.querySelectorAll(`#detail-list-select-1 > li:nth-child(-n + ${latestNum}) > a`)].map((link, index) => {
                            if (index === 0) latestChapter = link.textContent.match(/\d+/g)[0];
                            return {
                                url: link.href,
                                imgSrcs: []
                            };
                        });

                        return {
                            list: list,
                            latestChapter: latestChapter
                        };
                    }, comic, latestNum)
                    .then((results) => {
                        if (results.latestChapter <= comic.latestChapter) throw 'There is no new comics.';
                        comic.latestChapter = results.latestChapter;
                        return results.list.reduce((accumulator, chapter) => {
                                return accumulator.then(() => {
                                    return this.parseImgs(chapter);
                                })
                            }, Promise.resolve())
                            .then(() => results.list);
                    }).catch(console.log)
            },
            parseImgs: function(chapter) {
                return nightmare.goto(chapter.url.replace('dm5', 'manhuaren'))
                    .evaluate(() => {
                        return [...document.querySelectorAll('#cp_img > img')].map(img => img.dataset.src);
                    })
                    .then((imgSrcs) => {
                        chapter.imgSrcs = imgSrcs;
                    });
            }
        };
    })();

    let ComicController = (function() {
        let comics = {
            'onePiece': {
                urls: { dm5: 'http://www.dm5.com/manhua-haizeiwang-onepiece/' },
                latestChapter: 0,
                chapters: []
            },
            // 'Attack on Titan': {
            //     urls: { dm5: 'http://www.dm5.com/manhua-jinjidejuren/' },
            //     latestChapter: 0,
            //     chapters: []
            // },
            // 'myHeroAcademia': {}

        };
        return {
            updateComics: function(callback) {
                for (let k in comics) {
                    DM5Parser.findLatestComics(comics[k], 1)
                        // param data is an array storing the latest chapters
                        .then(chapters => {
                            if (chapters)
                                comics[k].chapters = chapters;
                            callback();
                        })
                }
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