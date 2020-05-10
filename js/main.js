/*=========================================================================*/

/*HTML elements*/
let nar = idCatch("nar");
let nar2 = idCatch("nar2");
let scoreScreenEnd = idCatch("score-screen-end");
let gameWindow = idCatch("wrap");//Game Window div
let start = idCatch("start");
let scoreScreen = idCatch("score-screen");
let warning = idCatch("warning");
let home = idCatch("home");
let crcControl = idCatch("crc-control");
let leftC = idCatch("leftC");
let rightC = idCatch("rightC");
let reviews = idCatch("reviews");
let rightMenu = idCatch("right-menu");
let reviewsBack = idCatch("rev-back");
let leftMenu = idCatch("left-menu");
let scoreBack = idCatch("score-back");
let scores = idCatch("scores");
let scoresBack = idCatch("sc-back");
let submitContainer = idCatch("submit-container");
let submit = idCatch("submit");
let shootContainer = idCatch("shoot-container");

/*Player div and boxes*/
let box1 = idCatch("box1");
let box2 = idCatch("box2");
let box3 = idCatch("box3");
let box4 = idCatch("box4");
let box5 = idCatch("box5");
let pleja = idCatch("player");

/*Global variable used for data transfer to local storage*/
let transfer = 0;

/*Position of player onload*/
player.style.left = "425px";

/*Heights*/
let dangerZone = 550;/*After this point, the player can collide with other boxes*/
let gameWindowHeight = 600;

/*A global variable that signifies the left-most position the box can have.
Width of the game Window is 900px and width of a box is 50px.*/
let maxLeftPosition = 850;

/*startGame() and cannonMove()/movement() connection. When endOfGame == false,
cannonMove() and movement() receive that information and stop executing.*/
let endOfGame = true;

/*Triple G is a variable that will point to a shoot-div when the event is triggered.
Triple G-boolean is informing our functions when the shoot-div is moving.*/
let GGG = null;
let GGGb = false;

/*Important global variable. Its purpose is the following: 
when == true, that means that some animation or game is in progress,
so it is used as a control in many button events and functions so that 
they would freeze execution of their code until that animation or game 
finishes. Then it is set to false, usually at the end of an events and game.*/
let animaOngoing = true;

/*opacityControl is used to give a signal to an opacity-changing function 
opPlusWithControl() that it should terminate becouse user changed 
the page where that element was present*/
let opacityControl = false;

/*=========================================================================*/

/*Routing Section*/
function goToHome(){
    displayOn(nar, start, pleja, crcControl);
    displayOff(box1, box2, box3, box4, box5, nar2, home, submitContainer);
    rightC.style.left = "0px";
    rightC.style.width = "0px";
    leftC.style.left = "0px";
    leftC.style.width = "0px";
    lightsaber(rightC);
    lightsaber(leftC);
}

function goToScores() {
    displayOff(box1, box2, box3, box4, box5, nar2, home, nar, start,
        pleja, crcControl);
    displayOn(scores);
    opacityControl = false;
    opPlusWithControl(scores);
}

function goToReviews() {
    displayOff(box1, box2, box3, box4, box5, nar2, home, nar, start,
        pleja, crcControl);
    displayOn(reviews);
    opacityControl = false;
    opPlusWithControl(reviews);
}

home.addEventListener("click", goToHome);
rightMenu.addEventListener("click", () => {
    if (animaOngoing == false) {
        animaOngoing = true;
        goToReviews();
    }
});

leftMenu.addEventListener("click", () => {
    if (animaOngoing == false) {
        animaOngoing = true;
        goToScores();
        if (localStorage.length == 0) {
            idCatch("no").style.display = "block";
        }
    }
});

reviewsBack.addEventListener("click", () => {
    displayOff(reviews);
    goToHome();
    reviews.style.opacity = 0;
    animaOngoing = false;
    opacityControl = true;
});

scoresBack.addEventListener("click", () => {
    displayOff(scores);
    ups.style.display = "none";
    animaOngoing = true;
    goToHome();
    scores.style.opacity = 0;
    displayOff(idCatch("no"));
    opacityControl = true;
    for (let i = 0; i < sc.length; i++) {
        sc[i].style.backgroundColor = "rgb(47, 47, 158)";
    }
});

/*Display functions*/
function displayOff(...arg){
    for(let i = 0; i < arg.length; i++){
        arg[i].style.display = "none";
    }
}

function displayOn(...arg){
    for(let i = 0; i < arg.length; i++){
        arg[i].style.display = "block";
    }
}

