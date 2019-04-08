load("scriptcraft/modules/bukkit/master.js");

var onPlayerInteract = function(event){

    if(event.action == action.rightClickAir) {
        var player = event.player;

        if(player.itemInHand.type.equals(material.skullItem)) {
            //echo(player, "hi");
            var fb = player.launchProjectile(entity.snowball.class);
            fb.shooter = player;
            fb.velocity = player.location.direction.multiply(1.8);

            // echo(player,projectile.location);
            //fb.isIncendiary = true;
            //fb.yield = 5;
        }
    }
};

events.playerInteract(onPlayerInteract);


 var onSnowballHitEntity = function(event) {
     var target = event.entity;
     var damager = event.damager;

     /*if(isSnowball(projectile)&& thrower.itemInHand.type.equals(material.skullItem)) {
        // var slownessEffect = newPotionEffect("SLOWNESS", 30, 5);
         //.addPotionEffect(slownessEffect);
        echo(player,"here");
     }*/

      if(isSnowball(damager)&& isEntity(target)) {
        var thrower = damager.shooter;

        bukkit.broadcastMessage(thrower.name.aqua());

    }

 };

 events.entityDamageByEntity(onSnowballHitEntity);
