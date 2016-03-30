$(document).ready(function(){
    //global constants
    var context;
    var width = 300;
    var height = 400;

    var snakeLength = 3;
    var level = 1;
    var sqSize = 10;

    /* *************************** /
     * specify the initial snake alignment and direction of movement
     * Snake is starts horizontal moving towards its right
     * *************************** */
    var centerX = Math.floor(width / 2);
    var centerY = Math.floor(height / 2);
    var bodyX = new Array(centerX, centerX-sqSize, centerX-2*sqSize);
    var bodyY = new Array(centerY, centerY, centerY);

    var vX = new Array(1, 1, 1);    //array to manage horizontal velocity for snake body
    var vY = new Array(0, 0, 0);    //array to manage vertical velocity for snake body

    //variables used to put rats on the canvas
    var rX;
    var rY;
    var isBigRat = false;

    //keeping the scores
    var score = 0;
    var scoreDiv;                // to hold the context of div used to display score and level

    var eaten = true;               // to check if new rat needs to be placed
    var gameOver = false;           // to check if the game is over and enable control to restart the game

    var controlsDiv;                // to hold the context of div used to display game controls

//wall size and start point
    var wallHeight = 30;
    var wallWidth = 40;

    var wall1X = 100;
    var wall1Y = 100;

    var wall2X = 150;
    var wall2Y = 250;

//stage
    var endlessMode = false;
    var stage = 0;
    /* *************************** /
     * Initialize the game variables and the game context
     * and then sends the game to the main game loop
     * *************************** */
    function init()
    {

        context = document.getElementById("canvas").getContext("2d");

        //make play button became restart button
        document.getElementById("playBtn").removeEventListener("click",init,true);
        document.getElementById("playBtn").addEventListener("click",restart,true);

        drawCanvasBoundary();

        //draws snake
        drawSnake();

        //setTimeout calls the game loop i.e. gameProcess function after the specified time
        intervalId = setTimeout(gameProcess, 1000/6);

        //get handle to the div containing our score and level details
        scoreDiv = document.getElementById("score");

        //get handle to the div containing our score and level details
        controlDiv = document.getElementById("control");

        //specify the function to handle the keypress
        window.onkeydown = keydown;

        $("#endlessMode").click(function(){
            setStage(-1);
        });
        $("#stage0").click(function(){
            setStage(0);
        });
        $("#stage1").click(function(){
            setStage(1);
        });
        $("#stage2").click(function(){
            setStage(2);
        });
    }


    function clear()
    {
        context.clearRect(0,0,width,height);
    }

    /* *************************** /
     * Restart the game
     * ************************** */
    function restart()
    {
        bodyX = new Array(150, 150-sqSize, 150-2*sqSize);
        bodyY = new Array(200, 200, 200);

        vX = new Array(1, 1, 1);
        vY = new Array(0, 0, 0);

        snakeLength = 3;

        score = 0;
        if(endlessMode == false)level  = 1;

        eaten = true;

        scoreDiv.innerHTML = "Score: " +score+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Level: "+level;
        controlDiv.innerHTML = "Controls: W = Up; A = Left; S = Down; D = Right";
        clearTimeout(intervalId);
        intervalId = setTimeout(gameProcess, 1000/6);
        var element = document.getElementById('playBtn');
        if (element != null) {
            element.parentNode.removeChild(element);
        }
    }


    function keydown(e)
    {
        if((e.keyCode == 37 || e.keyCode == 65) && vX[0] != 1)       //left arrow - Changed to 'a'
        {
            vX[0] = -1;
            vY[0] = 0;
        }
        else if ((e.keyCode == 38 || e.keyCode == 87) && vY[0] != 1) //up arrow - changed to 'w'
        {
            vY[0] = -1;
            vX[0] = 0;
        }
        else if ((e.keyCode == 39 || e.keyCode == 68) && vX[0] != -1) //right arrow - changed to 'd'
        {
            vX[0] = 1;
            vY[0] = 0;
        }
        else if ((e.keyCode == 40 || e.keyCode == 83) && vY[0] != -1) //down arrow - changed to 's'
        {
            vY[0] = 1;
            vX[0] = 0;
        }
        else if (e.keyCode == 13  && gameOver == true)
        {
            gameOver = false;
            restart();
        }
    }


    function drawCanvasBoundary()
    {
        context.fillStyle="#19DB5A";           //set canvas color to be white
        context.fillRect(0,0,width,height); //draws a rectangle of canvas size filled with white color. This serves as our background
        //context.fill();

        /* */
        //context.beginPath();
        context.strokeStyle="#000";
        context.strokeRect(0,0,width,height);
        //context.closePath();
        //context.fill();
        /* */
    }


    function drawPoint(x,y,color)
    {
        if (color==undefined)
            color="#000";
        // First draw a square for size "sqSize" filled with black
        context.fillStyle = color;
        context.fillRect(x,y,sqSize, sqSize);
        context.fill();

        // Then draw the square boundary in white
        context.strokeStyle="#FFFFFF";
        context.strokeRect(x,y,sqSize, sqSize);
    }

//set Stage
    function setStage(st){
        stage = st;
        endlessMode = false;
        if (st == -1){
            setEndlessMode();
        }
        restart();
    }

    function setEndlessMode(){
        endlessMode = true;
        var selectedLevel = prompt("Xin moi chon level ban muon choi");
        if (selectedLevel) {
            selectedLevel = parseInt(selectedLevel);
            if (selectedLevel == NaN){
                selectedLevel = prompt("Vui long nhap dung level(nhap vao so nguyen)");
            }
            level = selectedLevel;
        }
    }

//draw Wall
    function drawWall(){
        stage = stage;
        if (stage == 1){
            for(i = wall1X; i < wall1X + wallWidth; i += sqSize)
                for(j = wall1Y; j < wall1Y + wallHeight; j += sqSize){
                    drawPoint(i,j)
                }
        }

        if (stage == 2){
            for(i = wall1X; i < wall1X + wallWidth; i += sqSize)
                for(j = wall1Y; j < wall1Y + wallHeight; j += sqSize){
                    drawPoint(i,j)
                }

            for(i = wall2X; i < wall2X + wallWidth; i += sqSize)
                for(j = wall2Y; j < wall2Y + wallHeight; j += sqSize){
                    drawPoint(i,j)
                }
        }
    }


    function drawSnake()
    {
        for(var i=0; i < snakeLength; i++)
            drawPoint(bodyX[i],bodyY[i]);
    }



//Redraw playBtn
    function reDrawPlayBtn(){
        var element = document.getElementsByClassName('modal-body')[0];
        var node = document.createElement('button');
        node.setAttribute('class', 'btn btn-primary');
        node.setAttribute('id', 'playBtn');
        node.innerHTML = '&#9658';
        element.appendChild(node);
        document.getElementById("playBtn").addEventListener("click",function(){
            restart();
            var element = document.getElementById('playBtn');
            element.parentNode.removeChild(element);
        },true);
    }

    function checkCollision()
    {
        if(snakeLength > 4)
        {
            if(checkSelfCollision(bodyX[0],bodyY[0]))
            {
                scoreDiv.innerHTML = "Score: " +score+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Level: "+level+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Game Over</b>";
                controlDiv.innerHTML = "Press \"Enter\" to restart";
                gameOver = true;
                clearTimeout(intervalId);
                reDrawPlayBtn();
            }
        }
        if(checkSnakeHitWall(bodyX[0], bodyY[0])){
            scoreDiv.innerHTML = "Score: " +score+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Level: "+level+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Game Over</b>";
            controlDiv.innerHTML = "Press \"Enter\" to restart";
            gameOver = true;
            clearTimeout(intervalId);
            reDrawPlayBtn();
        }
    }


    function checkSelfCollision(x, y)
    {
        for (var i = 4; i < snakeLength; i++)
            if(x == bodyX[i] && y == bodyY[i])
            {
                return true;
            }
        return false;
    }

//Check if snake hit wall
    function checkSnakeHitWall(x,y){
        switch(stage){
            case 1:
                if (x >= wall1X && x < (wall1X + wallWidth)){
                    if (y >= wall1Y && y < (wall1Y + wallHeight)){
                        return true;
                    }
                    else return false;
                }
                else return false;
                break;
            case 2:
                if (x >= wall1X && x < (wall1X + wallWidth)){
                    if (y >= wall1Y && y < (wall1Y + wallHeight)){
                        return true;
                    }
                    else return false;
                }
                else if (x >= wall2X && x < (wall2X + wallWidth)){
                    if (y >= wall2Y && y < (wall2Y + wallHeight)){
                        return true;
                    }
                    else return false;
                }
                else return false;
                break;
            default:
                return false;
        }
    }

    /* *************************** /
     * Iterates through all body parts and compares their x & y coordinates
     * with those of new Rat location sent as the parameter(x & y)
     * ************************** */
    function checkFoodCollision(x, y)
    {
        for (var i = 0; i < snakeLength; i++)
            if(x == bodyX[i] && y == bodyY[i])
            {
                return true;
            }
        return false;
    }


//Check if rat inside wall
    function checkRatInsideWall(x,y){
        switch(stage){
            case 1:
                if (x >= wall1X && x <= (wall1X + wallWidth))
                    if (y >= wall1Y && y <= (wall1Y + wallHeight)){
                        return true;
                    }
                break;
            case 2:
                if (x >= wall1X && x <= (wall1X + wallWidth)){
                    if (y >= wall1Y && y <= (wall1Y + wallHeight)){
                        return true;
                    }
                }
                else if (x >= wall2X && x <= (wall2X + wallWidth))
                    if (y >= wall2Y && y <= (wall2Y + wallHeight)){
                        return true;
                    }
                break;
            default:
                return false;
        }
    }
    /* *************************** /
     * If the rat was eaten, calculates new rat coordinates,
     * check for collision with snake body and place it on canvas
     * ************************** */
    function placeRat()
    {
        var ratColor;
        if(eaten)
        {
            rX = Math.floor(width*Math.random()/sqSize)*sqSize;
            rY = Math.floor(height*Math.random()/sqSize)*sqSize;
            while(checkRatInsideWall(rX,rY)){
                rX = Math.floor(width*Math.random()/sqSize)*sqSize;
                rY = Math.floor(height*Math.random()/sqSize)*sqSize;
            }
            if(checkFoodCollision(rX,rY))
                placeRat();
            else
                eaten = false;
        }
        if(score%50 == 0 && score != 0) isBigRat = true;
        else isBigRat = false;
        if(isBigRat == true) {
            ratColor = "#ff0000";
            drawPoint(rX, rY,ratColor);
        }
        else drawPoint(rX, rY);
    }

    /* *************************** /
     * If the rat was eaten, it calculates new rat coordinates,
     * check for collision with snake body and places new rat on canvas
     * ************************** */
    function moveSnake()
    {
        for(var i=0; i < snakeLength; i++)
        {
            bodyX[i] += (vX[i]*sqSize);
            bodyY[i] += (vY[i]*sqSize);
            if (bodyX[i] < 0) {
                bodyX[i] = width;
            } else if (bodyX[i] == width) {
                bodyX[i] = 0;
            }

            if (bodyY[i] < 0) {
                bodyY[i] = height;
            } else if (bodyY[i] == height) {
                bodyY[i] = 0;
            }
        }

        for(var i=snakeLength-1; i>0; i--)
        {
            vX[i] = vX[i-1];
            vY[i] = vY[i-1];
        }
        eatRat();
    }



    /* *************************** /
     * Checks whether the head has reached the rat
     * in case its true, sets flag for calculation of new Rat location
     * and calculates and add a body part at the tail increasing the snakeLength
     * Thereafter, it increments score and check if level needs to be incremented
     * ************************** */
    function eatRat()
    {
        if(bodyX[0] == rX && bodyY[0] == rY)
        {
            eaten = true;
            // calculate the new X & Y location for tail
            var newX = bodyX[snakeLength-1]-vX[snakeLength-1]*sqSize;
            var newY = bodyY[snakeLength-1]-vY[snakeLength-1]*sqSize;

            //Add the new tail part in respective arrays
            bodyX.push(newX);
            bodyY.push(newY);

            //Initial velocity of the new part will be same as that of old tail
            //so just copy from last part
            vX.push(vX[snakeLength-1]);
            vY.push(vY[snakeLength-1]);

            snakeLength++;      // increment the snakelength

            if (isBigRat == true){
                score += 20;
            }
            else{
                score += 10;        // increment score
            }
            // check and increment level
            if((score%100) == 0 && (endlessMode == false))
                level++;

            // update score on webpage
            scoreDiv.innerHTML = "Score: " +score+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Level: "+level;
        }
    }

    //Wall

    /* *************************** /
     * The update and draw game loop
     * ************************** */
    function gameProcess()
    {
        // Sets the interval for next refresh. Game level defines the rate of refresh and thereby increase speed with level
        intervalId = setTimeout(gameProcess, 1000/(6*level));
        clear();
        drawCanvasBoundary();

        drawWall();

        placeRat();

        moveSnake();

        checkCollision();

        drawSnake();
    }

    $("#playBtn").click(function(){
        init();
        $(this).remove();
    });
    $("#shareBtn").click(function(){
        FB.getLoginStatus(function(response){
            if(response.status == 'connected'){
                FB.api(
                    '/me/feed',
                    'post',
                    {message: "I've reached "+score+" point in Snake game. Play with me at: http://snake-game.co.nr/"},
                    function(response){
                        if (!response || response.error) {
                            alert('An error occurred');
                        }
                        else {
                            alert('Successful!');
                        }
                    });
            }
            else{
                FB.login(function(response){},{scope: 'publish_actions'});
            }
        });
    });
});


//load FB API
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=992532850788565";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));