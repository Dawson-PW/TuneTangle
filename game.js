const peoplenames = JSON.parse(localStorage.getItem('people-names'));
const displaypeoplenames = JSON.parse(localStorage.getItem('display-people-names'));
const playlisturl = localStorage.getItem('playlist-url');
const trackarray = JSON.parse(localStorage.getItem('track-array'));
const displayname = localStorage.getItem('displayname');

let index = -1;
let score = 0;

let correctcounter = 0;

let trackname=""
let trackartists=""
let trackaddeduser=""
let tracklink=""
let trackimage=""
let trackpreview=""

let correct = new Audio("correct.wav");
let wrong = new Audio("wrong.wav");

let beat = "";

const amountofpeople = peoplenames.length;

let amountoftracks = 0;

console.log(amountofpeople+" contributors");

console.log(displaypeoplenames)

//we can setup the name buttons now as they don't ever change
usercontainer = document.getElementById("usercontainer")
let countd=0

//check if wrong amount of people
if (amountofpeople < 2 || amountofpeople > 15) {
    location.href = "error.html?error="+encodeURIComponent("Please use a playlist that contains between 3 and 15 people that have added songs.")
};

//for each user decode key value pair

/*
for (var k in displaypeoplenames){
    if (typeof displaypeoplenames[k] !== 'function') {
        console.log("Key is " + k + ", value is " + displaypeoplenames[k]);

        //the key is the user id
        //the value is the display name
        const user = document.createElement("div");
        user.id = k;
        user.className = "grid-item"
        user.innerHTML = displaypeoplenames[k].substring(0,14);
        user.onclick = function() { buttonclick(k); }

        usercontainer.appendChild(user);
        console.log("NEW ADDED")
        countd=countd+1;
    }
}
*/

Object.keys(displaypeoplenames).forEach(function(key) {
    console.log('Key : ' + key + ', Value : ' + displaypeoplenames[key])
    //the key is the user id
    //the value is the display name
    const user = document.createElement("div");
    user.id = key;
    user.className = "grid-item"
    user.innerHTML = displaypeoplenames[key].substring(0,14);
    user.onclick = function() { buttonclick(key); }

    usercontainer.appendChild(user);
    console.log("NEW ADDED")
    countd=countd+1;
})



//name buttons added


function newtrack(index) {
    console.log("CURRENT TRACK ABOUT TO LOAD="+index)

    if (index === 999) {
        trackname=""
        trackartists=""
        trackaddeduser=""
        tracklink=""
        trackimage=""
        trackpreview=""
    } else {
        document.body.style.backgroundColor = "#BDBF09";

        //load up the first song info
        trackname=trackarray[index][0]
        trackartists=trackarray[index][1]
        trackaddeduser=trackarray[index][2]
        tracklink=trackarray[index][3]
        trackimage=trackarray[index][4]
        trackpreview=trackarray[index][5]
    }

    document.getElementById("timerinner").style.background = "#2292A4";

    //fill in info
    document.getElementById("tracktitle").innerHTML = trackname;
    document.getElementById("trackartist").innerHTML = trackartists;

    document.getElementById("trackartwork").src = trackimage;
    document.getElementById("trackartworklink").href = tracklink

    beat = new Audio(trackpreview);
}


//START OF GAME

//this starts the game
next()

var timer = 0;


function buttonclick(ider) {
    ///////////////////////////////////////////////////////////////
    console.log(ider+" was clicked")
    console.log(trackaddeduser)
    if (ider == trackaddeduser) {
        //if correct button was clicked
        console.log("CORRECT")
        console.log("ADD POINTS")

        var correcttime = timer;
        console.log("Correct in "+correcttime+" seconds")
        var timededuction = correcttime * 3.333;
        score = score + 100 - timededuction;

        if (score < 0) {
            score = 0;
        }

        //add one track to correct counter
        correctcounter = correctcounter + 1;

        beat.pause();
        correct.play();

        clearInterval(gametimer)

        document.body.style.backgroundColor  = "#55fa73";

        console.log("NEW SCORE = "+score)
        updatescoredisp(score)

        blank()
    } else {
        ///////////////////////////////////////////////////////////
        console.log("INCORRECT")
        console.log("DEDUCT POINTS")
        score = score - 40;

        if (score < 0) {
            score = 0;
        }

        wrong.play();

        clearInterval(gametimer)

        document.body.style.backgroundColor  = "#fa5555";
        setTimeout(function() {document.body.style.backgroundColor  = "#BDBF09";}, 1000)

        console.log("NEW SCORE = "+score)
        updatescoredisp(score)
    }
}

function skipclicked() {
    ///////////////////////////////////////////////////
    console.log("SKIP CLICKED")

    console.log("DEDUCT POINTS")
    score = score - 70;

    if (score < 0) {
        score = 0;
    }

    beat.pause();
    wrong.play();

    clearInterval(gametimer)

    document.body.style.backgroundColor  = "#fa5555";

    blank()

    console.log("NEW SCORE = "+score)
    updatescoredisp(score)
}

function updatescoredisp(score) {

    currentval = parseInt(document.getElementById("currentscore").innerHTML);
    console.log("current val = "+currentval)
    newroundscore = Math.round(score);
    console.log("new val = "+newroundscore)

    const obj = document.getElementById("currentscore");
    animateValue(obj, currentval, newroundscore, 2000);
}

function blank() {
    document.getElementById("outercontainer").style.display = "none";
    newtrack(999)
    document.getElementById("timer").style.display = "None";

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
      
    delay(1000).then(() => next());
}

function next() {
    index = index+1

    //check if we are done!
    //if > 9 not 10 because it starts at 0
    if (index > 9) {
        console.log("ALL TRACKS DONE")
        finished()
    } else {
        newtrack(index)    

        //display things
        document.getElementById("outercontainer").style.display = "block";


        //play sound
        beat.play();

        //get start time
        var start = Date.now();

        timer = 0;

        gametimer = setInterval(function() {
            var delta = Date.now() - start; // milliseconds elapsed since start
            timer = Math.floor(delta / 1000);
            
            if (timer == 20) {
                document.getElementById("timerinner").style.background = "red";
            } else if (timer > 29) {
                console.log("OUT OF TIME")
                //out of time!
                //simulate a random fake thing as hitting the wrong person is the same as out of time
                skipclicked()
            }

        }, 1000); // update about every second
        document.getElementById("timer").style.display = "grid";
    };
}

function finished() {
    //collect the data we need
    //score
    //correctcounter
    localStorage.setItem("correct-counter", correctcounter);
    localStorage.setItem("score", score);
    location.href = "/finished.html"
}




////////////////

//animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
}