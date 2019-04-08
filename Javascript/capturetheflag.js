var world = server.worlds.get(0);
var sb;
var playerHits = {};
var redTeam;
var blueTeam;
var redTeamObj;
var blueTeamObj;
var redTeamScore;
var blueTeamScore;
var curRedFlagLoc;
var curBlueFlagLoc;
var teamCounter;
var jailedPlayers = [];
var timeouts = [];
var gameStarted = false;

var jail = location(world, -154.5, 81, 300);

var redBase = location(world, -217.5, 84, 311, 180, -2.5);
var redFlagLoc = location(world, x, y, z);
var redBaseCorner1 = location(world, x, y, z);
var redBaseCorner2 = location(world, x, y, z);

var blueBase = location(world, -92.5, 84, 289, 0, -2.5);
var blueFlagLoc = location(world, x, y, z);
var blueBaseCorner1 = location(world, x, y, z);
var blueBaseCorner2 = location(world, x, y, z);

var powerUpLocs = [ location(world, x, y, z)   ];

var redFlag = items.banner(1);
var redFlagMeta = redFlag.itemMeta;
redFlagMeta.baseColor = dyeColor.red;
redFlagMeta.displayName = "Red Flag".red();
redFlag.itemMeta = redFlagMeta;

var blueFlag = items.banner(1);
var blueFlagMeta = blueFlag.itemMeta;
blueFlagMeta.baseColor = dyeColor.blue;
blueFlagMeta.displayName = "Blue Flag".blue();
blueFlag.itemMeta = blueFlagMeta;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

exports.startCTF = function() {
    gameStarted = true;
    redTeam = [];
    blueTeam = [];
    redTeamScore = 0;
    blueTeamScore = 0;
    teamCounter = 0;
    playerHits = {};
    sb = scoreboard.newSB(["Snowball Hits", "Flag Captures"], ["hits", "capture"], ["player_list", "sidebar"]);
    redTeamObj = scoreboard.addTeamToSB("red", sb);
    blueTeamObj = scoreboard.addTeamToSB("blue", sb);
    scoreboard.setTeamPrefix(redTeamObj, "RED - ".red());
    scoreboard.setTeamPrefix(blueTeamObj, "BLUE - ".blue());
    var player;
    var onlinePlayers = server.onlinePlayers;
    onlinePlayers = shuffleArray(onlinePlayers.toArray());
    for (player in onlinePlayers) {
        addPlayer(onlinePlayers[player]);
    }
    bukkit.broadcastMessage("Game Started!".green());
    bukkit.broadcastMessage("Red Team: ".red() + redTeam);
    bukkit.broadcastMessage("Blue Team: ".blue() + blueTeam);
    placeFlagAt(dyeColor.red, redFlagLoc, blockFace.south);
    curRedFlagLoc = redFlagLoc;
    placeFlagAt(dyeColor.blue, blueFlagLoc, blockFace.north);
    curBlueFlagLoc = blueFlagLoc;
    bukkit.consoleCommand('title @a title {"text":"Game Started","color":"green"}');
    for (var loc in powerUpLocs) {
        spawnPowerUp(powerUpLocs[loc]);
    }
};

var addPlayer = function(player) {
    if (teamCounter % 2 == 0) {
        redTeam.push(player.name);
        scoreboard.addPlayerToTeam(player, redTeamObj);
        teleport(player, redBase);
        setTimeout(function() {giveArmorSet(player, color.red);}, 100);
    } else {
        blueTeam.push(player.name);
        scoreboard.addPlayerToTeam(player, blueTeamObj);
        teleport(player, blueBase);
        setTimeout(function() {giveArmorSet(player, color.blue);}, 100);
    }
    player.gameMode = gameMode.survival;
    player.foodLevel = 20;
    player.inventory.clear();
    inventory(player).add(items.snowBall(1));
    player.updateInventory();
    player.inventory.heldItemSlot = 0;
    teamCounter++;
    playerHits[player] = 0;
    scoreboard.setSB(player, sb);
    scoreboard.setPlayerScore(player, sb, "player_list", playerHits[player]);
    scoreboard.setPlayerScore("Red Team".red(), sb, "sidebar", redTeamScore);
    scoreboard.setPlayerScore("Blue Team".blue(), sb, "sidebar", blueTeamScore);
};

exports.stopCTF = function() {
    gameStarted = false;
    scoreboard.clearSB(sb);
    redTeamObj.unregister();
    blueTeamObj.unregister();
    world.getBlockAt(curRedFlagLoc).type = material.air;
    world.getBlockAt(curBlueFlagLoc).type = material.air;
    var onlinePlayers = server.onlinePlayers;
    for (var player in onlinePlayers ) {
        onlinePlayers[player].inventory.clear();
    }
    var worldEntities = world.entities;
    for (var ent in worldEntities) {
        if (isDroppedItem(worldEntities[ent])) {
            worldEntities[ent].remove();
        }
    }
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    bukkit.broadcastMessage("Game Stopped!".darkred());
    bukkit.consoleCommand('title @a title {"text":"Game Stopped","color":"dark_red"}');
};

