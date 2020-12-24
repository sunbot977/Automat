const cheerio = require('cheerio');
const request = require('request');

var info = ""

let url = 'http://www.botcomissions.kro.kr/'
request(url, function(error, response, body) {
    const $ = cheerio.load(body);
    let info = $('.info')

    info_1 = info[0].children[0].data.trim()
    info_2 = info[0].children[3].prev.data.trim()
    info_3 = info[0].children[6].prev.data.trim()
    info_4 = info[0].children[9].prev.data.trim()
    info_5 = info[0].children[10].data.trim()

    console.log(`\n=[ Notice ]=\n\n${info_1}\n${info_2}\n\n${info_3}\n\n${info_4}\n${info_5}`)
})

module.exports = info;