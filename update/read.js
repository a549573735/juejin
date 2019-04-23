const request = require('request-promise');
const cheerio = require('cheerio');
const { filterText } =require('../util/tools')
let baseUrl = 'https://juejin.im'

exports.tags = async (url) => {
    let options = {
        url,
        transform(body) {
            return cheerio.load(body);
        }
    }
    return request(options).then($ => {
        let infos = $('.item .tag .info-box')
        let tags = [];
        infos.each((index, info) => {
            let tagInfo = $(info);
            let image = tagInfo.find('div.thumb').first().data('src');
            let title = tagInfo.find('div.title').first().text();
            let subscribe = tagInfo.find('div.subscribe').first().text();
            let article = tagInfo.find('div.article').first().text();
            let href = tagInfo.find('a').first().attr('href');
            tags.push({
                image,
                title,
                subscribe: Number(subscribe.match(/^(\d+)/)[1]),
                article: Number(article.match(/^(\d+)/)[1]),
                href: `${baseUrl}${href}`
            });
        })
        return tags.slice(0,10);
    })
}



exports.articleList = async (url) => {
    let options = {
        url,
        transform(body) {
            return cheerio.load(body);
        }
    }
    return request(options).then(async $ => {
        let articles = $('.title-row .title')
        let articleList = [];
        for (let i = 0; i < articles.length; i++) {
            item = $(articles[i]);
            let href = item.attr('href');
            let title = item.text();
            let { content, tags } = await articleDetail(baseUrl + href);
            articleList.push({
                href: `${baseUrl}${href}`,
                title:title,
                id: href.split(/^\/\w+\//)[1],
                content,
                tags
            })
        }
        return articleList;
    })
}

async function articleDetail(url) {
    let options = {
        url,
        transform(body) {
            return cheerio.load(body);
        }
    }
    return request(options).then($ => {
        let content = $('.main-area .article-content').first().html();
        let tagList = $('.main-area .tag-list .tag-title');
        let articleDetail = { tags: [], content: null };
        tagList.each((index, item) => {
            articleDetail.tags.push($(item).text());
        })
        articleDetail.content = content;
        return articleDetail;
    })
}

