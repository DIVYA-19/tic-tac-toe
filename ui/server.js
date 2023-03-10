var express = require('express');
var app = express();
var path = require("path")



app.use(express.static(path.join(__dirname + '/dist')));
app.set('port', process.env.PORT || 3000);

app.get('/**', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
})

var server = app.listen(app.get('port'), function () {
    console.log('listening on port ', server.address().port);
});