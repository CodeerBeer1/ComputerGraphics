const Color = 
{
    RED: "rgb( 255, 0, 0 )",
    GREEN: "rgb( 0, 255, 0 )",
    BLUE: "rgb( 0, 0, 255 )",
    WHITE: "rgb( 255, 255, 255 )",
    BLACK: "rgb( 0, 0, 0 )"
}

const Keys = 
{
    W: false,
    A: false,
    S: false,
    D: false,

    Space: false,
    Shift: false,

    Up: false,
    Down: false,
    Left: false,
    Right: false
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

    scale(scalar)
    {
        return new Vec2( this.x * scalar, this.y * scalar );
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
        for(var y = 0; y < this.height; y++)
        {
            for(var x = 0; x < this.width; x++)
            {
                this.canvas.fillStyle = this.pixels[y][x];

                if(this.pixels[y][x] != Color.WHITE)
                {
                    this.canvas.fillRect(x, y, 2, 2);
                }
                this.canvas.fillStyle = Color.WHITE;
            }
        }
    }

    putPixel(x, y, color)
    { 
        (x > 0 && x < screen.width && y > 0 && y < screen.height) ? this.pixels[y][x] = color : console.log()
        
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
        this.scale = 1;
        this.theta = 0;
        this.color = color;

        this.transformationMatrix = []

        this.minX = vertices[0].x;
        this.maxX = vertices[0].x;
        this.minY = vertices[0].y;
        this.maxY = vertices[0].y;

        vertices.forEach((v) => {
            if (v.x < this.minX) this.minX = v.x;
            if (v.x > this.maxX) this.maxX = v.x;

            if (v.y > this.maxY) this.maxY = v.y;
            if (v.y < this.minY) this.minY = v.y;
        });

        this.offset = new Vec2 ( (this.minX + this.maxX ) / 2, (this.minY + this.maxY ) / 2 )

        for(let i = 0; i < this.vertices.length; i++)
        {
            this.vertices[i] = this.vertices[i].sub(this.offset);
        }
    }
}

class Object
{
    constructor(position, model)
    {
        this.position = position;
        this.model = model;
        this.gfx = gfx;
    }

    transform()
    {
        if(Keys.W)
        {
            this.translate(new Vec2( 0, -4 ));
        }

        if(Keys.A)
        {
            this.translate(new Vec2( -4, 0 ));
        }

        if(Keys.S)
        {
            this.translate(new Vec2( 0, 4 ));
        }

        if(Keys.D)
        {
            this.translate(new Vec2( 4, 0 ));
        }

        if(Keys.Up)
        {
            this.rotate(10)
        }

        if(Keys.Down)
        {
            this.rotate(-10)
        }

        if(Keys.Space)
        {
            this.scale(1.2)
        }

        if(Keys.Shift)
        {
            this.scale(0.7)
        }

    }

    giveModel()
    {
        var m = new Model([...this.model.vertices], this.model.color);

        for (let i = 0; i < m.vertices.length; i++) {
            m.vertices[i] = m.vertices[i].add(this.position);
        }
    
        return m;
    }

    render()
    {
        gfx.drawShape(this.giveModel());
    }

    translate(p)
    {   
        this.position = this.position.add(p);
    }

    rotate(theta)
    {
        const radians = theta * (Math.PI / 180);
        var a = 
        [
            [Math.cos(radians), -Math.sin(radians), 0],
            [Math.sin(radians), Math.cos(radians), 0],
            [ 0, 0, 1 ]
        ]

        for(let i = 0; i < this.model.vertices.length; i++)
        {
            let b = [ [ this.model.vertices[i].x, this.model.vertices[i].y, 1]  ]
            let ar = multiplyMatrices(b, a);
            this.model.vertices[i] = new Vec2(ar[0][0], ar[0][1])
        }
    }

    // scale(scalar)
    // {
    //     for(let i = 0; i < this.model.vertices.length; i++)
    //     {
    //         let s = 
    //         [
    //             [scalar, 0, 0],
    //             [0, scalar, 0]
    //             [0, 0, 1]
    //         ]
    //         let b = [ [ this.model.vertices[i].x, this.model.vertices[i].y, 1] ]
    //         let ar = multiplyMatrices(b, s);
    //         this.model.vertices[i] = new Vec2(ar[0][0], ar[0][1]);
    //     }
    // }

