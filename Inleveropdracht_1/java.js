const Color = 
{
    RED: "rgb( 255, 0, 0 )",
    GREEN: "rgb( 0, 255, 0 )",
    BLUE: "rgb( 0, 0, 255 )"
}

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Screen {
    constructor(canvas, width, height) {
        this.canvas = document.getElementById(canvas);
        this.width = width;
        this.height = height;

        this.gfx = new Graphics(this);
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas = this.canvas.getContext('2d');
    }
}

class Model
{
    constructor(vertices, color)
    {
        this.vertices = vertices;
        this.color = color;
    }
}

class Object
{
    constructor(position, model)
    {
        this.position = position;
        this.model = new Model(model);
    }
}

class Graphics {
    constructor(screen) {
        this.screen = screen;
    }

    drawLine(start, end, color)
    {
        // Kleur instellen
        this.screen.canvas.fillStyle = color;

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
                this.screen.canvas.fillRect(x, y, 2, 2);
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
                
                this.screen.canvas.fillRect(x, y, 2, 2);
            }
        }

        // Aan het eind weer op zwart zetten.
        this.screen.canvas.fillStyle = "black";
    }

    // Dit method maakt een polygoon op basis van een gegeven model.
    drawShape(model)
    {
        for(var i = 0; i < model.vertices.vertices.length -1; i++) // Trekt een voor een de lijnen.
        { 
            this.drawLine(model.vertices.vertices[i], model.vertices.vertices[i +1], model.color);
        }
        this.drawLine(model.vertices.vertices.slice(-1)[0], model.vertices.vertices[0], model.color);
    }

}

var screen = new Screen('canvas', 500, 500);

var vertices =
[
    new Vec2(3, 3),
    new Vec2(100, 10),
    new Vec2(50, 50),
    new Vec2(290, 410),
]
var object = new Object(new Vec2(50, 50), { vertices: vertices, color: Color.RED });

screen.gfx.drawShape(object.model)