var onSnowballThrow = function(event) {
    if (gameStarted && isSnowball(event.entity)) {
        var player = event.entity.shooter;
        setTimeout(function() {inventory(player).add(items.snowBall(1));}, 500);
    }
};
events.projectileLaunch(onSnowballThrow);

var onEntityDamageByEntity = function(event) {
    if (!gameStarted) {
        return;
    }
    var target = event.entity;
    var damager = event.damager;
    var targetLoc = target.location;
    var targetItemName;
    if (target.inventory.itemInHand.itemMeta != null) {
        targetItemName = target.inventory.itemInHand.itemMeta.displayName;
    }
    var targetBase;
    if (isSnowball(damager) && isPlayer(target)) {
        var thrower = damager.shooter;
        if ((redTeam.indexOf(thrower.name) != -1 && redTeam.indexOf(target.name) != -1) ||
            (blueTeam.indexOf(thrower.name) != -1 && blueTeam.indexOf(target.name) != -1)) {
            event.cancelled = true;
            return;
        }
        if (jailedPlayers.indexOf(target) !=  -1) {
            event.cancelled = true;
            return;
        }
        playerHits[thrower]++;
        scoreboard.setPlayerScore(thrower, sb, "player_list", playerHits[thrower]);
        if (redTeam.indexOf(thrower.name) != -1) {
            bukkit.broadcastMessage(thrower.name.red() + " hit ".white() + target.name.blue());
            targetBase = blueBase;
            if (targetItemName == "Red Flag".red()) {
                inventory(target).remove(redFlag);
                placeFlagAt(dyeColor.red, targetLoc, blockFace.east);
                curRedFlagLoc = targetLoc;
                target.inventory.heldItemSlot = 0;
                bukkit.broadcastMessage(target.name.blue() + " has dropped the ".white() + "red".red() + " team's flag!".white());
            }
        } else {
            bukkit.broadcastMessage(thrower.name.blue() + " hit ".white() + target.name.red());
            targetBase = redBase;
            if (targetItemName == "Blue Flag".blue()) {
                inventory(target).remove(blueFlag);
                placeFlagAt(dyeColor.blue, targetLoc, blockFace.west);
                curBlueFlagLoc = targetLoc;
                target.inventory.heldItemSlot = 0;
                bukkit.broadcastMessage(target.name.red() + " has dropped the ".white() + "blue".blue() + " team's flag!".white());
            }
        }
        jailedPlayers.push(target);
        teleport(target, jail);
        echo(target, "You've been hit!".yellow() +  " Returning to base in 10 seconds....".white());
        if (target.equipment.helmet != null) {
            setTimeout(function() {repairArmor(target);}, 100);
        }
        setTimeout(function() {echo(target, "9.....");}, 1000);
        setTimeout(function() {echo(target, "8.....");}, 2000);
        setTimeout(function() {echo(target, "7.....");}, 3000);
        setTimeout(function() {echo(target, "6.....");}, 4000);
        setTimeout(function() {echo(target, "5.....");}, 5000);
        setTimeout(function() {echo(target, "4.....");}, 6000);
        setTimeout(function() {echo(target, "3.....");}, 7000);
        setTimeout(function() {echo(target, "2.....");}, 8000);
        setTimeout(function() {echo(target, "1.....");}, 9000);
        setTimeout(function() {teleport(target, targetBase);}, 10000);
        setTimeout(function() {echo(target, "Returned to base!".green());}, 10100);
        setTimeout(function() {jailedPlayers.splice(jailedPlayers.indexOf(target), 1);}, 13000);
    } else {
        event.cancelled = true;
        return;
    }
};
events.entityDamageByEntity(onEntityDamageByEntity);

var onPlayerJoin = function(event) {
    if (!gameStarted) {
        return;
    }
    var player = event.player;
    if (!playerHits.hasOwnProperty(player)) {
        if (teamCounter % 2 === 0) {
            setTimeout(function() {bukkit.broadcastMessage("Adding " + player.name.yellow() + " to the ".white() + "RED".red() + " team!".white());}, 100);
        } else {
            setTimeout(function() {bukkit.broadcastMessage("Adding " + player.name.yellow() + " to the ".white() + "BLUE".blue() + " team!".white());}, 100);
        }
        addPlayer(player);
    } else {
        scoreboard.setSB(player, sb);
        scoreboard.setPlayerScore(player, sb, "player_list", playerHits[player]);
        scoreboard.setPlayerScore("Red Team".red(), sb, "sidebar", redTeamScore);
        scoreboard.setPlayerScore("Blue Team".blue(), sb, "sidebar", blueTeamScore);
    }
};
events.playerJoin(onPlayerJoin);

