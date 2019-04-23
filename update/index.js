let read =require('./read');
let write =require('./write');

(async ()=>{
    let tagUrl = 'https://juejin.im/subscribe/all';
    let tags=await read.tags(tagUrl);//读取标签列表
    await write.tags(tags);//写入标签列表到mysql

    let allArticles={};
    for(tag of tags){
       let articles= await read.articleList(tag.href);
       articles.forEach(article=>allArticles[article.id]=article);
    }

    await write.articles(Object.values(allArticles));
    process.exit();
})();





