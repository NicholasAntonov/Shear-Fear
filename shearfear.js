function shearFear() {
    // The browser will automatically run the function "gameLoop"
    // every 17 milliseconds or so
    function initialize()
    {
        window.requestAnimationFrame(gameLoop);
    }

    // Main game loop
    function gameLoop() {
        
        getInput();
        collideStuff();
        updatePositions();
        updateState();
        draw();
        
        // Run the game loop over and over again
        if (!gameOver)
            window.requestAnimationFrame(gameLoop);
        else
            window.requestAnimationFrame(gameOverLoop);
    }
        
    function updatePositions()
    {
        updatePosition(player);
        
        for (var i = 0; i < herd.length; i++)
        {
            updatePosition(herd[i]);
            
        }
    }

    function updateState()
    {
        if (herd.length === 0)
        {
            gameOver = true;
            //window.requestAnimationFrame(gameOverLoop);
        }
    }
        
    function collideStuff()
    {
        collide(player, barn);
        
        for (var i = 0; i < herd.length; i++)
        {
            collide(herd[i], barn);
        }
        
        for (var i = 0; i < walls.length; i++)
        {
            collide(player, walls[i]);
            
            for (var j = 0; j < herd.length; j++)
            {
                collide(herd[j], walls[i]);
            }
        }
        
        
    }

    function getInput()
    {
        player.velocity.y = 0;
        player.velocity.x = 0;
        if (w)
        {
            player.velocity.y -= playerSpeed;
        }
        
        if (s)
        {
            player.velocity.y += playerSpeed;
        }
        
        if (a)
        {
            player.velocity.x -= playerSpeed;
        }
        
        if (d)
        {
            player.velocity.x += playerSpeed;
        }
        
        //normalize to playerspeed
        if (( 0 !== player.velocity.x ) && ( 0 !== player.velocity.y ))
        {
            player.velocity.x =  player.velocity.x/Math.sqrt(2);
            player.velocity.y =  player.velocity.y/Math.sqrt(2);
        }
        
        for (var i = 0; i < herd.length; i++)
        {
            herd[i].update();
        }
    }

    function updatePosition(object) 
    {
        object.x += object.velocity.x;
        object.y += object.velocity.y;
    }
        
    function draw()
    {
        
        // Clear the screen
        ctx.fillStyle = "rgb(0, 177, 0)";
        ctx.fillRect(0, 0, width, height);
        
        //walls
        for (var i = 0; i < walls.length; i++)
        {
            drawBox(walls[i], "rgb(162, 118, 0)");
            
        }
        
        // Score
        ctx.font = "normal 10px sans-serif";
        ctx.fillStyle = "rgb(10, 38, 193)";
        ctx.fillText("Exploded: "+exploded, 10, 10);
        ctx.fillText("Herded: "+herded, width - 100, 10);
        
        //Sheep
        for (var i = 0; i < herd.length; i++)
        {
            herd[i].draw();
            
        }
        
        for (var i = 0; i < explosions.length; i++)
        {
            if (explosions[i].active)
            {
                explosions[i].draw();
                explosions[i].nextFrame();
            }
            else
            {
                explosions.splice(i,1);
            }
        }
        
        //barn
        barn.draw();
        
        //Player
        drawPlayer();
    }

    function drawPlayer()
    {
        // Ball shape
        /*ctx.beginPath();
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
        ctx.fill();*/
        ctx.drawImage(shear_img, player.x-player.radius*2, player.y-player.radius*2-8);
    }

    function drawBox(box, color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(box.x-(box.width/2), box.y-(box.height/2), box.width, box.height);
    }

    function collide(circle, rect)
    {
        tempVelocity = Math.sqrt(Math.pow(circle.velocity.x, 2) + Math.pow(circle.velocity.x, 2));
        
        tempCircle = new entity(circle.x + circle.velocity.x, circle.y + circle.velocity.y, circle.radius, circle.velocity.x, circle.velocity.y);
        
        var dx = false;
        var dy = false;

        tempCircle = new entity(circle.x + circle.velocity.x, circle.y, circle.radius, circle.velocity.x, circle.velocity.y);
        if (rect.intersects(tempCircle))
        {
            circle.velocity.x = 0;
            dx = true;
        }
            
        tempCircle = new entity(circle.x, circle.y + circle.velocity.y, circle.radius, circle.velocity.x, circle.velocity.y);
        if (rect.intersects(tempCircle))
        {
            circle.velocity.y = 0;
            dy = true;
        }
        
        if( dy && !dx )
        {
            circle.velocity.x = tempVelocity*(circle.velocity.x?circle.velocity.x<0?-1:1:0);
        }
        
        if( !dy && dx )
        {
            circle.velocity.y = tempVelocity*(circle.velocity.y?circle.velocity.y<0?-1:1:0);
        }
        

    }



    function intersects(circle, rect)
    {
        var circleDistanceX = Math.abs(circle.x - rect.x);
        var circleDistanceY = Math.abs(circle.y - rect.y);

        if (circleDistanceX > (rect.width/2 + circle.radius)) { return false; }
        if (circleDistanceY > (rect.height/2 + circle.radius)) { return false; }

        if (circleDistanceX <= (rect.width/2)) { return true; } 
        if (circleDistanceY <= (rect.height/2)) { return true; }

        var cornerDistance_sq = (circleDistanceX - rect.width/2) * (circleDistanceX - rect.width/2) + (circleDistanceY - rect.height/2) * (circleDistanceY - rect.height/2);

        return (cornerDistance_sq <= (circle.radius * circle.radius));
    }

    function circleIntersects(circle1, circle2)
    {
        return Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2) < Math.pow((circle1.radius + circle2.radius), 2);
    }

    function startScreenLoop()
    {
        player.x = 2000;
        player.y = 2000;
        ctx.fillStyle = "rgb(0, 177, 0)";
        ctx.fillRect(0, 0, width, height);
        for(var i = 0; i < start_herd.length; i++)
        {
            start_herd[i].update();
            updatePosition(start_herd[i]);
            start_herd[i].draw();
        }
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.font = "bold 40px Arial";
        ctx.strokeText("Shear Fear", 325, 100);
        ctx.fillText("Shear Fear", 325, 100);
        ctx.font = "bold 25 Arial";
        ctx.strokeText("Chase the sheep back into the barn!", 100, 200);
        ctx.fillText("Chase the sheep back into the barn!", 100, 200);
        ctx.strokeText("WASD to move.", 275, 300);
        ctx.fillText("WASD to move.", 275, 300);
        ctx.strokeText("Press Spacebar to start.", 200, 400);
        ctx.fillText("Press Spacebar to start.", 200, 400);
        if ( spacebar )
        {
            //var music = new Audio("song2.wav");
            //music.loop = true;
            //music.play();
            initialize();
            player.x = 50;
            player.y = 50;

            //window.requestAnimationFrame(gameLoop);
        }
        else
        {
            window.requestAnimationFrame(startScreenLoop);
        }
    }

    function entity(x, y, radius, vx, vy)
    {
        this.x      = x;
        this.y      = y;
        this.radius = radius;
        this.velocity = {
            x: vx,
            y: vy
        }
    }

    function wall(x, y, w, h)
    {
        this.x      = x;
        this.y      = y;
        this.width  = w;
        this.height = h;
        
        this.intersects = function(circle)
        {
            var circleDistanceX = Math.abs(circle.x - this.x);
            var circleDistanceY = Math.abs(circle.y - this.y);

            if (circleDistanceX > (this.width/2 + circle.radius)) { return false; }
            if (circleDistanceY > (this.height/2 + circle.radius)) { return false; }

            if (circleDistanceX <= (this.width/2)) { return true; } 
            if (circleDistanceY <= (this.height/2)) { return true; }

            var cornerDistance_sq = (circleDistanceX - this.width/2) * (circleDistanceX - this.width/2) + (circleDistanceY - this.height/2) * (circleDistanceY - this.height/2);

            return (cornerDistance_sq <= (circle.radius * circle.radius));
        }
        
        
    }

    function House(x,y, radius)
    {
        this.x           = x;
        this.y           = y;
        this.radius      = radius;
        this.boxPart     = new wall(this.x, this.y+this.radius, this.radius*2, this.radius*2);
        this.circlePart  = new entity(this.x, this.y, this.radius, 0, 0);
        this.goal        = new wall(this.x, this.y+this.radius*2, this.radius*6/5, 5);
        
        this.draw = function()
        {
            
            // Ball shape
            ctx.beginPath();
            ctx.fillStyle = "rgb(208, 208, 208)";
            ctx.arc(this.circlePart.x, this.circlePart.y, this.circlePart.radius, 0, Math.PI*2);
            ctx.fill();
            
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(this.x-radius, this.y, this.radius*2, this.radius*2);
            
            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.linewidth = 5
            ctx.beginPath();
                ctx.moveTo(this.x-this.radius, this.y);
                ctx.lineTo(this.x+this.radius, this.y+this.radius*2);
            ctx.stroke();
            ctx.beginPath();
                ctx.moveTo(this.x+this.radius, this.y);
                ctx.lineTo(this.x-this.radius, this.y+this.radius*2);
            ctx.stroke();
            
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(this.x-radius*2/3, this.y+radius*2/3, this.radius*4/3, this.radius*4/3);
            
              
            
            ctx.strokeStyle =  "rgb(198, 0, 0)";
            ctx.lineWidth=3;
            //ctx.strokeRect(this.x-radius*2/3, this.y+radius*2/3, this.radius*4/3, this.radius*4/3);
            ctx.beginPath();
                //ctx.rect(this.x-this.radius*2/3, this.y+radius*2/3, this.radius*4/3, this.radius*4/3);
                ctx.moveTo(this.x-this.radius*2/3, this.y+radius*2);
                ctx.lineTo(this.x-this.radius*2/3, this.y+radius*2/3);
                ctx.lineTo(this.x+this.radius*2/3, this.y+radius*2/3);
                ctx.lineTo(this.x+this.radius*2/3, this.y+radius*2);
            ctx.stroke();
            /*
            ctx.fillRect(this.x-radius*2/3, this.y+radius*2/3, 1, this.radius*4/3);
            ctx.fillRect(this.x+radius*2/3, this.y+radius*2/3, 1, this.radius*4/3);
            ctx.fillRect(this.x-radius*2/3, this.y+radius*2/3, this.radius*4/3, 1);*/
            //drawBox(this.boxPart, "rgb(0, 255, 0)");
            //drawBox(this.goal, "rgb(0, 255, 0)");
        }
        
        
        
        this.collide = function(circle)
        {
            
        }
        
        this.intersects = function(circle)
        {
            //this is ghetto because indexof is returning -1 on circle always
            if ( this.goal.intersects(circle))
            {
                for (var i = 0; i < herd.length; i++)
                {
                    if (this.goal.intersects(herd[i]))
                    {
                        herd.splice(i, 1);
                        herded++;
                        boop.play();
                        
                    }
                }
            }
            else
            {
                if (circleIntersects(circle, this.circlePart))
                {
                    ctx.fillStyle = "rgb(255, 0, 0)";
                    ctx.fillRect(500, 200, this.radius*2, this.radius*2);
                }
                return (circleIntersects(circle, this.circlePart));
            }
        }
    }

    // Sheep class.
    // Parameters: x - initial x coordinate
    //             y - initial y coordinate
    //             randFrames - how many frames the sheep will move before changing its velocity.
    //             waitTime - how many frames the sheep will wait after moving for randFrames frames
    function Sheep(x, y, radius, randFrames, waitTime, vx, vy)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = {
            x: vx,
            y: vy
        }
        this.waitTime = waitTime;
        var threatened = false;
        var movementCounter = 0;
        var waitCounter = 0;
        this.randFrames = randFrames;
        var explode = false;
        
        this.update = function()
        {
            
            //goodsplode
            /*if(circleIntersects(this, player))
            {
                explosions.push(new SpriteSheet("explosion.png", 50, 50, 10, this.x - 20, this.y - 20, true, 1, 2, false));
                explosions[explosions.length-1].active = true;
                //baa_sound.play();
                baaarray[baa_counter].play();
                baa_counter = (baa_counter + 1) % maxBaa;
                exploded++;
                herd.splice(herd.indexOf(this), 1);
            }*/
            
            
            if(circleIntersects(this, player) || this.explode)
            {
                explosions.push(new SpriteSheet("explosion.png", 50, 50, 10, this.x - 20, this.y - 20, true, 1, 2, false));
                explosions[explosions.length-1].active = true;
                //baa_sound.play();
                
                if(!this.explode)
                {
                    exploded++;
                    herd.splice(herd.indexOf(this), 1);
                    baaarray[baa_counter].play();
                    baa_counter = (baa_counter + 1) % maxBaa;
                }
                else
                {
                    nuclear_herd.splice(nuclear_herd.indexOf(this), 1);
                    return false; // return false to show sheep was exploded
                }
            }
            // if the sheep is not threatened by the shears, it will move randomly
            
            else if(circleIntersects(new entity(player.x, player.y, runDist + player.radius, 0, 0), this))
                {
                var distX = this.x - player.x;
                var distY = this.y - player.y;
            
                var distMag = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));
                    
                this.velocity.x = distX*playerSpeed/distMag;
                this.velocity.y = distY*playerSpeed/distMag;
            
            }
            else
            {
                if(waitCounter == 0)
                {
                        if(movementCounter == 0)
                        {
                            waitCounter++;
                            this.velocity.x = Math.floor(Math.random() * 3 - 1);
                            this.velocity.y = Math.floor(Math.random() * 3 - 1);
                        }
                        
                        // if the sheep is nearing the wall, move in opposite direction of wall
                        if(this.x + this.velocity.x > canvas.width || this.x + this.velocity.x < 0)
                        {
                            this.velocity.x = -this.velocity.x;
                        }
                        if(this.y + this.velocity.y > canvas.height || this.y + this.velocity.y < 0)
                        {
                            this.velocity.y = -this.velocity.y;
                        }
                        
                        movementCounter = (movementCounter + 1) % randFrames;
                }
                else
                {
                    waitCounter = (waitCounter + 1) % waitTime;
                }
            }
            return true;
        }
        
        
        this.draw = function()
        {
            /*ctx.beginPath();
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fill();*/
            ctx.drawImage(sheep_img, this.x - radius - 5, this.y - radius - 5);
        }
    }

    // SpriteSheet class.
    // Parameters: path - path to the sprite sheet image
    //             frameWidth - the width of each frame in the spritesheet in pixels
    //             frameHeight - the height of each frame in the spritesheet in pixels
    //             x, y - the inital x and y coordinates of the image
    //             autoreverse - if enabled, the animation will automatically be played backwards at the end of every cycle
    //             numRows - number of rows in the spritesheet
    //             frameSpeed - how many game loops each frame is displayed for (higher number == slower animation)
    //             loop - whether or not the animation should loop continuously or just play once
    function SpriteSheet(path, frameWidth, frameHeight, endFrame, x, y, autoreverse, numRows, frameSpeed, loop)
    {
        var image = new Image();
        this.x = x;
        this.y = y;
        var framesPerRow;
        this.numRows = numRows;
        var counter = 0;
        var currentFrame = 0;
        var active = true;
        this.loop = loop;
        if(autoreverse)
            this.endFrame = endFrame * 2;
        else
            this.endFrame = endFrame;
        
        // Calculates the number of frames per row.
        image.onload = function()
        {
            framesPerRow = Math.floor(image.width / frameWidth);
        }
        
        image.src = path;
        
        // Goes to the next image frame.
        this.nextFrame = function()
        {
            if(counter == frameSpeed - 1)
                currentFrame = (currentFrame + 1) % this.endFrame;        
            counter = (counter + 1) % frameSpeed;

        }
        
        // Draws the current frame.
        this.draw = function()
        {
            if(active)
            {
                if(!autoreverse || currentFrame < this.endFrame/2)
                {
                    var row = Math.floor(currentFrame / framesPerRow);
                    var col = Math.floor(currentFrame % framesPerRow);
                }
                else
                {
                    var row = numRows - Math.floor(currentFrame / framesPerRow) + 1;
                    var col = framesPerRow - Math.floor(currentFrame % framesPerRow) - 1;
                }
                ctx.drawImage(image, col * frameWidth, row*frameHeight, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
                
                if(!loop && currentFrame == endFrame - 1)
                    active = false;
            }
        }
    }


    function gameOverLoop()
    {
        player.x = 2000;
        player.y = 2000;
        end_counter++;
        ctx.fillStyle = "rgb(0, 177, 0)";
        ctx.fillRect(0, 0, width, height);
        var explodeIdx = Math.floor(Math.random() * nuclear_herd.length);
        if(nuclear_herd.length > 0 && end_counter % Math.floor(Math.random() * 30) === 0)
        {
            nuclear_herd[explodeIdx].explode = true;
            if(Math.floor(Math.random() * 4) <= 2)
                nuclear_herd.push(new Sheep(Math.random() * width, Math.random() * height, 15, 15, 5, 0, 0));
        }
        for(var i = 0; i < nuclear_herd.length; i++)
        {
            if(nuclear_herd[i].update())
            {
                updatePosition(nuclear_herd[i]);
                nuclear_herd[i].draw();
            }
        }
        for (var i = 0; i < explosions.length; i++)
        {
            if (explosions[i].active)
            {
                explosions[i].draw();
                explosions[i].nextFrame();
            }
            else
            {
                explosions.splice(i,1);
            }
        }
        ctx.font = "bold 40px Arial";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.strokeText("Congratulations!", 265, 100);
        ctx.fillText("Congratulations!", 265, 100);
        ctx.font = "bold 25 Arial";
        ctx.fillText("No matter how baaaaad you did, you still win!", 25, 200);
        ctx.strokeText("No matter how baaaaad you did, you still win!", 25, 200);
        ctx.fillText("Herded: " + herded, 350, 300);
        ctx.strokeText("Herded: " + herded, 350, 300);
        ctx.fillText("Exploded: " + exploded, 320, 350);
        ctx.strokeText("Exploded: " + exploded, 320, 350);
        ctx.fillText("Press F5 to restart", 260, 400);
        ctx.strokeText("Press F5 to restart", 260, 400);
        window.requestAnimationFrame(gameOverLoop);
    }


    //================================================initialization=====================================================
    //set up canvas
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);


    // Should be the same in css
    var width = 900;
    var height = 600;

    //Set counters
    var exploded = 0;
    var herded = 0;

    //Set Constants
    var playerSpeed = 3;
    var maxBaa = 5;
    var runDist = 20;

    //Add music
    //var baa_sound = new Audio("baaaa.wav");
    var baaarray = [];
    for (var i = 0; i < maxBaa; i++)
    {
        baaarray.push(new Audio("baaaa.wav"));
    }
                      
    var baa_counter = 0;


    //Add images
    var sheep_img = new Image();
    sheep_img.src = "sheep_2.png";
    var shear_img = new Image();
    shear_img.src = "shear_2.png";


    var boop =  new Audio("boop.wav");


    //set variables
    var w        = false;
    var a        = false;
    var s        = false;
    var d        = false;
    var spacebar = false;

    //temporary variable
    var tempVelocity;
    var tempCircle;

    //create the objects in the world

    var player = new entity(50, 50, 15, 0, 0);
    var walls = new Array();
    var herd = new Array();
    var explosions = new Array();
    var barn = new House(width/2, height/2-70, 30);

    walls.push(new wall(150, 200, 40, 100));
    walls.push(new wall(300, 550, 40, 150));
    walls.push(new wall(450, 495, 150, 40));
    walls.push(new wall(600, 550, 40, 150));
    //first wall is house collider
    walls.push(new wall(width/2, height/2-40, 60, 60));
    //outside walls
    walls.push(new wall(0, height/2, 27, height));
    walls.push(new wall(width, height/2, 27, height));
    walls.push(new wall(width/2, height, width, 27));
    walls.push(new wall(width/2, 0, width, 27));


    // in U and front of barn
    herd.push(new Sheep( 450, 400, 15, 15, 5, 0, 0));//old radius 10
    herd.push(new Sheep( 500, 550, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 400, 550, 15, 15, 5, 0, 0));

    // top right corners
    herd.push(new Sheep( 720, 200, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 700, 200, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 720, 220, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 720, 240, 15, 15, 5, 0, 0));

    // near player
    herd.push(new Sheep( 110, 200, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 220, 200, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 220, 240, 15, 15, 5, 0, 0));

    // bottom right
    herd.push(new Sheep( 800, 500, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 780, 500, 15, 15, 5, 0, 0));
    herd.push(new Sheep( 780, 520, 15, 15, 5, 0, 0));

    /*for(var i = 0; i < 10000; i++)
        herd.push(new Sheep(Math.random() * width, Math.random() * height, 15, 15, 5, 0, 0));/**/

    //set up menus to work
    var gameOver = false;
    var end_counter = 0;

    var start_herd = new Array();


    for(var i = 0; i < 100; i++)
        start_herd.push(new Sheep(Math.random() * width, Math.random() * height, 15, 15, 5, 0, 0));

    var nuclear_herd = [];
    for(var i = 0; i < 100; i++)
            nuclear_herd.push(new Sheep(Math.random() * width, Math.random() * height, 15, 15, 5, 0, 0));



              
    //===================================================end initialization=================================



        

    window.onkeydown = function (evt) 
    {
        // w key
        if (evt.keyCode == 87) {
            w = true;
        }
        // s key
        if (evt.keyCode == 83) {
            s = true;
        }
        // a key
        if (evt.keyCode == 65) {
            a = true;
        }
        // d key
        if (evt.keyCode == 68) {
            d = true;
        }
        
        if (evt.keyCode == 32) {
            spacebar = true;
        }
    };

    window.onkeyup = function (evt)
    {
        // w key
        if (evt.keyCode == 87) {
            w = false;
        }
        // s key
        if (evt.keyCode == 83) {
            s = false;
        }
        // a key
        if (evt.keyCode == 65) {
            a = false;
        }
        // d key
        if (evt.keyCode == 68) {
            d = false;
        }
        
        if (evt.keyCode == 32) {
            spacebar = false;
        }
    };
    startScreenLoop();
}