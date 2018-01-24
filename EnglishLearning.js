// 1. source: 世界公民文化 創意學習
// 2. find the latest 15 news
// 3. parse down and save to EnglishLearningController
(function() {
    const Nightmare = require('nightmare');
    const nightmare = Nightmare({ show: false });

    let CoreCornerParser = (function() {
        return {
            findLatestNews: function(latestNum) {
                return nightmare.goto('http://www.core-corner.com/Web/CrIndex.php#')
                    .evaluate((latestNum) => {
                        return [...document.querySelectorAll('.hovereffect')].map((source) => {
                            return {
                                titleImgSrc: source.querySelector('img').src,
                                title: source.querySelector('.overlay > h2 > a > span').textContent,
                                href: source.querySelector('.overlay > .info').href
                            };
                        });;
                    }, latestNum)
                    .end()
                    .catch(e => console.log);
                    // .then(console.log);
            }
        };
    })();

    let EnglishLearningController = (function() {
        let newsList = [];
        return {
            updateNews: function(callback) {
                CoreCornerParser.findLatestNews()
                    .then((data) => {
                        newsList = data;
                        callback();
                    });
            },
            getNewsList: function() {
                return newsList;
            }
        };
    })();
    // EnglishLearningController.updateNews(function() {
    //     console.log(EnglishLearningController.getNewsList());
    // });
    module.exports = EnglishLearningController;
})();