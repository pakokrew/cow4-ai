'use strict';
var express = require('express');
var IAVizRouter = express.Router({ params: 'inherit' });
var _ = require('lodash');

var mockMap = require('../tests/mockMap.json');
var GameState = require('../client/modules/gamestate');
var Maze = require('../client/modules/maze');
var GameController = require('../client/modules/gamecontroller');


var game, map, maze;

map = new GameState();
map.fetchServerGameMap(mockMap);
maze = new Maze(map);

IAVizRouter.get('/', function(req, res, next) {
    res.send('api ok');
});

IAVizRouter.get('/getMap', function(req, res, next) {

    res.json(map.fetchedMap);
});

IAVizRouter.get('/getPlayers', function(req, res, next) {

    res.json(game.players);
});


IAVizRouter.get('/getDistances', function(req, res, next) {


    var source = map.getCellById(map.players.players[0].cellId);

    maze.computeWeights(source);

    res.json(maze.distances);
});

IAVizRouter.get('/getShortestRoutes', function(req, res, next) {


    var source = map.getCellById(map.players.players[0].cellId);
    var destination = map.getCellById(map.players.players[1].cellId);

    maze.computeWeights(source);
    var routes = maze.getShortestRoutes(destination);

    var paths = [];
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        paths.push(route.getPublic());
    }

    res.json(paths);
});

IAVizRouter.get('/getAllRoutes', function(req, res, next) {


    var source = map.getCellById(map.players.players[0].cellId);
    var destination = map.getCellById(map.players.players[1].cellId);

    maze.computeWeights(source);
    var routes = maze.getAllRoutes(destination);

    var paths = [];
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        paths.push(route.getPublic());
    }

    res.json(paths);
});

module.exports = IAVizRouter;