/*=========================================================================*/

/*Browser height check. If it isn't meet, a warning is displayed.*/
if(window.innerHeight < 600){
    displayOff(start, nar, pleja, crcControl);
    displayOn(warning);
}

function randomLeftBoxPosition(x){
    x.style.left = Math.round(Math.random()*maxLeftPosition) + "px";
}

function topBoxPositionZero(x){
    x.style.top = "0px";
}

/*Top positions of divs at the beginning of the game*/
for(let i = 1; i <= 5; i++){
    topBoxPositionZero(idCatch("box" + i));
}

/*=========================================================================*/

/*Game-starting events*/

/*Shooting event*/
window.addEventListener("keypress", function (e) {
    if (e.keyCode === 32 && endOfGame == false) { 
        shootsFired();
    }
})

/*Event on #start button that starts the game*/
start.addEventListener("click", () => {
    if (animaOngoing == false) {
        animaOngoing = true;
        displayOff(start, nar, nar2, crcControl, submitContainer);
        rightC.style.left = "0px";
        rightC.style.width = "0px";
        leftC.style.left = "0px";
        leftC.style.width = "0px";
        startGame();
    }
});

/*Option to start the game with "space" or "enter" buttons on keyboard*/
window.addEventListener("keypress", function (e) {
   if (animaOngoing == false) {
       if (e.keyCode === 32 || e.keyCode === 13) {
           animaOngoing = true;
           displayOff(start, nar, nar2, crcControl, submitContainer);
           rightC.style.left = "0px";
           rightC.style.width = "0px";
           leftC.style.left = "0px";
           leftC.style.width = "0px";
           startGame();
       }
   }
});

/*=========================================================================*/

/*Main part of the game, function where everything comes together*/
function startGame() {
if (animaOngoing == true) {   

    playerMovement();
    cannonMove();
    endOfGame = false;
    let boxFallCallCounter = 0;
    let points = 0;
    displayOff(home);
    displayOn(shootContainer);

    let M = setInterval(function () {
        pointsFunction();
        boxFall(box1, 12);
        boxFall(box2, 17);
        boxFall(box3, 7);
        boxFall(box4, 9);
        boxFall(box5, 15);
    }, 20);
    
    for(let i = 1; i <= 5; i++){
         randomLeftBoxPosition(idCatch("box" + i));
    }

    function boxFall(x, y){
        
        displayOn(x);
        let r = parseInt(x.style.top);

        if(r > gameWindowHeight - 20){
            r = 0;
            x.style.top = "0px";
            x.style.left = Math.round(Math.random()*maxLeftPosition) + "px";

        }  else if(  ((parseInt(x.style.top) > dangerZone) && 
            (Math.abs(parseInt(x.style.left) - parseInt(pleja.style.left)) < 50)) || 
            /*These set of the above conditions represent the cases when the box hits the player*/
            ((trackerHeight > 620) && 
            (((((trackerLeft + 25) - parseInt(pleja.style.left)) < 50) && 
            (((maxLeftPosition - (trackerLeft - 25)) - (maxLeftPosition - (parseInt(pleja.style.left)))) < 50))))  )
            /*These set of the above conditions represent the case when the laser hits the player*/ {  
            
            /*Endgame procedures*/
            endOfGame = true;
            animaOngoing = false;
            displayOn(start, nar2, submitContainer);
            home.style.display = "flex";
            displayOff(shootContainer);
            start.innerHTML = "RETRY";
            trackerLeft = 0;
            blast.style.height = "0px";
            scoreScreenEnd.innerHTML = points;
            transfer = points;
            scoreScreen.innerHTML = ""; 
            boxFallCallCounter = 0;
            points = 0;
            clearInterval(M);/*Ending of all boxFall() functions*/

            for(let i = 1; i <= 5; i++){
                topBoxPositionZero(idCatch("box" + i));
            }

        } else if(r >= 0){
            if(GGGb) { /*Conditions that check if a laser and box made contact.*/
                if( (Math.abs(parseInt(GGG.style.left) - parseInt(x.style.left)) <= 13 ||
                    (Math.abs(parseInt(x.style.left) + 50 - parseInt(GGG.style.left)) <= 13) ||
                    (parseInt(GGG.style.left ) - parseInt(x.style.left) > 13 &&
                    parseInt(GGG.style.left ) - parseInt(x.style.left) < 34)) && /*Conditions involving x-axis*/
                    (Math.abs(parseInt(GGG.style.top) - parseInt(x.style.top)) <= 50) ){/*Conditions involving y-axis*/
                    
                    debrisField(wrap, GGG);
                    x.style.top = gameWindowHeight + 100 + "px";

                } else {
                    r += y;
                    x.style.top = r + "px";
                }
            } else { 
                r += y;
                x.style.top = r + "px";
            }
        }
    }

    /*Point system*/
     /*Because boxFall() is called 50 times every second, we set up boxFallCallCounter
     to keep track of how many times if the function called. When that is equivalent to
     one second, that is one point.*/
    function pointsFunction(){

        boxFallCallCounter++;
        if((boxFallCallCounter%50) == 0){
            boxFallCallCounter = 0;
            points++;
            scoreScreen.innerHTML = points;
        }
    }
}}

