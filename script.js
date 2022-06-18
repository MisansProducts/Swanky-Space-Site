window.onload = init; //Initialization

//Function that allows the switching of tabs
function openTab(evt, name) {
	
	//Closes same tab that is open
	if (document.getElementById(name).style.display == "block") {
		document.getElementById(name).style.display = "none";
		evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
		document.getElementById('music').style.borderRadius = "2rem 0 0 2rem";
		document.getElementById('about').style.borderRadius = "0 2rem 2rem 0";
		return;
	}
	
	// Declare all variables
	var i, tabcontent, tablinks;
	
	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	
	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(name).style.display = "block";
	evt.currentTarget.className += " active";
	
	document.getElementById('music').style.borderRadius = "2rem 0 0 0";
	document.getElementById('about').style.borderRadius = "0 2rem 0 0";
}

//Function that changes the current music playing in the audio player
function changeMusic(e) {
	e.preventDefault();

	var elm = e.target;
	var audio = document.getElementById('music_media');

	var source = document.getElementById('music_source');
	source.src = elm.getAttribute('data-value');

	audio.load(); //call this to just preload the audio without playing
	audio.play(); //call this to play the song right away
	
	//Changes label
	var label = elm.getAttribute('data-value');
	label = label.replace(/^.*[\\\/]/, ''); //Replaces the file path with the nothing
	label = label.replace('.mp3', ''); //Replaces the extension with nothing
	document.getElementById('music_media_label').innerHTML = "<b>Now playing</b> <i>" + label + "</i>";
}

//Function that changes the current image in the image viewer
function changeImage(e) {
	e.preventDefault();

	var elm = e.target;
	var source = document.getElementById('image_source');
	
	source.src = elm.getAttribute('data-value');
	
	//Changes label
	var label = elm.getAttribute('data-value');
	label = label.replace(/^.*[\\\/]/, ''); //Replaces the file path with the nothing
	label = label.slice(0, label.indexOf('.')); //Replaces the extension with nothing
	document.getElementById('image_media_label').innerHTML = label;
}

//Create HTML fragment (made by Zhiwen)
function Create(HTMLString) {
	var Fragment = document.createDocumentFragment(), Temp = document.createElement('div');
    Temp.innerHTML = HTMLString;
    while (Temp.firstChild) {
        Fragment.appendChild(Temp.firstChild);
    }
    return Fragment;
}

//Appends track to music list
function appendMusic(fileName, filePath, listLoc) {
	//Creates track in the music list
	var track = Create(`<li class = "list_end"><a onclick = "changeMusic(event)" href = "#" data-value = "${filePath}">${fileName}</a></li>`);
	document.getElementById(listLoc).appendChild(track);
}

//Appends image to images list
function appendImage(fileName, filePath, listLoc) {
	//Creates image in the images list
	var track = Create(`<li class = "list_end"><a onclick = "changeImage(event)" href = "#" data-value = "${filePath}">${fileName}</a></li>`);
	document.getElementById(listLoc).appendChild(track);
}

//Appends category to music list
function appendMusicCategory(dirName, listLoc, path) {
	//Variables for IDs
	var musicCategoryID = "musicCategory" + path;
	var musicListID = "musicList" + path;
	
	//Creates category in the music list
	var category = Create(`<li id = "${musicCategoryID}"><span class = "caret">${dirName}</span></li>`);
	document.getElementById(listLoc).appendChild(category);
	
	category = Create(`<ul class = "nested" id = "${musicListID}"></ul>`);
	document.getElementById(musicCategoryID).appendChild(category);
}

//Appends category to images list
function appendImagesCategory(dirName, listLoc, path) {
	//Variables for IDs
	var imagesCategoryID = "imagesCategory" + path;
	var imagesListID = "imagesList" + path;
	
	//Creates category in the images list
	var category = Create(`<li id = "${imagesCategoryID}"><span class = "caret">${dirName}</span></li>`);
	document.getElementById(listLoc).appendChild(category);
	
	category = Create(`<ul class = "nested" id = "${imagesListID}"></ul>`);
	document.getElementById(imagesCategoryID).appendChild(category);
}

//Gets file from server (supposedly)
function loadFile(filePath) {
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.status == 200) {
		result = xmlhttp.responseText;
	}
	return result;
}