var placeFlagAt = function(color, location, direction) {
    var flagBlock = world.getBlockAt(location);
    flagBlock.type = material.standingBanner;
    var bannerState = flagBlock.state;
    bannerState.baseColor = color;
    var bannerData = bannerState.data;
    bannerData.facingDirection = direction;
    bannerState.update();
};

var onPlayerInteract = function(event) {
    if (!gameStarted) {
        return;
    }
    if (event.action == action.rightClickAir || event.action == action.leftClickAir) {
        return;
    }
    var clickedBlock = event.clickedBlock;
    var clickedBlockType = clickedBlock.type;
    if (clickedBlockType == material.standingBanner) {
        var flag = clickedBlock;
        var player = event.player;
        var flagColor = flag.state.baseColor;
        if (!inventory(player).contains(items.snowBall(1))) {
            event.cancelled = true;
            return;
        }
        if (flagColor == dyeColor.red) {
            if (blueTeam.indexOf(player.name) != -1) {
                flag.type = material.air;
                inventory(player).add(redFlag);
                player.updateInventory();
                player.inventory.heldItemSlot = 1;
                bukkit.broadcastMessage(player.name.blue() + " has taken the ".white() + "red".red() + " team's flag!".white());
            } else {
                if (!flag.location.equals(redFlagLoc)) {
                    flag.type = material.air;
                    placeFlagAt(dyeColor.red, redFlagLoc, blockFace.south);
                    curRedFlagLoc = redFlagLoc;
                    bukkit.broadcastMessage(player.name.red() + " has returned the ".white() + "red".red() + " team's flag!".white());
                }
            }
        } else if (flagColor == dyeColor.blue) {
            if (redTeam.indexOf(player.name) != -1) {
                flag.type = material.air;
                inventory(player).add(blueFlag);
                player.updateInventory();
                player.inventory.heldItemSlot = 1;
                bukkit.broadcastMessage(player.name.red() + " has taken the ".white() + "blue".blue() + " team's flag!".white());
            } else {
                if (!flag.location.equals(blueFlagLoc)) {
                    flag.type = material.air;
                    placeFlagAt(dyeColor.blue, blueFlagLoc, blockFace.north);
                    curBlueFlagLoc = blueFlagLoc;
                    bukkit.broadcastMessage(player.name.blue() + " has returned the ".white() + "blue".blue() + " team's flag!".white());
                }
            }
        }
    } else {
        event.cancelled = true;
        event.player.updateInventory();
        return;
    }
};
events.playerInteract(onPlayerInteract);

var isInRect = function(player, corner1, corner2) {
    var playerLoc = player.location;
    var xValues = [corner1.x, corner2.x];
    xValues.sort(function(a, b) {return a-b});
    if (playerLoc.x > xValues[1] || playerLoc.x < xValues[0]) {
        return false;
    }
    var zValues = [corner1.z, corner2.z];
    zValues.sort(function(a, b) {return a-b});
    if (playerLoc.z > zValues[1] || playerLoc.z < zValues[0]) {
        return false;
    }
    return true;
};

var onPlayerMove = function(event) {
    if (!gameStarted) {
        return;
    }
    var player = event.player;
    var playerItemName;
    if (player.inventory.itemInHand.itemMeta !== null) {
        playerItemName = player.inventory.itemInHand.itemMeta.displayName;
    }
    if (playerItemName == "Red Flag".red()) {
        if (isInRect(player, blueBaseCorner1, blueBaseCorner2)) {
            inventory(player).remove(redFlag);
            player.inventory.heldItemSlot = 0;
            placeFlagAt(dyeColor.red, redFlagLoc, blockFace.south);
            curRedFlagLoc = redFlagLoc;
            blueTeamScore++;
            scoreboard.setPlayerScore("Blue Team".blue(), sb, "sidebar", blueTeamScore);
            bukkit.broadcastMessage(player.name.blue() + " has captured the ".white() + "red".red() + " team's flag!".white());
            if (blueTeamScore >= 3) {
                bukkit.consoleCommand('title @a title {"text":"Blue Team Wins!","color":"blue"}');
                setTimeout(stopCTF, 3000);
            }
        }
    }
    if (playerItemName == "Blue Flag".blue()) {
        if (isInRect(player, redBaseCorner1, redBaseCorner2)) {
            inventory(player).remove(blueFlag);
            player.inventory.heldItemSlot = 0;
            placeFlagAt(dyeColor.blue, blueFlagLoc, blockFace.north);
            curBlueFlagLoc = blueFlagLoc;
            redTeamScore++;
            scoreboard.setPlayerScore("Red Team".red(), sb, "sidebar", redTeamScore);
            bukkit.broadcastMessage(player.name.red() + " has captured the ".white() + "blue".blue() + " team's flag!".white());
            if (redTeamScore >= 3) {
                bukkit.consoleCommand('title @a title {"text":"Red Team Wins!","color":"red"}');
                setTimeout(stopCTF, 3000);
            }
        }
    }
};
events.playerMove(onPlayerMove);

