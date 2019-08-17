const express = require('express');
const router = express.Router();

const puppeteer = require('puppeteer');

var ResponseItems = require("../models/Item")

router.get('/', async (req, res, next) => {
    try {

        const browser = await puppeteer.launch({headless: false});
        const browserPage = await browser.newPage();
        browserPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');

        // Launch TipidPc Website then find the view all button
        // await browserPage.goto("https://tipidpc.com/catalog.php?cat=0&sec=s&page=2");
        await browserPage.goto("https://tipidpc.com/catalog.php?cat=0&sec=s");


    } catch (e) {
        console.log("MY ERROR ", e);
    }
});

module.exports = router