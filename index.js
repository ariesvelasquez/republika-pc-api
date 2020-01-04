const http = require("http");
const express = require('express');

const app = express();
const tipidPcFeeds = require('./routes/feeds');
const tipidPcSearch = require('./routes/search');
const playground = require('./routes/playground')

// Routers
app.set('json spaces', 2);
app.use('/tipidpc', tipidPcFeeds);
app.use('/tipidpc', tipidPcSearch);
app.use('/playground', playground)

// Error Handle
app.use(function(error, req, res, next) {
    console.log("Handled Error ")
    res.json({ message: error.message });
});

setInterval(function() {
    console.log("Wake Interval Func Called")
    http.get("https://republika-pc-api.herokuapp.com");
}, 300000)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port));