/*=========================================================================*/

/*Player movement*/

/*I have created two global variables that will change according to
the event in which they are used. leftWatcher will be 1 when a left
arrow key is pressed, while rightWatcher will be 0, and vice versa.
They are used in playerMovement(), in inner function go() that is called
in setInterval(). "parametar" is the variable being changed when 
event happens.*/

let leftWatcher = 0;
let rightWatcher = 0;

window.addEventListener("keydown", () => {

    if (event.keyCode == 39) {
        leftWatcher = 0;
        rightWatcher = 1;
    } else if (event.keyCode == 37) {
        rightWatcher = 0;
        leftWatcher = 1;
    } 
});

function playerMovement() {

    rightWatcher = 0;
    leftWatcher = 0;
    let parametar = 0;
    let R = setInterval(go, 20);

    function go(){
        if(endOfGame){
            clearInterval(R);
        } else {

            if(rightWatcher == 1){
                parametar = 8;
            } else if (leftWatcher) {
                parametar = -8;
            }

            if(parseInt(pleja.style.left) >= maxLeftPosition){
                pleja.style.left = maxLeftPosition + "px";
            }
            if (parseInt(pleja.style.left) <= 0) {
                pleja.style.left = 0 + "px";
            }
            pleja.style.left = parseInt(pleja.style.left) + parametar + "px";
        }
    }
}

/*=========================================================================*/

/*Background animation involving falling lines*/

/*Lines*/
let linesArray = [];
let lineNum = 12;

for(let i = 1; i <= lineNum; i++){
    linesArray[i] = createElement("div", gameWindow);
    linesArray[i].style.margin = 0;
    linesArray[i].style.position = "absolute";
    linesArray[i].style.backgroundColor = "white";
    linesArray[i].style.zIndex = 0;
    linesArray[i].style.top = "-150px";
    linesArray[i].style.width = Math.round(Math.random()*2) + 1 + "px";
    linesArray[i].style.height = Math.round(Math.random()*150) + 1 + "px";
}

/*Random left position of a line*/
function randomLeftLinePosition(linesArray){
    linesArray.style.left = Math.round(Math.random()*(maxLeftPosition + 20)) + "px";
}

/*Array that holds number of milliseconds as elements*/
let b = [];
for(let i = 1; i <= lineNum; i++){
    b[i] = Math.random()*15 + 5;
}

/*A function for background animation of lines*/
function backgroundLines(){

    for(let i = 1; i <= lineNum; i++){
        requestAnimationFrame(() => {
            falling(linesArray[i], b[i]);
        });
    }

    for(let i = 1; i <= lineNum; i++){
        randomLeftLinePosition(linesArray[i]);
    }

    function falling(x, y){

        let r = parseInt(x.style.top);
        let h = parseInt(x.style.height);

        if(r > window.innerHeight){
            r = 0;
            x.style.height = (Math.round(Math.random()*150) + 1) + "px";
            h = parseInt(x.style.height);
            x.style.top = -150 + "px";
            x.style.left = Math.round(Math.random()*820) + "px";
            requestAnimationFrame(() => {
                falling(x, y);
            });
        } else if(r >= -150){
            r += y;
            x.style.top = r + "px";
            requestAnimationFrame(() => {
                falling(x, y);
            });
        }
    }
}

backgroundLines();

/*=========================================================================*/

/*Fade-in intro and opacity functions are defined here*/
nar.style.opacity = 0;
start.style.opacity = 0;

function opPlus(x){

    let y = 0;
    let M = setInterval(opacityChange, 20);

    function opacityChange(){
        if(y > 1){
            clearInterval(M);
        } else {
            y += 0.01;
            x.style.opacity = y;
        }
    }
}

