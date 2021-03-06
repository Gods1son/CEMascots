
var level = 0;
var levelName = "MascotsLevel";
var wrong = 0;
var totalScore = 0;
var indScore = 0;
var maxScore = 4;
var animDelay = 1000;
var chooseCategory;
var chosenCatLevel;
var finalIndex;
var soundStatus = true;

function closeAppClose(option) {
    		if (option == 1 || option == true) {
    			try {
    				navigator.app.exitApp();
    			} catch (err) {
    				window.close();
    			}
    		} 
    	}

    	function closeApp() {
    		try {
    			navigator.notification.confirm(
			"Are you sure you want to close the app?", // message
			function (buttonIndex) {
				closeAppClose(buttonIndex);
			},            // callback to invoke with index of button pressed
			'Close App?',           // title
			['Yes', 'No']     // buttonLabels
		);
    		} catch (err) {
    			var startAgain = confirm("Are you sure you want to close the app?");
    			if (startAgain) {
    				closeAppClose(1);
    			} else {
    				closeAppClose(7);
    			}
    		}
    	}

function resetLevelDialog(level){
	try {
		var display = level == levelName ? "All Levels" : level + " category";
		navigator.notification.confirm(
			display + " completed, Do you want to start again?", // message
			function(buttonIndex){
				resetLevel(buttonIndex, level);
			},            // callback to invoke with index of button pressed
			'WINNER',           // title
			['Restart','Exit']     // buttonLabels
		);
		} catch (err) {
		var display = level == levelName ? "All Levels" : level + " category";
		var startAgain = confirm(display + " completed, Do you want to start again?");
		if(startAgain){resetLevel(1,level);
		}else{
			resetLevel(7,level);
		}
	}
}

function resetLevel(option, level){
	if (option == 1 || option == true) {
		var direct = level == levelName ? "" : "?" + level;
					localStorage.removeItem(level);
					localStorage.removeItem(level + "Total");
                    localStorage.removeItem(level + "TotalGrade");
                    window.location.href = "index.html" + direct;
				   }else{
					   window.location.href = "choose.html";
					   return;
				   }
}

function toggleSound() {
	if (soundStatus == false) {
		soundStatus = true;
		$("#soundLogo").attr("src", "Images/soundOn.png");
	} else {
		soundStatus = false;
		$("#soundLogo").attr("src", "Images/soundOff.png");
	}
}

function playAudio(sound) {
	var audio = document.getElementById(sound);
	if (audio.paused) {
		audio.play();
	} else {
		audio.currentTime = 0
	}
}

function findLast(cat){
            var spot;
            if(finalIndex != null || finalIndex != undefined){
                spot = finalIndex;
                return spot;
            }
            for(var i = people.length - 1; i > 0; i--){
                if(people[i].category == cat){
                    spot = i;
                    break;
                }
            }
            return spot;
        }

function findFirst(cat){
            var spot;
            for(var i = 0; i < people.length ; i++){
                if(people[i].category == cat){
                    spot = i;
                    break;
                }
            }
            return spot;
        }

        $(document).ready(function () {
        	toggleSound();
        	var cat;
        	var url = window.location.href;
        	var question = url.indexOf("?");
        	if (question == -1) {
        		cat = "";
        	} else {
        		cat = url.substr(question + 1, url.length);
        		cat = cat == "all" ? "" : cat;
        	}
        	if (cat == "") {
        		totalScore = localStorage.getItem(levelName + "TotalGrade");
        		totalScore = totalScore == null ? 0 : parseInt(totalScore);
        	} else {
        		totalScore = localStorage.getItem(cat + "TotalGrade");
        		totalScore = totalScore == null ? 0 : parseInt(totalScore);
        	}
        	$("#scorer").html(totalScore);
        	fillContent(cat);
        })


//method for playing games by category
function fillContentWithCategory(theCategory,start){
    chooseCategory = theCategory;
    $("#theImage").hide();
    $(".buttonHolder").eq(0).hide();
	if(start == true){
    //check if it is saved in localStorage
		chosenCatLevel = localStorage.getItem(theCategory);
		if(chosenCatLevel == undefined || chosenCatLevel == null){
			//chosenCatLevel = parseInt(people.findIndex(b => b.category === theCategory));
            chosenCatLevel = findFirst(theCategory);
			localStorage.setItem(theCategory,chosenCatLevel);
			}
		}
		chosenCatLevel = parseInt(chosenCatLevel);
		if(chosenCatLevel == people.length){
			
			resetLevelDialog(theCategory);
			return;
		}
	//check next person with same category
	if(people[chosenCatLevel].category == theCategory){
		localStorage.setItem(theCategory,chosenCatLevel);
    	var category = people[chosenCatLevel].category;
    	var imagePath = "Images/" + category + "/" + category + people[chosenCatLevel].image;
    $("#theImage").attr("src", imagePath);
    var options = people[chosenCatLevel].options;
        options = shuffle(options);
    $(".buttonHolder").eq(0).empty();
        for(var i = 0; i < options.length; i++){
            createButton(options[i]); 
            }
        setTimeout(function(){
            $("#theImage").show();
            $(".buttonHolder").eq(0).show();
             //$("#theImage").addClass("animated animNorm zoomIn");
			 $(".imgHolder").eq(0).addClass("animated animNorm zoomIn");
			 $("info").addClass("hide");
           $(".buttonHolder").eq(0).addClass("animated animNorm bounceInDown");
        },100)
          
		}else{
			$(".imgHolder").eq(0).removeClass("animated animNorm zoomIn");
		 	
			$(".buttonHolder").eq(0).removeClass("animated animNorm bounceInDown");
			chosenCatLevel = parseInt(chosenCatLevel) + 1;
			
             finalIndex = findLast(theCategory);
			 if(finalIndex < chosenCatLevel){
				
			 	resetLevelDialog(theCategory);
			 	return;
			}
			fillContentWithCategory(chooseCategory,false);
		}
}


