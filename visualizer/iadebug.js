var express = require('express');
var IAVizRouter = require('./router');

var app = express();

var PORT = process.env.PORT || 4000;

app.use('/api', IAVizRouter);

app.use(express.static('visualizer'));

console.log('Listening on '+ PORT);
app.listen(PORT);