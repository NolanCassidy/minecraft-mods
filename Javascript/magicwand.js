load("scriptcraft/modules/bukkit/master.js");

var world = server.worlds.get(0);

var animalList = [  entityType.bat, entityType.caveSpider, entityType.chicken,
                    entityType.cow, entityType.donkey, entityType.horse,
                    entityType.llama, entityType.pig, entityType.polarBear,
                    entityType.rabbit, entityType.sheep, entityType.shulker,
                    entityType.skeleton, entityType.snowman, entityType.spider,
                    entityType.wolf];

var magicWand = items.stick(1);

var magicWandMeta = magicWand.itemMeta;
magicWandMeta.displayName = "Magic Wand".aqua();
magicWandMeta.lore = ["Current spell: ".blue() + "None".yellow(), "Abracadbra Alakazam!".magic()];
magicWand.itemMeta = magicWandMeta;

var obsidian = items.obsidian(1);
var diamond = items.diamond(1);
var stick = items.stick(1);

recipes.add(
{
    result:magicWand,
    ingredients: {O: obsidian, D: diamond, S: stick},
    shape:["   ","ODS","   "]
});


var magicWand_vanishing = items.stick(1);

var magicWand_vanishingMeta = magicWand_vanishing.itemMeta;
magicWand_vanishingMeta.displayName = "Magic Wand".aqua();
magicWand_vanishingMeta.lore = ["Current spell: ".blue() + "Vanishing".yellow(), "Abracadbra Alakazam!".magic()];
magicWand_vanishingMeta.addEnchant(enchantment.durability, 1, true);
magicWand_vanishingMeta.addItemFlags(itemFlag.hideEnchants);
magicWand_vanishing.itemMeta = magicWand_vanishingMeta;

var goldenCarrot = items.goldenCarrot(1);
var fse = items.fermentedSpiderEye(1);

recipes.add(
{
    result:magicWand_vanishing,
    ingredients: {F: fse, G: goldenCarrot, M: magicWand},
    shape:[" F "," G "," M "]
});


var magicWand_chicken = items.stick(1);

var magicWand_chickenMeta = magicWand_chicken.itemMeta;
magicWand_chickenMeta.displayName = "Magic Wand".aqua();
magicWand_chickenMeta.lore = ["Current spell: ".blue() + "Transverto".yellow(), "Abracadbra Alakazam!".magic()];
magicWand_chickenMeta.addEnchant(enchantment.durability, 1, true);
magicWand_chickenMeta.addItemFlags(itemFlag.hideEnchants);
magicWand_chicken.itemMeta = magicWand_chickenMeta;

var rawChicken = items.rawChicken(1);
var feather = items.feather(1);

recipes.add(
{
    result:magicWand_chicken,
    ingredients: {F: feather, R: rawChicken, M: magicWand},
    shape:[" F "," R "," M "]
});

var onEntityDamageByEntity = function(event){
    if(!isPlayer(event.damager)) {
        return;
    }
    event.damage = 0;
    var player = event.damager;
    var playerInv = player.inventory;
    var playerItem = playerInv.itemInHand;
    var damagedEntity = event.entity;
    var damagedEntityLoc = damagedEntity.location;

    var vanishParticle = particle.spell;

    // if(playerItem.equals(magicWand_vanishing)){
    //     damagedEntity.remove();
    //     echo(player, "The ".green() + damagedEntity.type.toString().yellow() + " has transformed!".green());
    //     world.spawnParticle(vanishParticle, damagedEntityLoc, 10);
    //     event.cancelled = true;
    //     return;
    // }

    if(playerItem.equals(magicWand_chicken)){
        var animalIndex = Math.floor(Math.random() * animalList.length);
        damagedEntity.remove();
        damagedEntityLoc.world.spawnEntity(damagedEntityLoc, animalList[animalIndex]);
        echo(player, "The ".green() + damagedEntity.type.toString().yellow() + " has transformed into a ".green() + animalList[animalIndex].toString().yellow());
        world.spawnParticle(vanishParticle, damagedEntityLoc, 10);
        event.cancelled = true;
        return;
    }

};

events.entityDamageByEntity(onEntityDamageByEntity);

var onPlayerInteract = function(event){
    var player = event.entity;
    var playerItem = player.itemInHand;
    var target;
    if(playerItem.equals(magicWand_vanishing)){
        echo(player, "it works");
       if(event.action ==action.leftClickBlock) {
           target = event.clickedBlock;
       }
       if (event.action == action.leftClickAir) {
           target = player.getTargetBlock(null, 100)
       }
       echo(player, target.type);
    }

};

events.playerInteract(onPlayerInteract);
