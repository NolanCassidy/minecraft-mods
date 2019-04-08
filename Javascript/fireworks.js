var launchFirework = function(location){
    var firework = location.world.spawnEntity(location, entityType.firework);

    var mainColor = color.red;
    var fadeColor = color.yellow;
    var type = fireworkEffect.type.ball;
    var power = 1;

    var properties = {
        "flicker": false,
        "mainColor": color.olive,
        "fadeColor": color.maroon,
        "fireworkType": fireworkEffect.type.burst,
        "trail": true,
        "power": 2
    };

    fireworkEffect.setFireworkEffect(firework, properties);
};


var onPlayerInteract = function(event) {
    if (event.action == action.rightClickAir) {
        var player = event.player;
        var location = player.location;
        echo(player, "here");
        if (player.itemInHand.type.equals(material.fireworkCharge)) {
            launchFirework(location);
        }
    }
};

events.playerInteract(onPlayerInteract);
