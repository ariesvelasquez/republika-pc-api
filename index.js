const express = require('express');

const app = express();
const tipidPc = require('./routes/tipidPc');
const playground = require('./routes/playground')

// Routers
app.set('json spaces', 2);
app.use('/tipidpc', tipidPc);
app.use('/playground', playground)

// Error Handle
app.use(function(error, req, res, next) {
    console.log("Handled Error")
    res.json({ message: error.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port));