var giveArmorSet = function(player, color) {
    var helmet = items.leatherHelmet(1);
    var helmetMeta = helmet.itemMeta;
    helmetMeta.color = color;
    helmet.itemMeta = helmetMeta;
    player.equipment.helmet = helmet;
    var boots = items.leatherBoots(1);
    var bootsMeta = boots.itemMeta;
    bootsMeta.color = color;
    boots.itemMeta = bootsMeta;
    player.equipment.boots = boots;
    var chest = items.leatherChestplate(1);
    var chestMeta = chest.itemMeta;
    chestMeta.color = color;
    chest.itemMeta = chestMeta;
    player.equipment.chestplate = chest;
    var legs = items.leatherLeggings(1);
    var legsMeta = legs.itemMeta;
    legsMeta.color = color;
    legs.itemMeta = legsMeta;
    player.equipment.leggings = legs;
};

var repairArmor = function(player) {
    player.equipment.helmet.durability = 0;
    player.equipment.chestplate.durability = 0;
    player.equipment.leggings.durability = 0;
    player.equipment.boots.durability = 0;
};

var onBlockBreak = function(event) {
    if (gameStarted) {
        event.cancelled = true;
        event.player.updateInventory();
    }
};
events.blockBreak(onBlockBreak);

var onBlockPlace = function(event) {
    if (gameStarted) {
        event.cancelled = true;
        event.player.updateInventory();
    }
};
events.blockPlace(onBlockPlace);

var onItemSwitch = function(event) {
    if (gameStarted) {
        event.cancelled = true;
        event.player.updateInventory();
    }
};
events.playerItemHeld(onItemSwitch);

var onInventoryClick = function(event) {
    if (gameStarted) {
        event.cancelled = true;
    }
};
events.inventoryClick(onInventoryClick);

var onDropItem = function(event) {
    if (gameStarted) {
        event.cancelled = true;
        setTimeout(function() {event.player.updateInventory();}, 100);
    }
};
events.playerDropItem(onDropItem);

var onFoodLevelChange = function(event) {
    if (gameStarted) {
        event.cancelled = true;
    }
};
events.foodLevelChange(onFoodLevelChange);

var onEntityDamage = function(event) {
    if (gameStarted) {
        event.cancelled = true;
    }
};
events.entityDamage(onEntityDamage);

var spawnPowerUp = function(location) {
    var pickup = items.emerald(1);
    var powerUp = world.dropItem(location, pickup);
    setTimeout(function() {powerUp.teleport(location);}, 1500);
};

var onItemPickup = function(event) {
    if (gameStarted) {
        timeouts.push(setTimeout(function() {spawnPowerUp(event.item.location);}, 45000)); //respawn powerup after 45sec
        var player = event.player;
        setTimeout(function() {inventory(player).remove(items.emerald(1)); player.updateInventory();}, 100);
        var newEffect;
        var rand = Math.floor((Math.random() * 6) + 1);
        if (rand == 1) {
            newEffect = newPotionEffect("SPEED", 30, 4);
            echo(player, "You got a speed boost!".yellow());
        } else if (rand == 2) {
            newEffect = newPotionEffect("JUMP", 30, 4);
            echo(player, "You got a jump boost!".yellow());
        } else if (rand == 3) {
            newEffect = newPotionEffect("INVISIBILITY", 30, 4);
            echo(player, "You are invisible!".yellow());
            removeArmor(player);
            if (redTeam.indexOf(player.name) != -1) {
                timeouts.push(setTimeout(function() {giveArmorSet(player, color.red);}, 30000));
            } else {
                timeouts.push(setTimeout(function() {giveArmorSet(player, color.blue);}, 30000));
            }
        } else if (rand == 4) {
            newEffect = newPotionEffect("CONFUSION", 30, 4);
            echo(player, "You are confused!".yellow());
        } else if (rand == 5) {
            newEffect = newPotionEffect("SLOW", 20, 4);
            echo(player, "You are slower!".yellow());
        } else {
            newEffect = newPotionEffect("BLINDNESS", 10, 4);
            echo(player, "You are blind!".yellow());
        }
        event.player.addPotionEffect(newEffect);
    }
};
events.playerPickupItem(onItemPickup);

var removeArmor = function(player) {
    player.equipment.helmet = null;
    player.equipment.chestplate = null;
    player.equipment.leggings = null;
    player.equipment.boots = null;
};
