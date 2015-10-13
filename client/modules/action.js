var _ = require('lodash');

function Action() {
    this.type = null;
    this.value = null;
}

Action.prototype.move = function(cellId) {
    this.type = 'move';
    this.value = cellId;
};

Action.prototype.getItem = function() {
    this.type = 'getItem';
};
Action.prototype.useItem = function(itemType) {
    this.type = 'useItem';
    this.value = itemType;
};

Action.prototype.getServerAction = function() {

    if(!this.type) {
        console.log('Please set an action before');
        return;
    }

    var serverAction = {};
    switch(this.type) {
        case 'move':
            serverAction.type = 'move';
            serverAction.target = this.value;
            break;
        case 'getItem':
            serverAction.type = 'getItem';
            break;
        case 'useItem':
            serverAction.type = 'useItem';
            serverAction.item = {
                type: this.value
            };
            break;
    }

    return serverAction;
};

Action.prototype.executeOnGamestate = function(gamestate, player) {

    if(!this.type) {
        console.log('Please set an action before');
        return;
    }
    switch(this.type) {
        case 'move':
            executeMove(this.value, gamestate, player);
            break;
    }
};

var executeMove = function(target, gamestate, player) {
    var fromCell = gamestate.getCell(player.position.x, player.position.y);
    var destCell = gamestate.getCellById(target);

    if(player.id !== fromCell.occupantId) {
        console.log('wrong move execution, player is not here');
        return;
    }
    if(destCell.occupantId !== null) {
        console.log('wrong move execution, cell is occuped');
        return;
    }

    var adjacent = _.find(fromCell.adjacents, destCell);
    if(!adjacent) {
        console.log('wrong move execution, cells are not adjacents');
        return;
    }

    fromCell.occupantId = null;
    destCell.occupantId = player.id;
};

Action.transformForServer = function(actions) {
    if(actions instanceof Array) {
        var serverActions = [];
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            serverActions.push(action.getServerAction());
        }
        return serverActions;
    }
    else if(actions instanceof Action) {
        return actions.getServerAction();
    }
    else return null;
};

module.exports = Action;