function opPlusWithControl(x){

    let y = 0;
    let M = setInterval(opacityChange, 20);

    function opacityChange(){

        if((y > 1) || (opacityControl == true)){
            if (opacityControl == true) {
                x.style.opacity = 0;
            }
            opacityControl = false;
            clearInterval(M);
        } else {
            y += 0.01;
            x.style.opacity = y;
        }
    }
}

/*Decreases the opacity of an element and deletes it at the end. Used for
temporary elements.*/
function opacityDecreaseAndDelete(x) {

    var M = setInterval(opacityChange, 50);
    x.style.opacity = 1;

    function opacityChange() {

        if(x.style.opacity < 0) {
            clearInterval(M);
            x.parentNode.removeChild(x);
        } else {
            x.style.opacity -= 0.05;
        }
    }
}

function opPlusStart(x){

    let y = 0;
    let M = setInterval(opacityChange, 50);

    function opacityChange(){
        if(y > 1){
            clearInterval(M);
        } else {
            y += 0.05;
            x.style.opacity = y;
        }
    }
}

/*The sequence of events onload*/
setTimeout(function(){
    opPlusStart(start);
    opPlus(nar);
    opPlus(crcControl);
    setTimeout(() => {
        lightsaber(idCatch("rightC"));
        lightsaber(idCatch("leftC"));
    }, 1100);
}, 200);

/*=========================================================================*/

/*Cannon*/
let cannon = idCatch("cannon");
let blast = idCatch("blast");
cannon.style.left = 425 + "px";

/*The global variable that represents the left position of the cannon*/
let trackerLeft = 455; 
/*The global variable that represents the height of the blast*/
let trackerHeight = 0;

function cannonMove(){

    /*"Smooth" is a counter called "smooth" because it helps regulate
    the movement and firepower of the cannon, thus making the cannons 
    behavior appear more smooth and intelligent. When smooth%20 == 0, 
    it is randomly decided will the cannon go left or right by setting 
    the value of "sign", and when smooth%50 == 0, it is deterministically 
    set to fire a laser.*/
    let smooth = 0;
    let factorOfMoving = true;
    let sign = Math.round(Math.random());
    let blastSpeed = 0;
    displayOn(cannon);
    let l = parseInt(cannon.style.left);

    let M = setInterval(cM, 20);

    function cM() {

        if(endOfGame == true){

            /*Endgame procedure*/
            clearInterval(M);
            displayOff(cannon);
            displayOff(blast);
            blast.style.height = "0px";
            trackerHeight = 0;

        } else {

            l = parseInt(cannon.style.left);
            smooth++;

            if(factorOfMoving == true){

                /*The part in which is decided when the blast occurs and
                does it go left or right.*/
                if(smooth%20 == 0){
                    sign = Math.round(Math.random());
                } else if(smooth%50 == 0){
                    factorOfMoving = false;
                    displayOn(blast);
                    blast.style.height = "0px";
                }

                /*Movement part*/
                if(parseInt(cannon.style.left) >= 0){
                    if(parseInt(cannon.style.left) >= maxLeftPosition){
                        sign = 0;
                        cannon.style.left = parseInt(cannon.style.left) -15 + "px";
                        trackerLeft = parseInt(cannon.style.left);
                    } else {

                        if(sign == 1){
                            cannon.style.left = l + 5 + "px";
                            trackerLeft = parseInt(cannon.style.left);
                    
                        } else {
                            cannon.style.left = l - 5 + "px";
                            trackerLeft = parseInt(cannon.style.left);
                        }
                    }

                } else {
                    sign = 1;
                    cannon.style.left = 15 + "px";
                    trackerLeft = parseInt(cannon.style.left);
                }
                blast.style.left = trackerLeft + 25 + "px";

            /*Blast part, when movement ceases and laser comes out of the cannon.
            It is initiated when factorOfMoving == false.*/
            } else if (factorOfMoving == false) {

                if(parseInt(blast.style.height) > 650){
                    blastSpeed = 0;
                    factorOfMoving = true;
                    displayOff(blast);
                    blast.style.height = "0px";     
                    trackerHeight = 0;           
                } else {
                    blastSpeed += 3;
                    blast.style.height = parseInt(blast.style.height) + blastSpeed + "px";
                    trackerHeight = parseInt(blast.style.height);
                }
            }

        }
    }
}

/*=========================================================================*/

/*Shooing section*/
let shootBar = idCatch("shoot-bar");
let shootMeter = idCatch("shoot-meter");
let slide = true;

