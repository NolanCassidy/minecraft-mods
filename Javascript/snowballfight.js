load("scriptcraft/modules/bukkit/master.js");

var sb;
var playerHits = {};
var gameStarted = false;

var scoreboardSetup = function(){
    sb = scoreboard.newSB(["Snowball Hits".aqua()], ["hits"],["sidebar"]);
    var onlinePLayers = server.onlinePlayers;
    for(var curPlayer in onlinePLayers){
        var player = onlinePLayers[curPlayer];
        player.gameMode = gameMode.survival;
        player.foodLevel = 20;
        player.inventory.clear();
        inventory(player).add(items.snowBall(1));
        player.updateInventory();
        playerHits[player] = 0;
        scoreboard.setSB(player, sb);
        scoreboard.setPlayerScore(player, sb, "sidebar", playerHits[player]);
    }
};

exports.startGame = function(){
    gameStarted = true;
    playerHits = {};
    scoreboardSetup();
    bukkit.broadcastMessage("Game Started!".green());
    bukkit.consoleCommand("title @title {text:'Game Started', color:'green'}");
};

exports.stopGame = function(){
    gameStarted = false;
    scoreboard.clearSB(sb);
    bukkit.broadcastMessage("Game Stopped!".darkred());
    bukkit.consoleCommand("title @a title {text:'Game Stopped', color:'dark_red'}");
};

var onSnowballHitPlayer = function(event) {
    if(!gameStarted){
        return;
    }
    var target = event.entity;
    var damager = event.damager;
    if(isSnowball(damager)&& isPlayer(target)) {
        var thrower = damager.shooter;
        playerHits[thrower]++;
        scoreboard.setPLayerScore(thrower, sb, "sidebar", playerHits[thrower]);
        bukkit.broadcastMessage(thrower.name.aqua() + " hit ".white() + target.name.red());
        if(playerHits[thrower] >= 50){
            bukkit.broadcastMessage(thrower.name.green() + "Wins!!!");
            stopGame();
        }
    }
};

events.entityDamageByEntity(onSnowballHitPlayer);

var onSnowballThrow = function(event){
    if(!gameStarted){
        return;
    }
    if(isSnowball(event.entity)){
        var player = event.entity.shooter;
        inventory(player).add(items.snowBall(1));
        player.updateInventory();
    }
};

events.projectileLaunch(onSnowballThrow);

var onDropItem = function(event) {
    if(gameStarted){
        event.cancelled = true;
        event.player.updateInventory();
    }
};

events.playerDropItem(onDropItem);

var onFoodLevelChange = function(event) {
    if(gameStarted) {
        event.cancelled = true;
    }
};

events.foodLevelChange(onFoodLevelChange);
