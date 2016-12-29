var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.render('world', {title: 'Express'});
    load_news_list(main_url,req.query.offset,req.query.count, function (items) {
        res.send(items)
    })
});




module.exports = router;
var superagent = require('superagent');
var cheerio = require('cheerio');
const charset = require('superagent-charset');
var fs = require('fs');
var path = require('path');
var main_url = 'http://c.m.163.com/nc/article/headline/T1348647853363/';
charset(superagent);
function load_news_list(url, offset,count,callback) {
    if(offset ===undefined)offset = 0
    if(count ===undefined)count = 10
    index = count*offset
    url+=index+'-'+(index+20)+'.html';
    console.log('开始抓取 ' + url)
    superagent
        .get(url)
        .set('Connection', 'close')
        .set('User-Agent', 'Paw/2.1 (Macintosh; OS X/10.11.6) GCDHTTPRequest')
        //.charset('gbk')
        .end(function (err, sres) {
            // 常规的错误处理

            if (sres.ok) {
                var news = sres.body.T1348647853363
                var items = []
                news.shift()
                news.forEach(function (newsItem) {
                    var item = {}
                    item.title = newsItem.ltitle
                    item.img = newsItem.imgsrc
                    item.desc = newsItem.digest
                    item.source = newsItem.source
                    item.url = newsItem.url_3w
                    item.date = newsItem.lmodify
                    items.push(item)
                })

                callback(items)
                console.dir(sres.body.toString())
                console.dir(JSON.stringify(sres.body))
            }else{
                callback([])
            }
        });
}
// load_news_list(main_url, function () {
//
// })