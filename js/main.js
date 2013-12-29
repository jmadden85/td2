(function () {

    var  map = {
        init : function (width, height, sections, canvas) {
            //Set height, width, section size, and canvas element
            this.width = parseInt(width, 10) || 500;
            this.height = parseInt(height, 10) || 500;
            this.sectionSize = parseInt(sections, 10) || 25;
            this.map = canvas;
            //draw the map
            this.buildMap();
            //set up an object to track different sections
            this.buildGridObjects();
        },
        width : 0,
        height : 0,
        sectionSize : 0,
        buildMap : function () {
            //Set the canvas height and width
            this.map.width = this.width;
            this.map.height = this.height;
            this.map.className = 'built';
            this.ctx = this.map.getContext('2d');
            //draw a grid
            this.drawGrid('#b9b9b9');
            this.ctx.scale(2, 2);
        },
        drawGrid : function (color) {
            var startX = 0;
            var startY = 0;
            while (startX < this.width) {
                this.ctx.moveTo(startX, 0);
                this.ctx.lineTo(startX, this.height);
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
                this.ctx.closePath();
                startX += this.sectionSize;
            }

            while (startY < this.height) {
                this.ctx.moveTo(0, startY);
                this.ctx.lineTo(this.width, startY);
                this.ctx.strokeStyle = color;
                this.ctx.stroke();
                this.ctx.lineWidth = 1;
                this.ctx.closePath();
                startY += this.sectionSize;
            }
        },
        buildGridObjects : function () {
            //get number of columns
            var x = this.width / this.sectionSize;
            //get total number of sections
            var totalSections = (this.width / this.sectionSize) * (this.height / this.sectionSize);
            //Loop through and build objects for each section
            for ( var i = 0, row = 1, col = 0; i < totalSections; i++ ) {
                col++;
                if ( !(i % x) && i !== 0 ) {
                    row++;
                    col = 1;
                }
                this[row + '.' + col] = {
                    occupied : false
                }
            }
        }
    };

    var mapButton = document.getElementById('buildMap');
    var canvas = document.getElementById('map');

    mapButton.addEventListener("click", function() {
        var mapHeight = document.getElementById('height');
        var mapWidth = document.getElementById('width');
        var mapSections = document.getElementById('section');
        console.log(mapWidth.value, mapHeight.value, mapSections.value, canvas);
        map.init(mapWidth.value, mapHeight.value, mapSections.value, canvas);
    });

})();
