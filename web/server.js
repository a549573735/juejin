const express = require('express');
const path = require('path');
const app = express();
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('html', require('ejs').__express);
const { query } = require('../db');
app.get('/', async function (req, res) {
    let tags = await query(`SELECT * FROM tags`);
    let { tagId } = req.query;

    let articles = await query(`SELECT articles.* FROM articles INNER JOIN tag_article ON articles.id = tag_article.article_id
    WHERE tag_article.tag_id=?`, [tagId ? tagId : tags[0].id]);

    res.render('index', {
        tags,
        articles
    })
})

app.get('/detail/:id', async function (req, res) {
    let id = req.params.id;
    let articles = await query(`SELECT * FROM articles WHERE id=?`, [id]);
    let article = articles[0];
    let tags = await query(`SELECT tags.* FROM tag_article INNER JOIN tags  ON  tag_article.tag_id = tags.id
   WHERE tag_article.article_id = ?`, [id]);

    res.render('detail', { article, tags })
})



app.listen(8080);

const CronJob = require('cron').CronJob;
const { spawn } = require('child_process')

const job = new CronJob('0 */30 * * * *', function () {
    let child = spawn(process.execPath, [path.resolve(__dirname, 'update/index.js')]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('error',function (){
        console.log('任务执行完毕');
    })
});

job.start();



