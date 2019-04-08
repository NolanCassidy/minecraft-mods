var trailEffect = effect.smoke;
var trailOn = false;

exports.trail = function(type) {
    if(type == "off") {
        trailOn = false;
        echo("Particle Trail: ".white() + "OFF".black());
    } else if(type == "smoke") {
        trailEffect = effect.smoke();
        trailOn = true;
        echo("Particle Trail: ".white() + "SMOKE".darkgray());
    } else if(type == "flames") {
        trailEffect = effect.mobspawnerFlames;
        trailOn = true;
        echo("Particle Trail: ".white() + "FLAMES".red());
    } else if(type == "ender") {
        trailEffect = effect.enderSignal();
        trailOn = true;
        echo("Particle Trail: ".white() + "ENDER".green());
    } else if(type == "potion") {
        trailEffect = effect.potionBreak;
        trailOn = true;
        echo("Particle Trail: ".white() + "POTION".orange());
    }
};

var onPlayerMove = function(event){
    var player = event.player;
    if(trailOn){
        player.playEffect(player.location, trailEffect, 5);
    }
};

events.playerMove(onPlayerMove);
