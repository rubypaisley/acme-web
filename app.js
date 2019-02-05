const express = require('express');
const db = require('./db');

const app = express();

app.use((req, res, next) => {
    db.getPages()
        .then( pages => {
            req.pages = pages;
            next();
        })
        .catch(next);
});

app.get('/', (req, res, next) => {
    const page = req.pages[0];
    res.redirect(`/pages/${page.id}`);
});

app.get('/pages/:id', (req, res, next) => {
    db.getContent(req.params.id)
        .then( content => res.send(`
        <html>
        <body>
            <h1>Acme Web</h1>
            <ul id='nav'>
                ${ req.pages.map(page => {
                    return `<li><a href ='/pages/${page.id}'>${page.name}</a></li>`;
                }).join('')
                }
            </ul>
            <div>
                ${ content.map(item => {
                    return `<h2>${item.name}</h2>
                    <p>${item.body}</p>
                    `;
                } ).join('')}
            </div>
        </body>
        </html>

        `))
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));

db.sync();