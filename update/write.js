//把拉去的标签数组保存到mysql数据中
const { query } = require('../db');


exports.tags = async function (tags) {
    for (tag of tags) {
        let oldTags = await query(`SELECT * FROM tags WHERE title= ?`, [tag.title])
        if (Array.isArray(oldTags) && oldTags.length > 0) {
            await query(`UPDATE tags SET image=?,subscribe=?,article=?,href=? WHERE id=?`,
                [tag.image, tag.subscribe, tag.article, tag.href, oldTags[0].id])
        } else {
            await query(`INSERT INTO tags(title,image,subscribe,article, href ) VALUES(?,?,?,?,?)`,
                [tag.title, tag.image, tag.subscribe, tag.article, tag.href]);
        }
    }
}


exports.articles = async function (articles) {
    for (article of articles) {
        let oldArticles = await query(`SELECT * FROM articles WHERE id= ?`, [article.id])
        if (Array.isArray(oldArticles) && oldArticles.length > 0) {
            await query(`UPDATE articles SET title=?,content=?,href=? WHERE id=?`,
                [article.title, article.content, article.href, article.id])
        } else {
            await query(`INSERT INTO articles(id,title,content,href) VALUES(?,?,?,?)`,
                [article.id, article.title, article.content, article.href]);
        }

        await query(`DELETE FROM tag_article WHERE article_id=?`, [article.id]);

        let tagWhere = "'" + article.tags.join("','") + "'";

        let tagIds = await query(`SELECT id  FROM tags WHERE title IN(${tagWhere})`);

        for (tagId of tagIds) {
            await query(`INSERT INTO tag_article(article_id,tag_id) VALUES(?,?)`, [article.id, tagId.id])
        }
    }
}




