const express = require('express');
const router = express.Router();

const puppeteer = require('puppeteer');

var ResponseItems = require("../models/Item")

// Sample api
// http://localhost:3000/tipidpc/sell/1 
        
router.get('/sell/:iteration', async (req, res, next) => {
    try {
        // response array of items
        const browser = await puppeteer.launch({headless: false});
        const browserPage = await browser.newPage();
        browserPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');

        // Launch TipidPc Website then find the view all button
        await browserPage.goto("https://tipidpc.com/");
        // Form that contains the view all button
        await browserPage.waitForSelector('.itembrowser');
        // Click show items button
        const buttonViewAll = await browserPage.$('#itembrowser input[type=submit]')

        buttonViewAll.click()

        await browserPage.waitForSelector('#item-search-results')

        const items = await browserPage.$$('#item-search-results > li')

        var itemsForSale = []

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
            
            // const date = extractDateFromString(completeDescription)            

            const postUrl = await item.$eval('a', a => a.href);
            // This contains the seller url,
            // This is still need to be emplemented
            const postUrls = await browserPage.evaluate(a => a.innerHTML, item);;

            // console.log("Desc pt1" + splittedDescription[0]);
            // console.log("Desc pt2" + splittedDescription[1]);
            // console.log("Desc pt3" + splittedDescription[2]);

            var sellItem = new ResponseItems(
                title,
                price,
                "DESCRIPTION",
                seller,
                date,
                "sellerUrl",
                postUrl
            )

            itemsForSale.push(sellItem)
        }

        res.json(itemsForSale)

    } catch (e) {
        console.log("MY ERROR ", e);
    }


});

function extractDateFromString(fullDescription) {
    // Use regex to find the date
    // Sample Date "Aug 03 2019 09:27 PM"
    // Sometimes the date can be get on other index so
    // find out where is the date.
    var regexx = /^ [a-zA-Z]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2} [a-zA-Z]{2}$/i;

    // This will divide the whole description to two parts using "on"
    // the second part contains the date
    const splittedDescription = fullDescription.split("on");

    const description = "Invalid date format";

    if  (regexx.test(splittedDescription[1])) {
        console.log("regex1")
        return splittedDescription[1].trim()
    } else if (regexx.test(splittedDescription[2])) {
        console.log("regex2")
        return splittedDescription[2].trim()
    } else {
        console.log("else")
        return description
    }
}

module.exports = router