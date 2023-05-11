let playlisturl = localStorage.getItem('playlist-url');
let accesstoken = localStorage.getItem('access-token');

let trackarray = [];
let usingtrackarray = [];

let randomnumbers = [];

let peoplenames = [];
let display_peoplenames = [];
const userProfiles = {};

let trackcount = 0;

var endofplaylist = 0;

let imageurl = "";

let newname = "";

let readytogo = 0;

//playlisturl = "3cEYpjA9oz9GiPac4AsH4n"
//playlisturl = "5j8AbuKUdMqjxEQ8zGiHfx"

var i = 0;
var b = 0;


console.log("STARTING!")

offsetr=0

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function getmoredata (offsetr) {
	laterstr='playlist_id=' + encodeURIComponent(playlisturl) + 
	'&market=GB' + 
	'&fields=' + "items(added_by.id,track(name,external_urls(spotify),artists(name),album(images(url)),preview_url))" +
	'&limit=20' +
	'&offset='+offsetr

	fetch('https://api.spotify.com/v1/playlists/'+encodeURIComponent(playlisturl)+'/tracks?'+laterstr, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' +accesstoken
		},
	}).then(function (response) {
		// The API call was successful!
		if (response.ok) {
			return response.json();
		} else {
			return Promise.reject(response);
		}
	}).then(function (data) {
		// This is the JSON from our response
		console.log(data);
		addinfoarray(data)
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});
};

function addinfoarray(datain) {
	//check its not blank and we're at end of list yet
	if (datain['items'].length=="0") {
		console.log("END OF PLAYLIST");
		endofplaylist = 1;
	}

	for (const eachdata of datain['items']) {

		var artiststring = "";
		for (const eachartist of eachdata['track']['artists']) {
			artiststring = artiststring + eachartist['name'] +", ";
		}

		imageurl = eachdata['track']['album']['images'][0]['url']
		console.log(imageurl)

		//console.log(eachdata);
		trackarray.push([eachdata['track']['name'],artiststring,eachdata['added_by']['id'],eachdata['track']['external_urls']['spotify'],imageurl,eachdata['track']['preview_url']])
	}

	//console.table(trackarray)
	//console.log(datain['track']['name'])

	i = i + 1;

	if (i > 4) {
		console.log("COMPLETED")
		console.log("All playlist completed, well upto the max anyway...")
		trackcount = trackarray.length
		console.log("There is "+trackcount+" tracks in this playlist (could be the max)")
		console.table(trackarray)

		//check if its less than 10
		if (trackcount < 10) {
			console.log("LESS THAN 10")
			location.href = "error.html?error="+encodeURIComponent("Please use a playlist that contains at least 10 songs.")
		} else {

			var c = 0;
			
			while (randomnumbers.length < 10) {
				console.log(randomnumbers.length)
				const randomNumber = Math.floor(Math.random() * (trackcount - 1)) + 1;
				if (!randomnumbers.includes(randomNumber)) {
					randomnumbers.push(randomNumber);
				}
			}
			
			console.log(randomnumbers);

			var d = 0;
			for (var d = 0; d < 10; d++) {
				usingtrackarray.push(trackarray[randomnumbers[d]])
			}

			console.log(" ")
			console.log("the selected tracks are")
			console.table(usingtrackarray)
			localStorage.setItem('track-array', JSON.stringify(usingtrackarray));

			peoplenames = [...new Set(usingtrackarray.map(item => item[2]))];
			console.log(peoplenames);

			let amountofpeople = peoplenames.length;

			if (amountofpeople < 2 || amountofpeople > 15) {
				location.href = "error.html?error="+encodeURIComponent("Please use a playlist that contains between 3 and 15 people that have added songs.")
			};

			localStorage.setItem('people-names', JSON.stringify(peoplenames));

			/*

			////get the users display names from the seperate api... why am i doing this to myself
			for (const eachnewname of peoplenames) {
				newname=getdisplaynames(eachnewname);
				display_peoplenames.push(newname);
			};

			if (display_peoplenames.length == peoplenames.length) {
				console.log(display_peoplenames)
				localStorage.setItem('display-people-names', JSON.stringify(display_peoplenames));
				location.href = "/game.html";
				return;
			}
			*/

			fetchUserProfiles();
		};


	} else {
		b = i * 20
		getmoredata(b)
	}
	console.log("i = "+i)
}

getmoredata(b)









///////////////////
//the function to get display names
/*
function getdisplaynames(userid) {
	//laterstr='?user_id=' + encodeURIComponent(userid)

	fetch('https://api.spotify.com/v1/users/'+encodeURIComponent(userid), {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' +accesstoken
		},
	}).then(function (response) {
		// The API call was successful!
		if (response.ok) {
			return response.json();
		} else {
			return Promise.reject(response);
		}
	}).then(function (data) {
		// This is the JSON from our response
		console.log(data);
		newname = data["display_name"];
		return newname;
		//get just the name get rid of all the useless stuff.
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});
};
*/

const fetchUserProfiles = async () => {
	console.log('fetchUserProfiles() called');
	try {
	  const profileRequests = peoplenames.map((name) =>
		fetch(`https://api.spotify.com/v1/users/${name}`, {
		  headers: {
			Authorization: `Bearer ${accesstoken}`,
		  },
		}).then((response) => response.json())
	  );
	  const profiles = await Promise.all(profileRequests);
	  console.log('profiles fetched:', profiles);
	  profiles.forEach((profile, index) => {
		userProfiles[peoplenames[index]] = profile.display_name;
	  });
	  console.log('userProfiles:', userProfiles);
	  // do something with userProfiles here
		localStorage.setItem('display-people-names', JSON.stringify(userProfiles));
		readytogo=1
		//location.href = "/game.html";
	} catch (error) {
	  console.log('error:', error);
	}
};


function start() {
	console.log("CLICKED")
	if (readytogo==1) {
		location.href = "/game.html";
	} else {
		alert("Please wait a few seconds and try again...")
	}
}