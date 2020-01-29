const https = require("https");
const express = require('express');
var timeout = require('connect-timeout'); //express v4

const app = express();
const tipidPcFeeds = require('./routes/feeds');
const tipidPcSearch = require('./routes/search');
const tipidPcUserItems = require('./routes/useritems');
const tipidPcUserSearch = require('./routes/userSearch');
const playground = require('./routes/playground')

// Routers
app.set('json spaces', 2);
app.use('/tipidpc', tipidPcFeeds);
app.use('/tipidpc', tipidPcSearch);
app.use('/tipidpc', tipidPcUserItems)
app.use('/tipidpc', tipidPcUserSearch)
app.use('/playground', playground)

app.use(timeout(240000));
// 30000

// Error Handle
app.use(function(error, req, res, next) {
    
    if (!error) return next();
    return res.status(400).json({
      status: 400,
      error: 'Oops! Bad request',
    });
    // res.json({ message: error.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port));