/*A function that handles movement of a shoot-meter*/
function sliding(x) {
    x.style.top = 150 + "px";
    slide = false;
    requestAnimationFrame(f);
    function f() {
        if (endOfGame == false) {
            if(parseInt(x.style.top) > 0) {
                x.style.top = parseInt(x.style.top) - 2 + "px";
                requestAnimationFrame(f);
            } else {
                slide = true;
            }
        } else {
            x.style.top = 0 + "px";
            slide = true;
        }
    }
}

/*A function that animates explosion after the impact*/
function debrisField(parent, obj) {

    let p = [];
    let color = ["white", "white", "gold"];
    let debriNum = 8;

    for (let i = 0; i < debriNum; i++) {
        p[i] = createElement("div", parent);
        p[i].style.width = "2px";
        p[i].style.height = "0px";
        p[i].style.position = "absolute";
        let c = Math.round(Math.random()*3);
        p[i].style.boxShadow = "0px 0px 20px 7px " +  color[c];
        p[i].style.backgroundColor = color[c];
        p[i].style.position = "absolute";
        p[i].style.top = parseInt(obj.style.top) - 20 + "px";
        p[i].style.left = parseInt(obj.style.left) + "px";
        p[i].style.transform = "rotate(" + (Math.random()*360) + "deg)";
        p[i].style.opacity = 1;
    }

    for (let i = 0; i < p.length; i++) { 

        let limit = Math.round(Math.random()*30 + 70);
        requestAnimationFrame(f);

        function f(x, y, parent) {
            if (parseInt(p[i].style.height) < limit) { 
                p[i].style.height = 12 + parseInt(p[i].style.height) + "px";
                requestAnimationFrame(f);
            } else {
                cancelAnimationFrame(f);
                opacityDecreaseAndDelete(p[i]);
            }
        }
    }
}

/*A function that creates and animates bullets that the player fires*/
function shootsFired() {
    if(slide) {
        sliding(shootMeter);
        let el = createElement("div", wrap);
        GGG = el;
        GGGb = true;
        el.style.position = "absolute";
        el.style.top = gameWindowHeight - 50 + "px";
        el.style.left = parseInt(pleja.style.left) + 20 + "px";
        el.style.height = "50px";
        el.style.width = "10px";
        el.style.borderRadius = "10px";
        el.style.backgroundColor = "firebrick";
        el.style.boxShadow = "0px 0px 3px 3px red";
        el.style.borderLeft = "2px solid white";
        el.style.borderTop = "2px solid white";
        el.style.borderRight = "2px solid white";

        let M = setInterval(move, 20);

        function move() {
            if(parseInt(el.style.top) > 0 && endOfGame == false) {
                el.style.top = parseInt(el.style.top) - 10 + "px";
            } else {
                GGG = null;
                GGGb = false;
                el.parentNode.removeChild(el);
                clearInterval(M);
            }
        }
    }
}

/*=========================================================================*/

/*Setting stars in the background*/

let starsArray = [];
let starNum = 500;

for(let i = 0; i < starNum; i++){
    starsArray[i] = createElement("div", document.body);
    starsArray[i].style.position = "absolute";
    let p = Math.round(Math.random()) ? 1 : 2;
    starsArray[i].style.width = p + "px";
    starsArray[i].style.height  = p + "px";
    starsArray[i].style.backgroundColor = "white";
    starsArray[i].style.borderRadius = "50%";
    if (Math.round(Math.random()*19) == 10) {
        let p1 = Math.round(Math.random()*5) + 10;
        let p2 = Math.round(Math.random()*2) + 2;
        starsArray[i].style.boxShadow = "0px 0px "
            + p1 + "px " + p2 + "px white";
    }
}

/*Positions of stars in the background*/
function starPosition(x) {
    x.style.top = Math.random()*100 + "%";
    x.style.left = Math.random()*100 + "%";
}

for(let i = 0; i < starNum; i++){
    starPosition(starsArray[i]);
}

/*=========================================================================*/

/*Elements that are being used for lightsaber animation*/
idCatch("rightC").style.left = "0px";
idCatch("rightC").style.width = "0px";
idCatch("leftC").style.left = "0px";
idCatch("leftC").style.width = "0px";

