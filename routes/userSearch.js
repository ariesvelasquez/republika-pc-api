const express = require('express');
const $ = require('cheerio');
const router = express.Router();

const puppeteer = require('puppeteer');

var ResponseItems = require("../models/item")

var searchItems = []

// Sample Usage 
// http://localhost:3000/tipidpc/usersearch/pchub

// Sample URL
//https://tipidpc.com/usersearch.php?key=pchub

router.get('/user_search/:userName/', async ( req, res, next) => {

    // req.on("close", function() {
    //     res.send();
    // });

    try { 
        // Get the page
        const userName = req.params.userName

        // Set the URL
        const pageUrl = "https://tipidpc.com/usersearch.php?key="+ userName

        // Setup Crawler
        puppeteer
        // .launch({headless: false})
        .launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '–disable-dev-shm-usage', '--disable-extensions']
        })
        .then(function(browser){
            return browser.newPage()
        })
        .then(async function(page) {
            return page.goto(pageUrl).then(function() {
              return page.content();
            });
        })
        .then(function(html) {
            // $('#user-ifs LI h4 A', html).each((i, el) => {}); <- reference

            $('.userlist LI', html).each((i, el) => {

                // Extract Data 
                var name = $('h2 a', el).text()

                var feedItem = new ResponseItems(
                    "title", // title
                    "", // Price
                    name,
                    "", // Date
                    "", // post link id
                    "1", // Page
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

        })
        .catch(function(e) {
            return res.status(400).json({
                status: 400,
                error: e.message,
            })
        });

    } catch (e) {
        console.log("userSearch Error " + e.message)
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