//Uses recursion to go through nested music/images list
function listRecursion(dir, prevDirLoc, spec) {
	//For some reason dir is undefined without calling the function
	if (typeof(dir) != 'undefined') {
		//Loops through the directory
		for (var i = 0; i < dir.length; i++) {
			//Some item in the list
			var x = dir[i];
			
			//New ID for getting element by ID
			var newDirID = "musicList" + prevDirLoc;
			if (spec == 1) {newDirID = "imagesList" + prevDirLoc;} //Specifies list (images)
			
			//Item is a directory
			if (typeof(x) == 'object') {
				//Name of directory (string)
				var newDirName = Object.keys(x)[0];
				
				//New directory
				var newDir = x[newDirName];
				
				//New directory location (path)
				var newDirLoc = prevDirLoc + "/" + newDirName;
				
				//Creates category in the music list
				if (spec == 0) {
					appendMusicCategory(newDirName, newDirID, newDirLoc);
				}
				//Creates category in the images list
				else {
					appendImagesCategory(newDirName, newDirID, newDirLoc);
				}
				
				//Recursion
				listRecursion(newDir, newDirLoc, spec);
			}
			//Item is a file
			else {
				//New directory location (path)
				var newDirLoc = prevDirLoc + "/" + x;
				
				//Slices off extension
				fileName = x.slice(0, x.indexOf("."));
				
				//Adds track to the music list
				if (spec == 0) {
					appendMusic(fileName, newDirLoc, newDirID);
				}
				//Adds image to the images list
				else {
					appendImage(fileName, newDirLoc, newDirID);
				}
			}
		}
	}
}

//Window has loaded, initialize content
function init() {
	
	//Automatic file uploader
	var JsonFromServerMusic = loadFile('http://tgbsbsb.x10host.com/Music List.txt'); //Gets the text file for music
	var JsonFromServerImages = loadFile('http://tgbsbsb.x10host.com/Images List.txt'); //Gets the text file for images
	
	JsonFromServerMusic = JSON.parse(JsonFromServerMusic); //Makes the list a JSON file (music)
	JsonFromServerImages = JSON.parse(JsonFromServerImages); //Makes the list a JSON file (images)
	
	//JsonFromServer is defined
	if (JsonFromServerMusic != null || JsonFromServerImages != null) {
		//Gets object type from JSON
		var musicList = JsonFromServerMusic["Music"];
		var imagesList = JsonFromServerImages["Images"];
		
		//Starts recursion process to loop through the entire nested music/images list/folder
		listRecursion(musicList, "Music", 0);
		listRecursion(imagesList, "Images", 1);
	}
	//JsonFromServer is undefined
	else {
		//Temporary, better to update the HTML of the website to display an error
		console.log("An error has occurred when loading the music/images list text file.");
	}
	
	//Allows toggling for nested lists
	var toggler = document.getElementsByClassName("caret");
	var i;
	
	for (i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function() {
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.classList.toggle("caret-down");
		});
	}
	
	//Parallax effect for background
	window.addEventListener('scroll', function() {
		let value = window.scrollY; //Gets the number of pixels scrolled down
		
		//Displaces the backgrounds to achieve parallax
		document.body.style.backgroundPositionY =
			value * 0.15 + "px, " + //Close
			value * 0.45 + "px, " + //Medium
			value * 0.65 + "px, " + //Far
			value * 0.8 + "px"; //Distant
	});
	
	/*
	//Mouse move background parallax effect
	window.addEventListener('mousemove', function(e) {
		let _w = -window.innerWidth / 2;
        let _h = -window.innerHeight / 2;
		let _mouseX = -e.clientX; // X position
		let _mouseY = -e.clientY; // Y position
		
		//Sets X positions
		cValueX = (_mouseX - _w) * 0.015; //Close
		mValueX = (_mouseX - _w) * 0.045; //Medium
		fValueX = (_mouseX - _w) * 0.065; //Far
		dValueX = (_mouseX - _w) * 0.08; //Distant
		
		//Sets Y positions
		cValueY = cValueY + (_mouseY - _h) * 0.015; //Close
		mValueY = mValueY + (_mouseY - _h) * 0.045; //Medium
		fValueY = fValueY + (_mouseY - _h) * 0.065; //Far
		dValueY = dValueY + (_mouseY - _h) * 0.08; //Distant
	});
	*/
}