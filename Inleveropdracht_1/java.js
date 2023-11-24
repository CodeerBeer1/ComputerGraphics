const Color = 
{
    RED: "rgb( 255, 0, 0 )",
    GREEN: "rgb( 0, 255, 0 )",
    BLUE: "rgb( 0, 0, 255 )",
    WHITE: "rgb( 255, 255, 255 )",
    BLACK: "rgb( 0, 0, 0 )"
}

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector)
    {        
        return new Vec2(this.x + vector.x, this.y + vector.y);
    }

    sub(vector)
    {
        return new Vec2(this.x - vector.x, this.y - vector.y);
    }

    scale(value)
    {
        this.x *= value;
        this.y *= value;
    }
}

class Screen 
{
    constructor(canvas, width, height) {
        this.canvas = document.getElementById(canvas);
        this.width = width;
        this.height = height;
        this.setupCanvas();
    }

    setupCanvas()
    {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas = this.canvas.getContext('2d');

        this.blanco()
    }
    drawCanvas()
    {
        console.log('getekent')

        for(var y = 0; y < this.height; y++)
        {
            for(var x = 0; x < this.width; x++)
            {
                this.canvas.fillStyle = this.pixels[y][x];

                if(this.pixels[y][x] != Color.WHITE)
                {
                    this.canvas.fillRect(x, y, 4, 4);
                }
                this.canvas.fillStyle = Color.WHITE;
            }
        }
    }

    putPixel(x, y, color)
    { 
        if(x > 0 && x < screen.width && y > 0 && y < screen.height)
        this.pixels[y][x] = color;
    }

    blanco()
    {
        this.pixels = Array.from({ length: this.height }, () =>
        Array.from({ length: this.width }, () => Color.WHITE));
        this.canvas.clearRect(0, 0, canvas.width, canvas.height);
    }
}

class Model
{
    constructor(vertices, color)
    {
        this.vertices = vertices;
        this.color = color;

        this.minX=vertices[0].x;
        this.maxX=vertices[0].x;
        this.minY=vertices[0].y;
        this.maxY=vertices[0].y;

        vertices.forEach((v) => {
            if (v.x < this.minX) this.minX = v.x;
            if (v.x > this.maxX) this.maxX = v.x;

            if (v.y > this.maxY) this.maxY = v.y;
            if (v.y < this.minY) this.minY = v.y;
        });

        this.offset = new Vec2 ( (this.minX + this.maxX ) / 2, (this.minY + this.maxY ) / 2 )
    }
}

class Object
{
    constructor(position, model)
    {
        this.position = position;
        this.model = model;
        this.scale = 1;
        this.theta = 0;

        for(let i = 0; i < this.model.vertices.length; i++)
        {
            this.model.vertices[i] = this.model.vertices[i].sub(this.model.offset);
        }
    }

    giveModel()
    {
        var m = this.model;
        for(let i = 0; i < this.model.vertices.length; i++)
        {
            m.vertices[i] = m.vertices[i].add(this.position);
        }
        return m;
    }

    translate(p)
    {
        console.log("translating")
        this.position = this.position.add(p);
    }

    rotate(theta)
    {

    }
}

class Graphics 
{
    constructor(screen) {
        this.screen = screen;
    }

    drawLine(start, end, color)
    {
        // Als de conditie hieronder waar is moeten de punten omgewisseld worden. 
        if (start.x > end.x)
        {
            let temp = start;
            start = end;
            end = temp;
        }
        let rc = (end.y - start.y) / (end.x - start.x);
        let c = start.y - (rc * start.x);

        if (Math.abs( rc ) < 1)
        {
            for (var x = start.x; x < end.x; x++)
            {
                let y = rc * x + c;
                //this.screen.canvas.fillRect(x,y, 2, 2)
                this.screen.putPixel(Math.round(x), Math.round(y), color)
            }
        }

        else // Als de lijn te steil wordt, moet de wijze van rekenen wat anders worden.
        {
            if (start.y > end.y)
            {
                let temp = start;
                start = end;
                end = temp;
            }

            // Nu word er gekeken hoeveel x-waardes we verder zijn, per y-waarde.
            let rcy = (end.x - start.x) / (end.y - start.y);
            let cy = start.x - (rcy * start.y);
            for (var y = start.y; y < end.y; y++)
            {
                let x = rcy * y + cy;
                //this.screen.canvas.fillRect(x,y, 2, 2)
                this.screen.putPixel(Math.round(x), Math.round(y), color);
            }
        }
    }

    // Dit method maakt een polygoon op basis van een gegeven model.
    drawShape(model)
    {
        for(var i = 0; i < model.vertices.length -1; i++) // Trekt een voor een de lijnen.
        { 
            this.drawLine(model.vertices[i], model.vertices[i +1], model.color);
        }
        this.drawLine(model.vertices.slice(-1)[0], model.vertices[0], model.color);
    }

}

var screen = new Screen('canvas', 500, 500);
var gfx = new Graphics(screen);

var verts =
[
    new Vec2(50, 50),
    new Vec2(100, 50),
    new Vec2(100, 100),
    new Vec2(3, 3),
    new Vec2(100, 10),
    new Vec2(50, 50),
    new Vec2(290, 410)
];

var object = new Object(new Vec2(0, 0), new Model( verts, Color.RED ));

function update()
{
    screen.blanco()
    plotstuff()
    screen.drawCanvas();
}


function plotstuff()
{
// Voeg een event listener toe aan het document
document.addEventListener('keydown', function(event) {
    // Controleer welke toets is ingedrukt
    if (event.key === 'w') {
        object.translate(new Vec2(0, -1))
        // Voeg hier je eigen logica toe voor de "w" toets
    } else if (event.key === 'a') {
        object.translate(new Vec2(-1, 0))
        // Voeg hier je eigen logica toe voor de "a" toets
    } else if (event.key === 's') {
        object.translate(new Vec2(0, 1))
        // Voeg hier je eigen logica toe voor de "s" toets
    } else if (event.key === 'd') {
        object.translate(new Vec2(1, 0))
        // Voeg hier je eigen logica toe voor de "d" toets
    }

    gfx.drawShape(object.giveModel());
});
}


var s = setInterval(function() { update() }, 10);
