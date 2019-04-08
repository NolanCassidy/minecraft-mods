var warpLocations = [];

exports.setWarp = function(label){
    warpLocations.push({
        "label": label,
        "x": self.location.x,
        "y": self.location.y,
        "z": self.location.z,
        "pitch": self.location.pitch,
        "yaw": self.location.yaw
    });

    echo("Warp location of ".green() + label.yellow() + " has been set!".green());
};

exports.warp = function(label) {
    var warpData = {};
    for(var j = 0; j<warpLocations.length; j++){
        if(warpLocations[j].label == label){
            warpData = warplocations[j];
        }
    }

    var loc = location
}
