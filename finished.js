let score = localStorage.getItem("score");
let correct = localStorage.getItem("correct-counter");

document.getElementById("correctguesser").innerHTML = "You correctly guessed "+correct+"/10 songs"
document.getElementById("score").innerHTML = Math.round(score)

function linkcopy() {
    navigator.clipboard.writeText('https://tunetangle.dawsonpanterwray.co.uk');
  
    // Alert the copied text
    alert("Copied the text: " + 'https://tunetangle.dawsonpanterwray.co.uk');
}