//method for playing all games
function fillContentAll(){
    $("#theImage").hide();
    $(".buttonHolder").eq(0).hide();
    chooseCategory = "";
	//check if it is saved in localStorage
		level = localStorage.getItem(levelName);
		if(level == undefined || level == null){
			level = 0;
			localStorage.setItem(levelName,level);
		}	
		level = parseInt(level);
	if(level == people.length){
		
		resetLevelDialog(levelName);
		return;
	}
     //check if there is category
    var category = people[level].category;
    var imagePath = "Images/" + category + "/" + category + people[level].image;
    $("#theImage").attr("src", imagePath);
    
    var options = people[level].options;
    options = shuffle(options);
    $(".buttonHolder").eq(0).empty();
        for(var i = 0; i < options.length; i++){
            createButton(options[i]); 
            }
     setTimeout(function(){
            $("#theImage").show();
            $(".buttonHolder").eq(0).show();
             $("#theImage").addClass("animated animNorm zoomIn");
			 $("#info").addClass("hide");
           $(".buttonHolder").eq(0).addClass("animated animNorm bounceInDown");
        },100)
          
}

//method that decides if there is category or not
function fillContent(theCategory){
		$(".imgHolder").eq(0).removeClass("animated animNorm zoomIn");
		$("#info").addClass("hide");
        //$("#theImage").removeClass("animated animNorm zoomIn");
        $(".buttonHolder").eq(0).removeClass("animated animNorm bounceInDown");
        if(theCategory == "" || theCategory == undefined){
		fillContentAll();
        }else{
            fillContentWithCategory(theCategory,true);
        }
}

//method that creates the option buttons
function createButton(text){
    var button = document.createElement("BUTTON");
    button.setAttribute("type","button");
    $(button).on("click", function () { checkAnswer(this); });
    //button.onclick = function(){checkAnswer(this);}
    if(text.indexOf("#") > -1){
        button.setAttribute("data-correct","true");
        text = text.replace("#","");
        button.innerHTML = text;
    }else{
        button.innerHTML = text;
    }   
    var holder = $(".buttonHolder").eq(0);
    $(holder).append(button);
}


//method that checks the answer
function checkAnswer(button) {
	//e.preventDefault();
    var right = $(button).attr("data-correct");
    if(right == "true"){
	$(button).off("click");
    	//$(button).addClass("correct");
		$("#winImage").toggleClass("hide");
    	if (soundStatus == true) { playAudio("correctAudio"); }
		//determine if its all level or everything
		if(chooseCategory != ""){
		//for categories
			chosenCatLevel = parseInt(chosenCatLevel) + 1;
			localStorage.setItem(chooseCategory,chosenCatLevel);
			var totalLevel = localStorage.getItem(chooseCategory + "Total");
			//saving total for all levels
			if(totalLevel == undefined || totalLevel == null){
			//saving a new value
				totalLevel = 1;
				localStorage.setItem(chooseCategory + "Total", totalLevel);
			}else{
				totalLevel = parseInt(totalLevel) + 1;
				localStorage.setItem(chooseCategory + "Total", totalLevel);
			}
            indScore = maxScore - wrong;
            indScore = indScore < 0 ? 0 : indScore;
            totalScore = localStorage.getItem(chooseCategory + "TotalGrade");
            totalScore = totalScore == null ? 0 : parseInt(totalScore);
            totalScore += indScore;
            localStorage.setItem(chooseCategory + "TotalGrade",totalScore);
            $("#scorer").html(totalScore);
            wrong = 0;
		}else{
		//for all levels
			level = parseInt(level) + 1;
			localStorage.setItem(levelName,level);
			var totalLevel = localStorage.getItem(levelName + "Total");
			//saving total for all levels
			if(totalLevel == undefined || totalLevel == null){
			//saving a new value
				totalLevel = 1;
				localStorage.setItem(levelName + "Total", totalLevel);
			}else{
				totalLevel = parseInt(totalLevel) + 1;
				localStorage.setItem(levelName + "Total", totalLevel);
			}
            indScore = maxScore - wrong;
            indScore = indScore < 0 ? 0 : indScore;
            totalScore = localStorage.getItem(levelName + "TotalGrade");
            totalScore = totalScore == null ? 0 : parseInt(totalScore);
            totalScore += indScore;
            localStorage.setItem(levelName + "TotalGrade",totalScore);
            $("#scorer").html(totalScore);
            wrong = 0;
		}
        
        animDelay = 500;
        setTimeout(function () {
        	// $(button).removeClass("correct");
			$("#winImage").toggleClass("hide");
        	fillContent(chooseCategory);
        	animDelay = 1000;
        }, animDelay);
        
    }else{
          	//$(button).addClass("incorrect");
          	$(button).addClass("animated animQuick hinge");
          	wrong += 1;
          	if (soundStatus == true) {playAudio("incorrectAudio");}
        //setTimeout(function(){ $(button).removeClass("animated animQuick shake");},animDelay);
    }
}

function shuffle(array) {
			var counter = array.length;
    // While there are elements in the array
			while (counter > 0) {
        // Pick a random index
				var index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function goToChoose(){
    window.location.href = "choose.html";
}

function showInfo(){
	var info = people[chosenCatLevel].info;
	$("#infoText").text(info);
	$("#info").toggleClass("animated animNorm zoomIn hide");
}

function closeInfoText(){
	$("#info").toggleClass("animated animNorm zoomIn hide");
}

