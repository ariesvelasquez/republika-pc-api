const express = require('express');
const router = express.Router();

const puppeteer = require('puppeteer');

var ResponseItems = require("../models/Item")

var searchItems = []

// Sample api use
// http://localhost:3000/tipidpc/feeds/1 

// Route without a page param
// Usually the first page
router.get('/feeds', async (req, res, next) => {

    req.on("close", function() {
        remote_request.abort();
    });

    configureTheURL(null, res)
})


// Route with a page param        
router.get('/feeds/:pageNumber', async (req, res, next) => {

    // req.on("close", function() {
    //     remote_request.abort();
    // });

    var pageNumber = req.params.pageNumber
    // console.log("router 2: " + req.params.pageNumber)

    configureTheURL(pageNumber, res)
})

async function configureTheURL(pageNumber, res) {
    // Set the URL, checks if has a page number or not
    var url = ""

    if (pageNumber) {
        url = "https://tipidpc.com/catalog.php?cat=0&sec=s&page=" + pageNumber
    } else {
        url = "https://tipidpc.com/catalog.php?cat=0&sec=s"
    }

    // console.log(url)

    // Now call the crawler and api producer method

    collectDataFromTipidPC(url, res, pageNumber)
}

async function collectDataFromTipidPC(url, res, pageNumber) {
    try {
        // response array of items
        // const browser = await puppeteer.launch({headless: false}); THIS COMMENTED INSTANCE IS WITH BROWSER
        // Setup Crawler
        const browser = await puppeteer.launch({ 
            // args: ['--no-sandbox', '--disable-setuid-sandbox', '–disable-dev-shm-usage', '--disable-extensions']
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
                // ,
                // '--disable-setuid-sandbox',
                // '--disable-gpu',
                // '--disable-dev-shm-usage',
                // '--proxy-server="direct://"',
                // '--proxy-bypass-list=*'
           ]
            
        })
        const browserPage = await browser.newPage();
        browserPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');

        // Launch the page and collect data.
        await browserPage.goto(url);

        // ==================================================================================
        /**
         * This commented code below is for crawling purposes,
         * the puppeteer accesses the home page then virtually clicking some objects to 
         * access selling page.
         * Since we can go directly to the selling page items, no need to crawl for now. 
         */
        // await browserPage.goto("https://tipidpc.com/");
        // Form that contains the view all button
        // Launch TipidPc Website then find the view all button

        // await browserPage.waitForSelector('.itembrowser');
        // Click show items button
        // const buttonViewAll = await browserPage.$('#itembrowser input[type=submit]')
        // buttonViewAll.click()

        // ==================================================================================

        // This will handle when the page has zero items and return empty array
        // At this point, the page is completly loaded.
        if (await browserPage.$('#item-search-results') == null) {
            await browserPage.close()
            await browser.close()

            res.status(200).json({
                page: pageNumber,
                isListEmpty: true,
                items: []
            })
            // console.log("Success, Empty Array")
        } 

        // The container of the items is available
        const itemContainer = await browserPage.waitForSelector('#item-search-results')
        
        // Now checking the items objects.
        const items = await browserPage.$$('#item-search-results > li')

        // Loop through the items on the page
        for (const item of items) {
            // Todo note: 
            // * For optimization, maybe try to pass the data extraction to the client to reduce processing.
            // * Convert Date to much more needed format.

            // Extract needed data
            const completeDescription = await browserPage.evaluate(li => li.innerText, item);
            const descriptionArray = completeDescription.split("\n");
            
            // Seller Name, Date, etc.
            const otherPostDetials = descriptionArray[3].split(" ");

            // Define new Item data
            const title = descriptionArray[0];
            const price = descriptionArray[2];
            const seller = otherPostDetials[2];

            // Get the date
            const date = extractDateFromString(completeDescription)

            // Get Post Url 
            const postLink = await item.$eval('a', a => a.href);

            const splittedPostLink = postLink.split("=");
            const postLinkId = splittedPostLink[1]

            // This contains the seller url,
            // This is still need to be emplemented
        // const postUrls = await browserPage.evaluate(a => a.innerHTML, item);;

            const page = pageNumber

            var feedItem = new ResponseItems(
                title,
                price,
                seller,
                date,
                postLinkId,
                page,
                true
            )

            searchItems.push(feedItem)
        }

        // console.log("items returned: " + searchItems.length)
        
        // const pageNumber = res.params.pageNumber;

        await browserPage.close()
        await browser.close()

        res.status(200).end(JSON.stringify({
            page: pageNumber,
            items: searchItems
        }))

        searchItems = []
        // console.log("Success, With Items")

    } catch (e) {
        //  console.log("Handled Error")
        console.log("feeds Error " + e.message)
    }
}

function extractDateFromString(fullDescription) {
    // Use regex to find the date
    // Sample Date "Aug 03 2019 09:27 PM"
    // Sometimes the date can be get on other index so
    // find out where is the date.
    var regexx = /^ [a-zA-Z]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2} [a-zA-Z]{2}$/i;

    // This will divide the whole description to two parts using "on"
    // the second part contains the date
    const splittedDescription = fullDescription.split("on");

    const description = "";

    if  (regexx.test(splittedDescription[1])) {
        // console.log("regex1")
        return splittedDescription[1].trim()
    } else if (regexx.test(splittedDescription[2])) {
        // console.log("regex2")
        return splittedDescription[2].trim()
    } else {
        // console.log("else")
        return description
    }
}

module.exports = router