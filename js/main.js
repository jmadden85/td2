(function () {
    var Unit = function () {
    };

    Unit.prototype.getPosition = function () {
        console.log(this);
    };

    var  map = {
        init : function (width, height, sections, canvas) {
            //Set height, width, section size, and canvas element
            this.width = parseInt(width, 10) || 500;
            this.height = parseInt(height, 10) || 500;
            this.sectionSize = parseInt(sections, 10) || 25;
            this.map = canvas;
            //Set prototypal functions for units and towers
            console.log(this.units.prototype);
            //draw the map
            this.buildMap();
            //set up an object to track different sections
            this.buildSections();
            //Create the units
            this.createUnits();
        },
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
            this.drawGrid('#b9b9b9');
            //Scaling for retina
            //todo Make scale only for retina
            this.ctx.scale(2, 2);
        },
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
            console.log(this.mapSections);
        },
        //Generate the units
        createUnits : function (options) {
            //Set options to empty object if not defined
            options === undefined ? options = {} : options;
            //Set options or default
            var num = options.num || 50;
            var flying = options.flying || false;
            var health = options.health || 100;
            var speed = options.speed || 2.5;
            var size = options.size || 5;
            var unitId = 0;
            var num = num || 50;
            //Reset units to 0
            this.units = {};
            while ( unitId < num ) {
                this.units[unitId] = Object.create(Unit.prototype);
                this.units[unitId].x = 0; //Starts at the left side of the map
                this.units[unitId].y = this.height - (Math.random() * this.height); //between 0 and canvas height
                this.units[unitId].speed = speed; //How many pixels it moves per animation
                this.units[unitId].flying = flying; //Flying or not
                this.units[unitId].health = health; //Health of unit
                this.units[unitId].radius = size; //How big the unit is
                this.units[unitId].color = "black"; //Color of the unit
                this.units[unitId].id = unitId; //Unit id
                unitId++;
            }
            console.log(this.units);
        },
        //Property for sections of the map
        mapSections : {

        },
        //Property to keep track of units
        units : {

        },
        //Property for tracking towers
        towers : {

        }
    };

    var mapButton = document.getElementById('buildMap');
    var canvas = document.getElementById('map');

    mapButton.addEventListener("click", function() {
        var mapHeight = document.getElementById('height');
        var mapWidth = document.getElementById('width');
        var mapSections = document.getElementById('section');
        map.init(mapWidth.value, mapHeight.value, mapSections.value, canvas);
    });

})();