/*Function that makes a lightsaber-like animation at the begining of the game*/
function lightsaber(obj) {

    requestAnimationFrame(() => {
        f();
    });
    animaOngoing = true;

    function f() {
        if (parseInt(obj.style.left) < -300) {
            animaOngoing = false;
        } else {
            obj.style.left = parseInt(obj.style.left) - 7 + "px";
            obj.style.width = parseInt(obj.style.width) + 14 + "px";
            if (parseInt(obj.style.left) < -100) {
                obj.style.display = "block";
            }
            requestAnimationFrame(() => {
                f();
            });
        }
    }
}

/*=========================================================================*/

/*This section deals with scoring system, Local storage
 and data manipulations*/

let scDiv = [];
let sc = [];

for (let i = 0; i < 10; i++) {
    scDiv[i] = idCatch("sc-div-" + (i + 1));
    sc[i] = idCatch("sc-" + (i + 1));
    scDiv[i].style.display = "none";
}

if (localStorage.length == 0) {
    for (let i = 1; i <= 10; i++) {
        scDiv[i-1].style.display = "none";
    }

    displayOn(idCatch("no"));

} else {

    let temp = [];
    for (let i = 1; i <= 10; i++) {
        if(Number.isInteger(parseInt(localStorage.getItem(i)))) {
            temp.push(parseInt(localStorage.getItem(i)));
        }
    }
    temp = sortArr(temp);

    localStorage.clear();
    for (let i = 1; i <= 10; i++) {
        localStorage.setItem(i, temp[i - 1]);
    }


    for (let i = 0; i < temp.length; i++) {
        scDiv[i].style.display = "flex";
        sc[i].innerHTML = temp[i];
    }
}

let tempScores = [];

/*In this event, when the "submit" button is clicked, the score of a player
is handled. If a players score was high enough to break the top ten, it will be
added to local storage.*/
submit.addEventListener("click", () => {

    animaOngoing = true;

    if (localStorage.length != 0) {

        let temp = [];
        for(let i = 1; i <= localStorage.length; i++) {
            temp[i - 1] = parseInt(localStorage.getItem(i));
        }
        temp[localStorage.length] = transfer;
        let a = sortArr(temp);

        if(localStorage.length == 0) {
            localStorage.setItem(1, a[0]);
        } else {
            let limit = 0;
            if(localStorage.length == 10) {
                a.pop();
                limit = localStorage.length;
            } else {
                limit = localStorage.length + 1;
            }
            for(let i = 1; i <= limit; i++) {
                localStorage.setItem(i, a[i-1]);
            }
        }

        let topTenLocation = taken(a, transfer);
        if(topTenLocation == -1) {
            idCatch("ups").style.display = "block";
        }

        for(let i = 0; i < a.length; i++) {
            if(i == topTenLocation) {
                sc[i].style.backgroundColor = "blueviolet";
            }
            scDiv[i].style.display = "flex";
            sc[i].innerHTML = a[i];
        }

    } else {
        
        localStorage.setItem(1, transfer);
        sc[0].innerHTML = localStorage.getItem(1);
        scDiv[0].style.display = "flex";

        if (localStorage.length == 0) {
            idCatch("no").style.display = "block";
        }
    }

    /*Showing the div where the scores are displayed*/
    displayOff(box1, box2, box3, box4, box5, nar2, home, submitContainer,
        nar, start, pleja, crcControl);
    displayOn(scores);
    opPlus(scores);

    tempScores.length = 0;

})

/*=========================================================================*/

/*A function that sorts an array of numbers*/
function sortArr(a) {

    for (let i = 0; i < a.length; i++) {

        let min = a[i];
        let index = i;

        for (let j = i; j < a.length; j++) {
            if (a[j] > min) {
                min = a[j];
                index = j;
            }
        }

        if (a[i] != min) {
            let temp = a[i];
            a[i] = a[index];
            a[index] = temp;
        }
    }

    return a;
}

/*Given an input, function scans an array to see if the value passed
is one of its elements. If it is, it returns its index. If not, index == -1.
If there are duplicates, it returns the position of a last one. It is meant
to be used on an already sorted array.*/
function taken(a, T) {
    
    let index = -1;
    for (let i = 0; i < a.length; i++) { 
        if (i < a.length - 1) {
            if ((T == a[i]) && (T != a[i+1])) {
                index = i;
            }
        } else if (T == a[a.length - 1]){
            index = a.length - 1;
        }
    }

    return index;
}

/*Element creation*/
function createElement(el, parentId) {
    let element = document.createElement(el);
    parentId.appendChild(element);
    return element;
}

/*ID catcher*/
function idCatch(id) {
    return document.getElementById(id);
}