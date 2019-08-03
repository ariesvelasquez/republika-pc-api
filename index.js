const express = require('express');

const app = express();
const tipidPc = require('./routes/tipidPc');

// Routers
app.set('json spaces', 2);
app.use('/tipidpc', tipidPc);

// app.get('tipidpc/buying/:page', (req, res) => {

//     const pageNumber = req.params.page;
//     const url = BASE_URL + BUYING_PAGE + pageNumber;

//     request(BASE_URL, (error, response, html) => {

//         if (!error) {

//             const $ = cheerio.load(html);
//             console.log(url);
            
//             res.send(html);
//         }
//     });
// });

// puppeteer
// app.get('/puppeteer', async (req, res) => {
    // try {
    //     const $ = require('cheerio');
    //     const browser = await puppeteer.launch({headless: false});
    //     const page = await browser.newPage();
    //     page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');

    //     // Launch TipidPc Website then find the view all button
    //     await page.goto("https://tipidpc.com/");
    //     // Form that contains the view all button
    //     await page.waitForSelector('.itembrowser');
    //     // Click show items button
    //     const buttonViewAll = await page.$('#itembrowser input[type=submit]')

    //     buttonViewAll.click()

    //     await page.waitForSelector('#item-search-results')

    //     const items = await page.$$('#item-search-results > li')

    //     for (const item of items) {
    //         const text = await item.$eval('a', a => a.innerText)
    //         console.log(text)
    //     }

    // } catch (e) {
    //     console.log("MY ERROR ", e);
    // }
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port));
