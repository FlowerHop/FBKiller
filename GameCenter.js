// 1. source: 巴哈姆特
// 2. find the latest 10 news
// 3. parse down and save to GameCenterController
(function() {
    const Nightmare = require('nightmare');
    const nightmare = Nightmare({ show: false });


    let GamerParser = (function() {
        return {
            // return a nightmare
            findLatestNews: function(latestNum) {
                return nightmare.goto('https://gnn.gamer.com.tw/index.php?k=')
                    .evaluate((latestNum) => {
                        let sourceList = [...document.querySelectorAll(`.GN-lbox2B:nth-child(-n+${latestNum+1})`)];
                        let latests = [];
                        sourceList.forEach((source) => {
                            latests.push({
                                titleImgSrc: source.querySelector('.GN-lbox2E > a > img').src,
                                title: source.querySelector('.GN-lbox2D > a').textContent,
                                previewContent: source.querySelector('.GN-lbox2C').textContent,
                                href: source.querySelector('.GN-lbox2C > a').href
                            });
                        });
                        return latests;
                    }, latestNum)
                    .end()
                    .catch((e) => console.log(e));
            }
        };
    })();

    let GameCenterController = (function() {
        let newsList = [];
        return {
            updateNews: function(callback) {
                GamerParser.findLatestNews(10)
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

    // GameCenterController.updateNews(function() {
    //     console.log(GameCenterController.getNewsList()); 
    // });
    module.exports = GameCenterController; 
})();

