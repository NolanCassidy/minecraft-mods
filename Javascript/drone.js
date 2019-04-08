var draw = function() {
    var drawDrone = new Drone(this);
    drawDrone.box(blocks.stone);
    drawDrone.fwd(2);
    drawDrone.box(blocks.stone);
    drawDrone.fwd(2);
    drawDrone.box(blocks.stone);
    drawDrone.back(2);
    drawDrone.right(2);
    drawDrone.box(blocks.stone);
    drawDrone.left(4);
    drawDrone.box(blocks.stone);
    drawDrone.right(2);
    drawDrone.up(2);
    drawDrone.box(blocks.stone);
    drawDrone.down(4);
    drawDrone.box(blocks.stone);
};

exports.draw = draw;

var beacon = function() {
    var beaconDrone = new Drone(this);
    for(var i = 9; i > 0; i-=2){
        beaconDrone.box(blocks.diamond, i, 1, i);
        beaconDrone.up();
        beaconDrone.fwd();
        beaconDrone.right();
    }
};

exports.beacon = beacon;
