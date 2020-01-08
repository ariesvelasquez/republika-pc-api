const express = require('express');
const router = express.Router();

const puppeteer = require('puppeteer');

var ResponseItems = require("../models/Item")

var searchItems = []

// Sample Usage 
// http://localhost:3000/tipidpc/user_items/pchub

// Sample URL
// https://tipidpc.com/useritems.php?username=pchub

router.get('/user_items/:userName/', async ( req, res, next) => {
    try {
        // Get the page
        const userName = req.params.userName

        // Set the URL
        const pageUrl = "https://tipidpc.com/useritems.php?username="+ userName

        // Setup Crawler
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '–disable-dev-shm-usage', '--disable-extensions']
        })

        const browserPage = await browser.newPage();
        browserPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');

        // Launch the page and collect data.
        await browserPage.goto(pageUrl);

        // This will handle when the page has zero items and return empty array
        // At this point, the page is completly loaded.
        if (await browserPage.$('#user-ifs') == null) {
            await browserPage.close()
            await browser.close()

            var feedItem = new ResponseItems(
                "", "", "", "", "", "", "", "", true, false
            )

            searchItems.push(feedItem)

            res.status(200).json({
                isListEmpty: true,
                items: searchItems
            })
            searchItems = []
            res.end()
            
            // console.log("Success, Empty Array")
        } 

        // The container of the items is available
        const itemContainer = await browserPage.waitForSelector('#user-ifs')
        
        // Now checking the items objects.
        const items = await browserPage.$$('#user-ifs > li')

        // Loop through the items on the page
        for (const item of items) {
            // Todo note: 
            // * For optimization, maybe try to pass the data extraction to the client to reduce processing.
            // * Convert Date to much more needed format.

            // Extract needed data
            const completeDescription = await browserPage.evaluate(li => li.innerText, item);
            const descriptionArray = completeDescription.split("\n");

            const priceAndTypeDescriptionArray = descriptionArray[1].split("—");
            
            // Seller Name, Date, etc.
            // const otherPostDetials = descriptionArray[3].split(" ");

            // Define new Item data
            const seller = userName;
            const title = descriptionArray[0];
            const price = priceAndTypeDescriptionArray[0].trim();
            // const type = priceAndTypeDescriptionArray[1].trim()

            // Get the date [In the website list, Date is not displayed]
            // const date = extractDateFromString(completeDescription)          

            // Get Post Url 
            const postLink = await item.$eval('a', a => a.href);

            const splittedPostLink = postLink.split("=");
            const postLinkId = splittedPostLink[1]

            // This contains the seller url,
            // This is still need to be emplemented
            // const postUrls = await browserPage.evaluate(a => a.innerHTML, item);;

            var feedItem = new ResponseItems(
                title,
                price,
                seller,
                "", // Date
                postLinkId,
                "1", // Page
                false, // is_empty
                false // is_feed
            )

            searchItems.push(feedItem)
        }

        // console.log("items returned: " + itemsForSale.length)
        
        // const pageNumber = res.params.pageNumber;

        res.status(200).end(JSON.stringify({
            page: "1",
            items: searchItems
        }))

        browser.close()

        searchItems = []
        // console.log("Success, With Items")

    } catch (e) {
        //  console.log("Handled Error")
        res.json({ message: e.message });
        res.end();
    }
})

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