    scale(factor) {
        for (let i = 0; i < this.model.vertices.length; i++) {
            const vertexArray = [this.model.vertices[i].x, this.model.vertices[i].y, 1];

            const scaleMatrix = [
                [factor, 0, 0],
                [0, factor, 0],
                [0, 0, 1]
            ];

            const result = multiplyMatrices([vertexArray], scaleMatrix);

            // Update de positie van de vertex met de nieuwe geschaalde waarden
            this.model.vertices[i] = new Vec2(result[0][0], result[0][1]);
        }
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

// function multiplyMatrices(a, b)
// {

//     const ab = [];
//     if( a[0].length == b.length )
//     {
//         const r = a.length; // column size
//         const c = b[0].length; // row size
//         for(let q = 0; q <= r; q++)
//         {
//             for(let i = 0; i <= c; i++)
//             {
//                 ab[q][i] += ( a[q][i] * b[i][q] );
//                 console.log( a[q][i] , b[i][q], ab);
//             }
//         }
//     }

//     return ab;
// }

function multiplyMatrices(matrix1, matrix2) {
    const result = [];
  
    if (matrix1[0].length != matrix2.length) {
        console.log(matrix1[0] , matrix2)
      // Controleer of het aantal kolommen van de eerste matrix gelijk is aan het aantal rijen van de tweede matrix
      console.error("Kan matrices niet vermenigvuldigen. Aantal kolommen van matrix1 moet gelijk zijn aan het aantal rijen van matrix2.");
      return null;
    }
    
    const rows = matrix1.length;
    const cols = matrix2[0].length;
    const commonDim = matrix1[0].length;
  
    for (let i = 0; i < rows; i++) {
      result[i] = [];
      for (let j = 0; j < cols; j++) {
        result[i][j] = 0;
        for (let k = 0; k < commonDim; k++) {
          result[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
  
    return result;
  }

var screen = new Screen('canvas', 500, 500);
var gfx = new Graphics(screen);

var verts =
[
    new Vec2(50, 50),
    new Vec2(50, 100),
    new Vec2(100, 100),
    new Vec2(50, 50),
    new Vec2(100, 50),
    new Vec2(100, 100),
    new Vec2(3, 3),
    new Vec2(100, 10),
    new Vec2(50, 50),
    new Vec2(290, 410),
    new Vec2(100, 50)
]

var object = new Object(new Vec2(250, 250), new Model( verts, Color.BLUE ));
screen.blanco();
screen.drawCanvas();

function update()
{
    screen.blanco();
    object.render();
    object.transform();
    screen.drawCanvas();
    console.log(object.position)
};


// Voeg een event listener toe aan het document
document.addEventListener('keydown', function(event) {
    switch(event.key)
    {
        case 'w': Keys.W = true;
            break;

        case 'a': Keys.A = true;
        break;

        case 's': Keys.S = true;
            break;

        case 'd': Keys.D = true;
        break;

        case 'ArrowUp': Keys.Up = true;
            break;

        case 'ArrowDown': Keys.Down = true;
            break;

        case 'ArrowLeft': Keys.Left = true;
            break;

        case 'ArrowRight': Keys.Right = true;
            break;

        case 'Shift': Keys.Shift = true;
            break;

        case ' ': Keys.Space = true;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key)
    {
        case 'w': Keys.W = false;
        break;

        case 'a': Keys.A = false;
            break;

        case 's': Keys.S = false;
            break;

        case 'd': Keys.D = false;
            break;

        case 'ArrowUp': Keys.Up = false;
            break;

        case 'ArrowDown': Keys.Down = false;
            break;

        case 'ArrowLeft': Keys.Left = false;
            break;

        case 'ArrowRight': Keys.Right = false;
            break;

        case 'Shift': Keys.Shift = false;
            break;

        case ' ': Keys.Space = false;
    }
});

var s = setInterval(function() { update() }, 10);
