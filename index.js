
var level = 0;
var levelName = "MascotsLevel";
var wrong = 0;
var totalScore = 0;
var indScore = 0;
var maxScore = 4;
var animDelay = 1000;
var chooseCategory;
var chosenCatLevel;

$(document).ready(function(){
    var cat;
    var url = window.location.href;
    var question = url.indexOf("?");
    if(question == -1){
        cat = "";
    }else{
        cat = url.substr(question + 1,url.length);
        cat = cat == "all" ? "" : cat;
    }
    fillContent(cat);  
})


//method for playing games by category
function fillContentWithCategory(theCategory,start){
    chooseCategory = theCategory;
	if(start == true){
    //check if it is saved in localStorage
		chosenCatLevel = localStorage.getItem(theCategory);
		if(chosenCatLevel == undefined || chosenCatLevel == null){
			chosenCatLevel = parseInt(people.findIndex(b => b.category === theCategory));
			localStorage.setItem(theCategory,chosenCatLevel);
			}
		}
		chosenCatLevel = parseInt(chosenCatLevel);
		if(chosenCatLevel == people.length){
			alert(theCategory + " category completed, try other categories");
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
           $("#theImage").addClass("animated animNorm zoomIn");
           $(".buttonHolder").eq(0).addClass("animated animNorm bounceInDown");
		}else{
		 	$("#theImage").removeClass("animated animNorm zoomIn");
			$(".buttonHolder").eq(0).removeClass("animated animNorm bounceInDown");
			chosenCatLevel = parseInt(chosenCatLevel) + 1;
			var reversedPeople = parseInt(people.slice().reverse().findIndex(b => b.category === theCategory));
			var count = people.length - 1;
			var finalIndex = count - reversedPeople;
			 if(finalIndex < chosenCatLevel){
				alert(theCategory + " category completed, try other categories");
				window.location.href = "choose.html";
				return;
			}
			fillContentWithCategory(chooseCategory,false);
		}
}


//method for playing all games
function fillContentAll(){
    chooseCategory = "";
	//check if it is saved in localStorage
		level = localStorage.getItem(levelName);
		if(level == undefined || level == null){
			level = 0;
			localStorage.setItem(levelName,level);
		}
		
		level = parseInt(level);
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
           $("#theImage").addClass("animated animNorm zoomIn");
           $(".buttonHolder").eq(0).addClass("animated animNorm bounceInDown");
}

//method that decides if there is category or not
function fillContent(theCategory){
    
        $("#theImage").removeClass("animated animNorm zoomIn");
        $(".buttonHolder").eq(0).removeClass("animated animNorm bounceInDown");
        if(theCategory == "" || theCategory == undefined){
			if(level == people.length){
				alert("Game finished, check later for update");
				window.location.href = "choose.html";
				return;
			}else{
				fillContentAll();
				}
        }else{
            fillContentWithCategory(theCategory,true);
        }
}

//method that creates the option buttons
function createButton(text){
    var button = document.createElement("BUTTON");
    button.setAttribute("type","button");
    button.onclick = function(){checkAnswer(this,event);}
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
function checkAnswer(button, e) {
	e.preventDefault();
    var right = $(button).attr("data-correct");
    if(right == "true"){
    	$(button).addClass("correct");
        indScore = maxScore - wrong;
        indScore = indScore < 0 ? 0 : indScore;
        totalScore += indScore;
        $("#scorer").html(totalScore);
        wrong = 0;

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
		}
        
        animDelay = 500;
        setTimeout(function () {
        	// $(button).removeClass("correct");
        	fillContent(chooseCategory);
        	animDelay = 1000;
        }, animDelay);
        
    }else{
          	//$(button).addClass("incorrect");
          	$(button).addClass("animated animQuick shake");
          	wrong += 1;
        setTimeout(function(){ $(button).removeClass("animated animQuick shake");},animDelay);
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

