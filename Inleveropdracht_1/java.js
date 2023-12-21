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
    Right: false,

    Point: false,
    Slash: false
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

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vector)
    {
        return new Vec3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    sub(vector)
    {
        return new Vec3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    scale(scalar)
    {
        return new Vec3( this.x * scalar, this.y * scalar, this.z * scalar);
    }
}

class Screen 
{
    constructor(canvas, width, height, position) {
        this.position = position
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
        // let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        // let vsSource = 
        // `#version 300 es
        //     in vec3 pos;
            
        //     void main()
        //     {
        //         gl_position = vec4(pos, 1.0);
        //     }
        // `;

        // this.gl.shaderSource(vertexShader, vsSource);
        // this.gl.compileShader(vertexShader)

        // let status = this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)

        // let log = this.gl.getShaderInfoLog()
        //     console.log(status)
        // let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        // let frSource = 
        // `#version 300 es
        //     precision medium float;
        //     out vec4 fragColor;
            
        //     void main()
        //     {
        //         fragColor = vec4(0.5, 0.5, 1.0, 1.0);
        //     }
        // `;

        // this.gl.shaderSource(fragmentShader, frSource)
        // this.gl.compileShader(fragmentShader);

        // var program = this.gl.createProgram();
        // this.gl.attachShader(program, vertexShader);
        // this.gl.attachShader(program, fragmentShader);
        // this.gl.linkProgram(program);
        // this.gl.useProgram(program);

        // let buffer = this.gl.createBuffer();
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        //     -1, 0, 0,
        //     0, 1, 0,
        //     1, -1, 0]), this.gl.STATIC_DRAW);
            
        // var attr = this.gl.getAttribLocation(program, "pos");
        // this.gl.vertexAttribPointer(attr, 3, this.gl.FLOAT, this.gl.FALSE, 0, 0);
        // this.gl.enableVertexAttribArray(attr);
           
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
        this.projectionVertices = [];
        this.scale = 1;
        this.theta = 0;
        this.color = color;

        this.transformationMatrix = []

        this.min = new Vec3( vertices[0].x, vertices[0].y, vertices[0].z);
        this.max = new Vec3( vertices[0].x, vertices[0].y, vertices[0].z);

        vertices.forEach((v) => {
            if (v.x < this.min.x) this.min.x = v.x;
            if (v.x > this.max.x) this.max.x = v.x;

            if (v.y > this.max.y) this.max.y = v.y;
            if (v.y < this.min.y) this.min.y = v.y;

            if (v.z > this.max.z) this.max.z = v.z;
            if (v.z < this.minzy) this.min.z = v.z;
        });

        this.offset = new Vec3 ( (this.min.x + this.max.x ) / 2, (this.min.y + this.max.y ) / 2, 2 * this.max.z)

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
            this.translate(new Vec3( 0, 0, 4 ));
        }

        if(Keys.A)
        {
            this.translate(new Vec3( -4, 0, 0 ));
        }

        if(Keys.S)
        {
            this.translate(new Vec3( 0, 0, -4 ));
        }

        if(Keys.D)
        {
            this.translate(new Vec3( 4, 0, 0 ));
        }

        if(Keys.Up)
        {
            this.rotateX(4)
        }

        if(Keys.Down)
        {
            this.rotateX(-4)
        }

        if(Keys.Left)
        {
            this.rotateY(4)
        }

        if(Keys.Right)
        {
            this.rotateY(-4)
        }

        if(Keys.Point)
        {
            this.rotateZ(4)
        }

        if(Keys.Slash)
        {
            this.rotateZ(-4)
        }

        if(Keys.Space)
        {
            this.translate(new Vec3( 0, -4, 0 ));
        }

        if(Keys.Shift)
        {
            this.translate(new Vec3( 0, 4, 0 ));
        }

    }

    render()
    {
        gfx.drawModel(this.giveModel());
    }


    giveModel()
    {
        var m = new Model([...this.model.vertices], this.model.color);
        m.projectionVertices = this.model.projectionVertices;

        for (let i = 0; i < m.vertices.length; i++) {
            m.vertices[i] = m.vertices[i].add(this.position);
        }
    
        return m;
    }


    translate(p)
    {   

        const translationMatrix = [
            [1, 0, 0, p.x],
            [0, 1, 0, p.y],
            [0, 0, 1, p.z],
            [0, 0, 0, 1]
        ];

        this.position = this.position.add(p)

    }

    rotateZ(theta)
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
            let b = [ [ this.model.vertices[i].x, this.model.vertices[i].y, this.model.vertices[i].z]  ]
            let ar = multiplyMatrices(b, a);
            this.model.vertices[i] = new Vec3(ar[0][0], ar[0][1], ar[0][2])
        }
    }

    rotateX(theta)
    {
        const radians = theta * (Math.PI / 180);
        var a = 
        [
            [Math.cos(radians), 0, Math.sin(radians)],
            [0, 1, 0],
            [-Math.sin(radians), 0, Math.cos(radians)]
        ]

        for(let i = 0; i < this.model.vertices.length; i++)
        {
            let b = [ [ this.model.vertices[i].x, this.model.vertices[i].y, this.model.vertices[i].z]]
            let ar = multiplyMatrices(b, a);
            this.model.vertices[i] = new Vec3(ar[0][0], ar[0][1], ar[0][2])
        }
    }

    rotateY(theta)
    {
        const radians = theta * (Math.PI / 180);
        var a = 
        [
            [1, 0, 0],
            [0, Math.cos(radians), -Math.sin(radians)],
            [0, Math.sin(radians), Math.cos(radians)]
        ]

        for(let i = 0; i < this.model.vertices.length; i++)
        {
            let b = [ [ this.model.vertices[i].x, this.model.vertices[i].y, this.model.vertices[i].z]  ]
            let ar = multiplyMatrices(b, a);
            this.model.vertices[i] = new Vec3(ar[0][0], ar[0][1], ar[0][2])
        }
    }

    scale(scalar)
    {
        
        let s = 
        [
            [scalar, 0, 0],
            [0, scalar, 0],
            [0, 0, 1]
        ]
        for(let i = 0; i < this.model.vertices.length; i++)
        {
            let b = [ [ this.model.vertices[i].x, this.model.vertices[i].y, 1] ]
            let ar = multiplyMatrices(b, s);
            this.model.vertices[i] = new Vec3(ar[0][0], ar[0][1], 0);
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
    drawModel(model)
    {
        let v = model.projectionVertices;
        for(let i = 0; i < v.length -1; i++) // Trekt een voor een de lijnen.
        { 
            this.drawLine(v[i], v[i +1], model.color);
        }
        // this.drawLine(v.slice(-1)[0], v[0], model.color);
    }

    project(object)
    {
        let projectionMatrix = 
        [
            [-1, 0, 0, 0],
            [ 0,-1, 0, 0],
            [ 0, 0 , 1 / this.screen.position.z, 0],
            [ 0, 0, 1, 0]
        ];

        let model = object.model
        
        let v = model.vertices;

        for(let i = 0; i < v.length; i++)
        {
            let b = [ v[i].x, v[i].y, v[i].z, 1 ];
            let ar = math.multiply(projectionMatrix, b);
            // Divide by w component to get the normalized device coordinates

            model.projectionVertices[i] = new Vec2(ar[0] / ar[3], ar[1] / ar[3]);
            model.projectionVertices[i] = model.projectionVertices[i].scale(100)
            model.projectionVertices[i] = model.projectionVertices[i].add(object.position)

        }
    }

}

function multiplyMatrices(matrix1, matrix2) {
    const result = [];
    if (matrix1[0].length != matrix2.length) {
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

var screen = new Screen('canvas', 500, 500, new Vec3(0, 0, 10));
var gfx = new Graphics(screen);


var verts = [
    new Vec3(0, 0, 0),          
    new Vec3(50, 0, 0),         
    new Vec3(50, 50, 0),        
    new Vec3(0, 50, 0),
    new Vec3(0, 0, 0),   

    new Vec3(0, 0, 50),         
    new Vec3(50, 0, 50),        
    new Vec3(50, 50, 50),       
    new Vec3(0, 50, 50),
    new Vec3(0, 0, 50),

    new Vec3(50, 0, 50),         
    new Vec3(50, 0, 0),        
    new Vec3(50, 50, 0),       
    new Vec3(50, 50, 50),
    new Vec3(0, 50, 50),
    new Vec3(0, 50, 0)

    
];


var object = new Object(new Vec3(250, 250, -10), new Model( verts, Color.BLUE ));



function update()
{
    screen.blanco();
    object.transform();
    gfx.project(object);
    object.render();
    screen.drawCanvas();

    console.log(object.position)
    
};



update()
var s = setInterval(function() { update() }, 10);

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
            break;

        case '.': Keys.Point = true;
            break;

        case '/': Keys.Slash = true;
            break;
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

        case '.': Keys.Point = false;
            break;

        case '/': Keys.Slash = false;
            break;
    }
});