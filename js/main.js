(function () {
    "use strict";

    //Unit class
    var Unit = function () {};

    Unit.prototype.walk = function () {
        if (this.x > Map.width) {
            this.x = 0;
        }
        this.x += this.speed;
    };

    Unit.prototype.getPosition = function () {
        var x = this.x;
        var y = this.y;
        return [x, y];
    };

    //Pathing object
    var Pathfinder = function () {

    };

    Pathfinder.prototype = Unit.prototype;

    Pathfinder.prototype.breadCrumbs = function () {

    };

    //Tower class
    var Tower = function () {};

    var Map = {
        init : function (width, height, sections, canvas) {

            //Set height, width, section size, and canvas element
            this.width = parseInt(width, 10) || 800;
            this.height = parseInt(height, 10) || 500;
            this.sectionSize = parseInt(sections, 10) || 25;
            this.map = canvas;

            //draw the map
            this.buildMap();

            //set up an object to track different sections
            this.buildSections();

            //Create the units
            this.createUnits();

            //Find a path
            this.createPath();

            //Safe a reference to this
            var self = this;

            //animate every x ms
            setInterval(
                function () {
                    if (!self.pause) {
                        self.animate();
                    }
                }, 20
            );
        },
        //Boolean for whether or not pathfinder has completed
        pathFound : false,
        //Path array {
        optimalPath : [],
        //Animate Method
        animate : function (options, run) {
            var pause = run || false;

            //clear map so you don't get dragging lines
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(0, 0, this.width, this.height);
            if (!pause) {
                this.animation(options);
            } else {
                return false;
            }
        },
        //Debugging property
        debugging : false,
        //Debugging toggle
        debugToggle : function () {
            this.debugging ? this.debugging = false : this.debugging = true;
            return this.debugging;
        },
        //Pause property
        pause : false,
        //Pause toggle
        pauseToggle : function () {
            this.pause ? this.pause = false : this.pause = true;
            return this.pause;
        },
        //Map properties
        width : 0,
        height : 0,
        sectionSize : 0,
        buildMap : function () {

            //Set the canvas height and width
            this.map.width = this.width;
            this.map.height = this.height;

            //Set the css for height and width
            this.map.style.width = this.width + 'px';
            this.map.style.height = this.height + 'px';

            //Add class name for border to kick in
            this.map.className = 'built';

            //Set context for the canvas
            this.ctx = this.map.getContext('2d');

            //draw a grid
            //Scaling for retina
            //todo Make scale only for retina
        },
        //All animations are called here
        animation : function (options) {
            options === undefined ? options = {} : options;
            var width = options.width;
            var height = options.height;
            var sectionSize = options.sectionSize;
            var debugging = this.debugging;

            if (debugging) {
                this.drawGrid('#b9b9b9');
            }

            this.drawTowers(debugging);
            //Make sure the path is known
            if (this.pathFound) {
                this.drawUnits(debugging);
                this.moveUnits();
            }
        },
        //Debugging grid visibility
        drawGrid : function (color) {
            var startX = 0;
            var startY = 0;

            //drawing vertical lines
            while ( startX < this.width ) {
                this.ctx.moveTo(startX, 0);
                this.ctx.lineTo(startX, this.height);
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
                this.ctx.closePath();
                startX += this.sectionSize;
            }

            //drawing horizontal lines
            while ( startY < this.height ) {
                this.ctx.moveTo(0, startY);
                this.ctx.lineTo(this.width, startY);
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
                this.ctx.closePath();
                startY += this.sectionSize;
            }
        },
        //Generate sections into sections object based on sections size property
        buildSections : function () {
            //get number of columns
            var x = this.width / this.sectionSize;

            //get total number of sections
            var totalSections = (this.width / this.sectionSize) * (this.height / this.sectionSize);

            //Loop through and build objects for each section
            //Rows are setup as 1.4 is row one, fourth column
            for ( var i = 0, row = 1, col = 0; i < totalSections; i++ ) {
                //Increment columns
                col++;

                //If the iteration mod x(number of columns) equals 0 and it's not the first iteration
                //Increment the row by 1, and set columns to 1
                if ( !(i % x) && i !== 0 ) {
                    row++;
                    col = 1;
                }

                //Create a new object for this section
                this.mapSections[row + '.' + col] = {
                    occupied : false
                }
            }
        },
        //Generate the units
        createUnits : function (options) {
            //Set options to empty object if not defined
            options === undefined ? options = {} : options;

            //Set options or default
            var num = options.num || 10;
            var flying = options.flying || false;
            var health = options.health || 100;
            var speed = options.speed || 2.5;
            var size = options.size || 5;
            var unitId = 0;
            var num = num || 50;

            //Reset units to 0
            this.units = {};
            while (unitId < num) {
                this.units[unitId] = Object.create(Unit.prototype);
                this.units[unitId].x = 0; //Starts at the left side of the map
                this.units[unitId].y = (this.height / 2 + 10) - (Math.random() * 20); //middle of canvas plus or minus 2.5px
                this.units[unitId].speed = speed; //How many pixels it moves per animation
                this.units[unitId].flying = flying; //Flying or not
                this.units[unitId].health = health; //Health of unit
                this.units[unitId].radius = size; //How big the unit is
                this.units[unitId].color = "black"; //Color of the unit
                this.units[unitId].id = unitId; //Unit id
                unitId++;
            }
        },
        //Draw units with debugging options
        drawUnits : function (debugging) {
          for (var i in this.units) {
              var unit = this.units[i];
              this.ctx.beginPath();
              this.ctx.arc(unit.x, unit.y, unit.radius, 0, Math.PI * 2);
              //Show unit info if debugging
              if (debugging) {
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "bottom";
                this.ctx.fillText(unit.id + ' (' + Math.round(unit.x) + ', ' + Math.round(unit.y) + ')', unit.x, unit.y + 18);
              }
              this.ctx.closePath();
              this.ctx.fillStyle = unit.color;
              this.ctx.fill();
          }
        },
        //Walk the units
        moveUnits : function () {
            for (var i in this.units) {
                var unit = this.units[i];
                unit.walk();
            }
        },
        createPath : function (options) {
            options === undefined ? options = {} : options;
            var that = this;
            var speed = options.speed || that.sectionSize - 5;
            var attempts = {};
            var paths = {};
            var pathMan = Object.create(Pathfinder.prototype);
            pathMan.x = 0;
            pathMan.y = this.height / 2;
            pathMan.speed = speed;
            pathMan.size = 5;

            var drawPath = function () {
                that.ctx.beginPath();
                that.ctx.arc(pathMan.x, pathMan.y, pathMan.size, 0, Math.PI * 2)
                that.ctx.closePath();
                that.ctx.fillStyle = '#000';
                that.ctx.fill();
                if (pathMan.x > that.width) {
                    return 'completed';
                }
            };

            var walking = setInterval(function () {
                var currentPosition = pathMan.getPosition();
                var currentPosObj = that.mapSections[Math.ceil(currentPosition[1] / that.sectionSize) + '.' + Math.ceil(currentPosition[0] / that.sectionSize)];
                if (drawPath() !== 'completed') {
                    pathMan.walk();
                    that.optimalPath.push(currentPosObj);
                } else {
                    that.pathFound = true;
                    console.log(that.optimalPath);
                    clearInterval(walking);
                }
            }, 20);
        },
        //Tower creating method with options
        createTower : function (options) {
            options === undefined ? options = {} : options;
            var damage = options.damage || 10;
            var range = options.range || 200;
            var air = options.air || false;
            var splash = options.splash || false;
            var speed = options.speed || 10;
            var element = options.element || 'none';
            var towerId = this.towers.id + 1;
            var coords = options.coords || [0, 0];
            this.towers[towerId] = Object.create(Tower.prototype);
            this.towers[towerId].x = coords[0] - this.sectionSize;
            this.towers[towerId].y = coords[1] - this.sectionSize;
            this.towers[towerId].damage = damage;
            this.towers[towerId].range = range;
            this.towers[towerId].air = air;
            this.towers[towerId].splash = splash;
            this.towers[towerId].speed = speed;
            this.towers[towerId].element = element;
            this.towers.id++;
            this.pathFound = false;
            this.createPath();
        },
        //Draw towers method
        drawTowers : function (debugging) {
            for (var i in this.towers) {
                this.ctx.rect(this.towers[i].x, this.towers[i].y, this.sectionSize, this.sectionSize);
                this.ctx.stroke();
            }
        },
        //Map Object
        mapSections : {

        },
        //Units Object
        units : {

        },
        //Towers Object
        towers : {
            id: 0
        }
    };

    var mapButton = document.getElementById('buildMap');
    var canvas = document.getElementById('map');
    var debugButton = document.getElementById('debugger');
    var pauseButton = document.getElementById('pause');

    canvas.addEventListener("click", function (event) {
        //Get coordinates of clicked area
        var coords = {
            x : event.offsetX,
            y : event.offsetY
        };
        //Map clicked area to correct section in the mapSections object
        var sectionSize = Map.sectionSize;
        var sectionX = Math.ceil(coords.x / sectionSize);
        var sectionY = Math.ceil(coords.y / sectionSize);
        var thisSection = Map.mapSections[sectionY + '.' + sectionX];
        var occupied = thisSection.occupied;
        //Check if the area is occupied
        if (!occupied) {
            //Create tower with coords and change occupied to true
            Map.createTower({
                coords: [sectionX * sectionSize, sectionY * sectionSize]
            });
            thisSection.occupied = true;
        } else {
            console.log('blocked');
        }
    });

    debugButton.addEventListener("click", function () {
        if (Map.debugToggle()) {
            this.innerHTML = 'Debug Off';
        } else {
            this.innerHTML = 'Debug On';
        }
    });

    pauseButton.addEventListener("click", function () {
        if (Map.pauseToggle()) {
            this.innerHTML = 'Unpause';
        } else {
            this.innerHTML = 'Pause';
        }
    });

    mapButton.addEventListener("click", function() {
        var mapHeight = document.getElementById('height');
        var mapWidth = document.getElementById('width');
        var mapSections = document.getElementById('section');
        Map.init(mapWidth.value, mapHeight.value, mapSections.value, canvas);
    });

})();
