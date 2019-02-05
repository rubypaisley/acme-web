const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_web_db');

const getPages = () => {
    return client.query('SELECT * from pages')
        .then(response => response.rows);
}

const getPage = (id) => {
    return client.query('SELECT * from pages WHERE id =$1', [ id ])
        .then(response => response.rows[0]);
}

const getContent = (id) => {
    return client.query('SELECT * from content WHERE page_id =$1', [ id ])
        .then(response => response.rows)
}

const sync = () => {
    return client.query(SEED);
}
const SEED = `
    DROP TABLE IF EXISTS pages;
    DROP TABLE IF EXISTS content;
    CREATE TABLE pages(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) unique,
        is_home_page BOOLEAN

    );
    INSERT INTO pages(name, is_home_page) values('home', true);
    INSERT INTO pages(name, is_home_page) values('employees', false);
    INSERT INTO pages(name, is_home_page) values('contact', false);

    CREATE TABLE content(
        id SERIAL PRIMARY KEY,
        name VARCHAR(1000) unique,
        body VARCHAR(1000),
        page_id INT

    );
    INSERT INTO content(name, body, page_id) values('Welcome to the Home Page', 'Please Browse Our Site', 1);    
    INSERT INTO content(name, body, page_id) values('Blossom', 'Blossom is Our CEO!', 2);
    INSERT INTO content(name, body, page_id) values('Buttercup', 'Buttercup is our CTO!', 2);
    INSERT INTO content(name, body, page_id) values('Bubbles', 'Bubbles is the COO!!', 2);
    INSERT INTO content(name, body, page_id) values('Phone', 'call us 212-555-1212', 3);
    INSERT INTO content(name, body, page_id) values('Fax', 'fax us 212-555-1212', 3);
`;

client.connect()
    .then( () => console.log('connected'));



module.exports = {
    getPages,
    getPage,
    getContent,
    sync
}
