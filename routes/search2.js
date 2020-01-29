const express = require('express');
const $ = require('cheerio');
const router = express.Router();

const puppeteer = require('puppeteer');

var ResponseItems = require("../models/Item")

var searchItems = []

// Sample Usage 
// http://localhost:3000/tipidpc/usersearch/pchub

// Sample URL
//https://tipidpc.com/itemsearch.php?sec=s&namekeys=pchub&cat=&page=1

router.get('/search/:item/:pageNumber', async ( req, res, next) => {

    // req.on("close", function() {
    //     res.send();
    // });

    try { 
        // Get the page
        const searchKey = req.params.item
        const pageNumber = req.params.pageNumber

        // Set the URL
        const pageUrl = "https://tipidpc.com/itemsearch.php?sec=s&namekeys="+ searchKey +"&cat=&page=" + pageNumber

        // Setup Crawler
        const browser = await puppeteer.launch({ 
            // args: ['--no-sandbox', '--disable-setuid-sandbox', '–disable-dev-shm-usage', '--disable-extensions']
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
                // ,
                // ,
                // '--disable-gpu',
                // '--disable-dev-shm-usage',
                // '--proxy-server="direct://"',
                // '--proxy-bypass-list=*'
           ]
        })

        browser.newPage()
        .then(async function(page) {
            return page.goto(pageUrl).then(function() {
              return page.content();
            });
        })
        .then(function(html) {

            $('#item-search-results LI', html).each((i, el) => {
                
                // Extract Data
                var itemName = $('.item-name', el).text()
                var price =  $('.catprice h3', el).text()
                var postLinkId = $('.item-name', el).attr('href').split("=")[1]

                var baseElemenentText = $(el).text()
                var seller = baseElemenentText.split("\n")[7].split("by")[1].trim()
                var date = baseElemenentText.split("\n")[8].split("on")[1].trim()

                const page = pageNumber

                var feedItem = new ResponseItems(
                    itemName,
                    price,
                    seller,
                    date,
                    postLinkId,
                    page,
                    false // is_feed
                )

                searchItems.push(feedItem)
            });

            // Handle If Searh Result is Empty
            // Valid User with no for sale item: asdfasdf
            if (searchItems.length == 0) {
                res.status(200).json({
                    page: 1,
                    isListEmpty: true,
                    items: []
                })
            }

            // console.log("search items count " + searchItems.length)

            res.status(200).end(JSON.stringify({
                page: "1",
                items: searchItems
            }))

            searchItems = []

            browser.close()
        })
        // .finally (function() {
        //     browser.close()
        // })
        .catch(function(e) {
            console.log("searchItems Error " + e.message)
            // return res.status(400).json({
            //     status: 400,
            //     error: e.message,
            // })
        });

        // await browser.newPage()

    } catch (e) {
        console.log("searchItems Error " + e.message)
    }
})

// function extractDateFromString(fullDescription) {
//     // Use regex to find the date
//     // Sample Date "Aug 03 2019 09:27 PM"
//     // Sometimes the date can be get on other index so
//     // find out where is the date.
//     var regexx = /^ [a-zA-Z]{3} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2} [a-zA-Z]{2}$/i;

//     // This will divide the whole description to two parts using "on"
//     // the second part contains the date
//     const splittedDescription = fullDescription.split("on");

//     const description = "Invalid date format";

//     if  (regexx.test(splittedDescription[1])) {
//         // console.log("regex1")
//         return splittedDescription[1].trim()
//     } else if (regexx.test(splittedDescription[2])) {
//         // console.log("regex2")
//         return splittedDescription[2].trim()
//     } else {
//         // console.log("else")
//         return description
//     }
// }

module.exports = router