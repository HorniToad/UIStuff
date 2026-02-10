let gameState;
//gameStateHandler-- Start of the Game State Handler
function gameStateHandler() {
	tickStateCounter();
	trainingHandler();
	modificationHandler();
	if(gameState.currentScene.current) {
		sceneCheck = gameState.currentScene.current
		if(sceneCheck.id === "scenePersonnelInformation") {
			console.log(gameState)
			personnelInformationSceneUpdater();
		}
		if(sceneCheck.id === "buildingSceneBox" && gameState.buildingSceneFocus.type === "Training") {
			buildingTrainingSceneUpdater();
		}
		if(sceneCheck.id === "buildingSceneBox" && gameState.buildingSceneFocus.type === "Modification" && gameState.buildingSceneFocus.subType === false) {
			buildingModificationSceneUpdater();
		}

	}
	if(gameState.tickState.tickRollOver === true) {
	}
}

// Tick Counter Function
function tickStateCounter() {
	if(gameState.tickState.currentTick < gameState.tickState.completeTick) {
		gameState.tickState.currentTick++;
		gameState.tickState.tickRollOver = false;
	}
	else if(gameState.tickState.currentTick == 10){
		gameState.tickState.currentTick = 0;
		gameState.tickState.tickRollOver = true;
		dateUpdater();
		console.log(gameState)
		$("#dateStatText").text(gameState.currentDate.week + " " + gameState.currentDate.month.name + " " + gameState.currentDate.day)
	}
	let progress = progressCheck(gameState.tickState.currentTick, gameState.tickState.completeTick)
	$("#progressBarCurrentTick").css({width: progress + "%"})
}

// Function that handles how fast the gameState.tickState.tick is running at
function speedSetFunction(x) {
	let speed = x;
	if(gameState.tickState.tickRate === x) {
		console.log("No speed change.")
		return 0;
	}
	clearInterval(gameState.tickState.tick)
	if(speed) {
		gameState.tickState.tickRate = speed;
		gameState.tickState.tick = setInterval(gameStateHandler, speed)
	}
	else {
		gameState.tickState.tickRate = false;
	}
}

// Determines the date based on the number of ticks that have passed
function dateUpdater() {
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	let months = [
		{id: "monthJanuary", name: "January", days: 31},
		{id: "monthFebruary", name: "February", days: 28},
		{id: "monthMarch", name: "March", days: 31},
		{id: "monthApril", name: "April", days: 30},
		{id: "monthMay", name: "May", days: 31},
		{id: "monthJune", name: "June", days: 30},
		{id: "monthJuly", name: "July", days: 31},
		{id: "monthAugust", name: "August", days: 31},
		{id: "monthSeptember", name: "September", days: 30},
		{id: "monthOctober", name: "October", days: 31},
		{id: "monthNovember", name: "November", days: 30},
		{id: "monthDecember", name: "December", days: 31},
	]

	if(!gameState.currentDate) {
		gameState.currentDate = {month: months[0], week: days[0], day: 1}
	}
	if(gameState.currentDate) {
		let currentDate = gameState.currentDate
		for(let k = 0; k < days.length; k++) {
			if(days[6] === currentDate.week) {
				currentDate.week = days[0];
				break;
			}

			else if(days[k] === currentDate.week) {
				currentDate.week = days[k + 1];
				break;
			}
		}
		if(currentDate.day === currentDate.month.days) {
			for(let i = 0; i < months.length; i++) {
				if(currentDate.month.id === months[11].id && currentDate.day === months[11].days) {
					currentDate.month = months[0];
					currentDate.day = 1
					break;
				}
				else if(currentDate.month.id === months[i].id) {
					currentDate.month = months[i + 1]
					console.log(currentDate.month)
					currentDate.day = 1
					break;
				}
			}
		}
		else {
			currentDate.day += 1;
		}
	}
}

//TrainingHandler Function Start
function trainingHandler() {
	let buildingSlots = gameState.buildings.buildingSlots;
	let selectedBuildings = $.grep(buildingSlots, function(n) {
		return n.trainable === true
	})

	for(let i = 0; i < selectedBuildings.length; i++) {
		for(let c = 0; c < selectedBuildings[i].occupant.length; c++) {
			if(selectedBuildings[i].occupant[c] != false) {
				console.log(selectedBuildings[i])
				if(!selectedBuildings[i].occupant[c].skills[selectedBuildings[i].stat]) {
					selectedBuildings[i].occupant[c].skills[selectedBuildings[i].stat] = structuredClone(skills[selectedBuildings[i].stat])
					console.log(skills[selectedBuildings[i].stat])
					console.log(selectedBuildings[i].occupant[c].skills[selectedBuildings[i].stat])
					let statFocus = selectedBuildings[i].occupant[c].skills[selectedBuildings[i].stat]
					statFocus.int += selectedBuildings[i].statInt;
				}
				else {
					let statFocus = selectedBuildings[i].occupant[c].skills[selectedBuildings[i].stat]
					statFocus.int += selectedBuildings[i].statInt;
					console.log("Selected Building Stat Int: " + selectedBuildings[i].statInt + " StatFocus: " + statFocus.int)
					if(statFocus.int > 100) {
						statFocus.int = 100;
						selectedBuildings[i].occupant[c] = false;
					}
				}
				if(selectedBuildings[i].occupant[c]) {
					console.log(selectedBuildings[i].occupant[c].name + " skill in " + selectedBuildings[i].stat + " is " + selectedBuildings[i].occupant[c].skills[selectedBuildings[i].stat].int)
				}
			}
		}
	}
}
//TrainingHanlder Function End

//personnelInformationSceneUpdater
function personnelInformationSceneUpdater() {
	let skills = gameState.personnel.focus.skills;

	for(let key in skills) {
		let focus = document.getElementById("personnelInformation" + key)
		if(!focus) {
			personnelInformationHandler(gameState.personnel.focus);
		}
		let progress = progressCheck(skills[key].int, 100);
		$("#personnelInformation" + key).css({"width": progress + "%"})
	}
}
//End of personnelInformationSceneUpdater
//Start of buildingTrainingSceneUpdater
function buildingTrainingSceneUpdater() {
	let progressBar = document.getElementById("buildingTrainingSceneProgressBar");
	// Resets progress bar and text if unoccupied
	if(gameState.buildingSceneFocus.occupant) {
		for(let i = 0; i < gameState.buildingSceneFocus.occupant.length; i++) {
			let occupantSlotPage = document.getElementById("buildingTrainingScene");
			let occupantSlot = occupantSlotPage.querySelectorAll(".occupantCapacitySlot");
			let progress = occupantSlot[i].querySelector(".progressBarProgress")
			let text = occupantSlot[i].querySelectorAll(".textBoxCenter")
			if(gameState.buildingSceneFocus.occupant[i] === false && text[0].innerText != "Unoccupied") {
				progress.style.width = "0%"
				text[0].innerText = "Unoccupied";
				text[2].innerText = "0%"
				trainingSceneHandler(gameState.buildingSceneFocus)
			}

			else if(gameState.buildingSceneFocus.occupant[i]) {
				let trainingFocus = gameState.buildingSceneFocus.occupant[i];
				if(gameState.buildingSceneFocus.occupant[i].skills[gameState.buildingSceneFocus.stat]) {
					let progressInt = progressCheck(trainingFocus.skills[gameState.buildingSceneFocus.stat].int, 100);
					progress.style.width = progressInt + "%";
					text[0].innerText = gameState.buildingSceneFocus.occupant[i].name
					text[2].innerText =  progressInt + "%"
				}
				else {
					progress.style.width = "0%";
					text[0].innerText = gameState.buildingSceneFocus.occupant[i].name
					text[2].innerText = "0%"
				}
			}
		}
	}
}
//End of buildingTrainingSceneUpdater
//Start of the buildingModificationSceneUpdater
function buildingModificationSceneUpdater() {
	let progressBar = document.getElementById("modificationSceneProgressBar")
	let progressText = document.getElementById("modificationSceneProgressText")
	let occupiedPanel = document.getElementById("buildingModificationSceneSurgeryActiveCover")
	let unoccupiedPanel = document.getElementById("buildingModificationSceneSurgeryNoOccupantCover")


	if(gameState.buildingSceneFocus.occupant[0]) {
		let progress = progressCheck(gameState.buildingSceneFocus.progress, gameState.buildingSceneFocus.selectedIndivdualPart[0].surgeryTime)
		console.log(gameState.buildingSceneFocus.progress)
		progressBar.style.width = progress + "%"
		progressText.innerText = "Current Surgery Progress: " + progress + "%"

	}
	if(!gameState.buildingSceneFocus.occupant[0] && gameState.buildingSceneFocus.potentialOccupant === false || gameState.buildingSceneFocus.occupant[0] === false && gameState.buildingSceneFocus.potentialOccupant === false) {
		progressBar.style.width = "0%"
		progressText.innerText = "Current Surgery Progress: Unoccupied"
		occupiedPanel.style.display = "none"
		unoccupiedPanel.style.display = "grid"
		modificationSceneHandler(gameState.buildingSceneFocus);
	}
}
//End of the buildingModifcaitonSceneUpdater
//Start of modificationHandler
function modificationHandler() {
	let buildingSlots = gameState.buildings.buildingSlots;
	let selectedBuildings = $.grep(buildingSlots, function(n) {
		return n.type === "Modification"
	})

	for(let i = 0; i < selectedBuildings.length; i++) {
		if(selectedBuildings[i].occupant[0] && selectedBuildings[i].occupant[0] != false) {
			if(selectedBuildings[i].progress === false) {
				selectedBuildings[i].progress = 0;
			}
			if(selectedBuildings[i].progress >= selectedBuildings[i].selectedIndivdualPart[0].surgeryTime) {
				let bodyPart = selectedBuildings[i].selectedIndivdualPart[0].part
				let bodyAttr = selectedBuildings[i].selectedIndivdualPart[0].type
				for(let key in selectedBuildings[i].occupant[0].appearance[bodyPart][bodyAttr]) {
					if(selectedBuildings[i].bodyPartSelected[key] != undefined) {
						selectedBuildings[i].occupant[0].appearance[bodyPart][bodyAttr][key] = selectedBuildings[i].bodyPartSelected[key]
					}
				}
				selectedBuildings[i].occupant[0].changeFlag = true;
				selectedBuildings[i].occupant[0] = false;
				selectedBuildings[i].progress = 0;
			}
			let progress = selectedBuildings[i].progress;
			progress = mathFixer(1, progress)
			selectedBuildings[i].progress = progress
		}
	}
}
//End of modificationHandler
//gameStateHandler-- End of the Game State Handler

//Start-Up--Start of the gameStartUpFunction and Child Setup Functions
$(function gameStartUpFunction() {
	// Test Dummy Char
	let testDummy = {name: "Mat", id: "mat01", status: "Idle", gender: "Male", sexuality: "Bisexual", bodyType: "Plump",}
	let testDummy2 = {name: "Perrin", id: "perrin01", status: "Idle", gender: "Wolf-Boi", sexuality: "Straight", bodyType: "Stocky"}


	let scene = document.getElementById("baseBox")
	let parent = $(scene).parent([".sceneContainerHidden"])
	parent[0].style.display = "grid"
	let buildingTemplate = {floorSlots: [], buildingSlots: [], slots: 20, floors: 5, buildFocus: false, buildTypeFocus: false, buildItemFocus: false, buildingSceneFocus: false}
	let personnelTemplate = {patients: [], employees: [], customers: [] , focus: false};
	let tickTemplate =  {tick: false, tickRate: false, completeTick: 10, currentTick: 0, tickRollOver: false}

	gameState = {tickState: tickTemplate, date: false,currentDate: false, cash: 500, patientCap: false, conditionFocus: false, charGen: false, personnel: personnelTemplate, buildings: buildingTemplate, currentScene: {current: scene, prior: false, parent: parent[0] } }
	console.log(gameState)
	personnelGenerator();
	for(let c = 0; c < 20; c++ ) {
		personnelGenerator();
	}
	hideBoxSetup();
	leftStatContainerBtnEventSetup();
	buildingSetup();
	personnelSetup();
	buildBoxSetup();
	gameSpeedBtnSetup();

	// Start of Left Stat Container UI Setup Functions
	// Left Stat Container Hide Box Setup
	function hideBoxSetup() {
		let div = document.getElementsByClassName("hideBoxOuter");
		for(let i = 0; i < div.length; i++) {
			let divHideBox = div[i].querySelector(".hideBoxInner");
			let divBtn = div[i].querySelector(".hideBtn");

			divBtn.addEventListener("click", function() {
				$("#" + div[i].id).children(".hideBoxInner").toggle();
			})
		}
	}

	// Left Stat Container Btn Slot Setup
	function leftStatContainerBtnEventSetup() {
		//Home Scene Btn Setup and Event Listener
		let homeScene = document.getElementById("baseBox")
		$("#leftStatBoxSceneBtnHome").on("click", function() {
			sceneChange(homeScene)
		})
		//Research Scene Btn Setup and Event Listener
		let researchScene = document.getElementById("sceneResearchTree")
		$("#leftStatBoxSceneBtnResearch").on("click", function() {
			sceneChange(researchScene)
		})
		// Sector Scene Btn Setup and Event Listener
		let sectorScene = document.getElementById("sceneExpeditionSelect")
		$("#leftStatBoxSceneBtnSectors").on("click", function() {
			sceneChange(sectorScene)
		})
		let bountyScene = document.getElementById("sceneBounties")
		$("#leftStatBoxSceneBtnBounties").on("click", function() {
			sceneChange(bountyScene)
		})
	}

	function gameSpeedBtnSetup() {
		$("#gameSpeedPauseBtn").on("click", function() {
			speedSetFunction();
		})
		$("#gameSpeedSlowBtn").on("click", function() {
			speedSetFunction(2000)
		})
		$("#gameSpeedNormalBtn").on("click", function() {
			speedSetFunction(1000)
		})
		$("#gameSpeedFastBtn").on("click", function() {
			speedSetFunction(500)
		})
	}
	// End of Left Stat Container UI Setup Functions

	// Start of Base Box Setup Functions
	// Handles variables and building functions
	function buildingSetup() {
		let slots = gameState.buildings.slots;
		let floors = gameState.buildings.floors;

		let closeBtn = document.getElementById("buildBoxCloseBtn")
		let buildBox = document.getElementById("buildBox")

		closeBtn.addEventListener("click", function() {
			sceneChange();
		})

		//hideTarget(closeBtn, buildBox)
		baseBoxSetup(slots, floors);
		baseBoxButtonSetup();
	}

	// Sets up the baseBox rows and the indivdual boxes.
	function baseBoxSetup(x, y) {
		let slots = x
		let floors = y
		let floorSlots = gameState.buildings.floorSlots
		let buildingSlots = gameState.buildings.buildingSlots

		let target = document.getElementById("sceneHome");
		let focus = target.querySelector(".gridBoxFull")

		let slotCount = slots / floors;
		let floorCount = 0;
		let count = 0;

		let buildingRowBase = {floorUnlocked: false, id: false }
		let currentFloor = document.createElement("div")
		currentFloor.setAttribute("class", "flexBoxHorizontal")
		currentFloor.setAttribute("id", "buildingRow" + floorCount)
		buildingRowBase.id = currentFloor.id

		floorSlots.push(buildingRowBase)
		focus.append(currentFloor)

		for(let i = 0; i < slots; i++) {
			let buildingBase = { active: false, floor: false, id: false, name: false, desc: false, occupant: [], type: false, subType: false, capacity: false, progress: false, stat: false, bodyPartFocus: false, selectedIndivdualPart: false, bodyPartSelected: false, potentialOccupant: false }
			let slotDiv = document.createElement("div");
			let slotDivInner = document.createElement("div");
			let slotDivCenter = document.createElement("div")
			let slotDivText = document.createElement("div");

			slotDiv.setAttribute("class", "gridBoxFull")
			slotDiv.setAttribute("id", "buildingSlot" + i)
			slotDivText.setAttribute("class", "textBoxCenter")
			slotDivInner.setAttribute("class", "gridBoxCenter95")
			slotDivCenter.setAttribute("class", "gridBoxCenter")

			buildingBase.id = slotDiv.id
			buildingSlots.push(buildingBase)

			slotDivText.innerText = i
			slotDivText.style.color = "black";

			slotDivInner.style.background = "white"
			slotDivInner.style.border = "solid";
			slotDivInner.style.borderRadius = "10px"

			slotDiv.append(slotDivInner);
			slotDivInner.append(slotDivCenter)
			slotDivCenter.append(slotDivText)
			currentFloor.append(slotDiv)

			count = count + 1;
			if(count === slotCount / 2) {
				let centralBox = document.createElement("div");
				let centralBoxDivInner = document.createElement("div");
				let centralBoxDivCenter = document.createElement("div")
				let centralBoxText = document.createElement("div");

				centralBox.setAttribute("class", "gridBoxFull");
				centralBoxDivInner.setAttribute("class", "gridBoxCenter95")
				centralBoxDivCenter.setAttribute("class", "gridBoxCenter")


				centralBox.setAttribute("id", "centralBox" + floorCount);

				centralBoxText.innerText =  "Floor: " + (floorCount + 1)
				centralBoxText.style.color = "black";

				centralBoxDivInner.style.background = "white"
				centralBoxDivInner.style.border = "solid";
				centralBoxDivInner.style.borderRadius = "10px"

				centralBox.append(centralBoxDivInner);
				centralBoxDivInner.append(centralBoxDivCenter)
				centralBoxDivCenter.append(centralBoxText)
				currentFloor.append(centralBox)
			}
			if(count === slotCount) {
				floorCount++;
				if(floorCount < floors) {
					let buildingRowBase = {floorUnlocked: false, id: false }
					currentFloor = document.createElement("div");
					currentFloor.setAttribute("class", "flexBoxHorizontal")
					currentFloor.setAttribute("id", "buildingRow" + floorCount)

					buildingRowBase.id = currentFloor.id

					floorSlots.push(buildingRowBase)
					focus.append(currentFloor)
					count = 0;
				}
			}
		}
	}

	// Adds click events to each of the buildSlot elements that show the buildBox when clicked
	function baseBoxButtonSetup() {
		let buildingSlots = gameState.buildings.buildingSlots
		console.log(buildingSlots)
		for(let i = 0; i < buildingSlots.length; i++) {
			let focus = document.getElementById(buildingSlots[i].id)
			$(focus).off()
			if(buildingSlots[i].active === false) {
				$("#" + buildingSlots[i].id).on("click", function buildingSlotClickSetup() {
					gameState.buildings.buildFocus = buildingSlots[i]
					buildBoxHandler();
				})
			}
			else if(buildingSlots[i].active === true) {
				$("#" + buildingSlots[i].id).on("click", function buildingSlotClickSetup() {
					buildingFilter(buildingSlots[i])
				})
			}
		}
	}
	// End of the Base Box Setup Functions

	// Start of the buildBoxSetup and its child functions
	function buildBoxSetup() {
		buildBtnSetup()
	}

	// Adds an eventListener to the buildBoxBuildBtn so when clicked it fills the current slot with the selected building stats.
	function buildBtnSetup() {
		let buildBtn = document.getElementById("buildBoxBuildBtn")
		$("#" + buildBtn.id).on("click", function() {
			console.log("How many times am I going???")
			let selectedSlot = gameState.buildings.buildFocus
			let selectedBuild = gameState.buildings.buildItemFocus;

			selectedSlot.active = true;
			selectedSlot.capacity = selectedBuild.capacity
			selectedSlot.desc = selectedBuild.desc
			selectedSlot.name = selectedBuild.name;
			selectedSlot.type = selectedBuild.type;
			if(!selectedBuild.subType) {
				selectedBuild.subType = false;
			}
			selectedSlot.subType = selectedBuild.subType;
			selectedSlot.statInt = selectedBuild.statInt;
			selectedSlot.stat = selectedBuild.stat;
			selectedSlot.trainable = selectedBuild.trainable;

			let slot = document.getElementById(selectedSlot.id)

			let textBox = slot.querySelector(".gridBoxCenter")

			textBox.innerHTML = selectedBuild.name
			baseBoxButtonSetup();
			sceneChange()
		})
	}
	// End of the buildBoxSetup functions


})
//Start-Up--End of the gameStartUpFunction and Child Setup Functions


// BuildBoxHandler--Start of the buildingBoxHandler Function and its child funcs
function buildBoxHandler() {
	buildBoxTypeHandler();
	buildBoxScrollHandler()
	let scene = document.getElementById("buildBox")
	sceneChange(scene, "grid")
}

// Setups the building type select box and adds event listeners so you can switch between different building types.
function buildBoxTypeHandler() {

	let buildBox = document.getElementById("buildBox")
	let target = buildBox.querySelector(".flexBoxHorizontal");

	clearBox(target)

	for(let i = 0; i < buildingTypes.length; i++) {
		let container = document.createElement("div");
		let containerInner = document.createElement("div");
		let containerText = document.createElement("div");
		let containerTextInner = document.createElement("div");

		container.setAttribute("id", buildingTypes[i].type + "BuildBoxTypeBtn")

		container.setAttribute("class", "gridBoxFull");
		containerInner.setAttribute("class", "gridBoxCenter75");
		containerText.setAttribute("class", "gridBoxCenter")
		containerTextInner.setAttribute("class", "textBoxCenter");

		containerTextInner.innerText = buildingTypes[i].name

		containerInner.style.background = "blue";
		containerInner.style.border = "solid";

		target.append(container)
		container.append(containerInner);
		containerInner.append(containerText)
		containerText.append(containerTextInner);

		containerInner.addEventListener("click", function() {
			gameState.buildings.buildTypeFocus = container.id.replace("BuildBoxTypeBtn", "")
			gameState.buildings.buildItemFocus = false

			let oldDesc = document.getElementById("buildBoxDescDiv")
			clearBox(oldDesc)

			buildBoxScrollHandler();
		})

	}
}

// Sets up the buildBox scroll menu and the btns that fill it. It also adds an event listener to each button so when clicked the gameState object changes buildItemFocus
function buildBoxScrollHandler() {
	let target = document.getElementById("buildBoxScrollDiv")
	clearBox(target)

	let gameStateFocus = gameState.buildings

	if(!gameStateFocus.buildTypeFocus) {
		gameStateFocus.buildTypeFocus = "Conditioning"
	}
	let focus = gameStateFocus.buildTypeFocus;
	let focusGroup = $.grep(buildings, function(n) {
		return n.type === focus
	})

	if(focusGroup) {
		for(let i = 0; i < focusGroup.length; i++) {
			let btn = document.createElement("div");
			btn.setAttribute("id", "buildBtn" + focusGroup[i].id)
			btn.setAttribute("class", "gridBoxCenter");

			btn.style.background = "green";
			btn.style.border = "solid";
			btn.style.marginBottom = "1vh"
			btn.style.padding = "1vh";

			let text = document.createElement("div");
			text.setAttribute("class", "textBoxCenter")
			text.innerText = focusGroup[i].name

			target.append(btn)
			btn.append(text);

			btn.addEventListener("click", function() {
				if(gameState.buildItemFocus != focusGroup[i] && gameStateFocus.buildItemFocus != false) {
					let btn = document.getElementById("buildBtn" + gameStateFocus.buildItemFocus.id)
					if(btn) {
						btn.style.background = "green"
					}
				}
				gameStateFocus.buildItemFocus = focusGroup[i]
				buildSelection();
			})
		}
	}
}


function buildSelection() {
	let btn = document.getElementById("buildBtn" + gameState.buildings.buildItemFocus.id)
	console.log(gameState.buildings.buildItemFocus.id)
	btn.style.background = "red"
	let desc = document.getElementById("buildBoxDescDiv");
	desc.innerText = gameState.buildings.buildItemFocus.desc
	$("#" + btn.id).off();
}

//buildBoxHandler--End of the buildBoxHandler functions

//buildingFunction--Start of the building functions
// Filters between different building options to display the correct sceneHome
function buildingFilter(x) {
	let target = x;
	console.log(target)
	if(target != undefined) {
		if(gameState.buildingSceneFocus && gameState.buildingSceneFocus != target) {
			let oldTarget;
			if(gameState.buildingSceneFocus.subType === false) {
				oldTarget = document.getElementById("building" + gameState.buildingSceneFocus.type + "Scene")
			}
			else {
				oldTarget = document.getElementById("building" + gameState.buildingSceneFocus.subType + "Scene")
			}
			oldTarget.style.display = "none";
		}
		let buildContainer = document.getElementById("buildingSceneBox")
		sceneChange(buildContainer)
		gameState.buildingSceneFocus = target
		console.log(target)
		let scene;
		if(target.subType === false) {
			scene = document.getElementById("building" + target.type + "Scene")
			$("#building" + target.type + "SceneDesc").text(target.desc)
		}
		else {
			scene = document.getElementById("building" + target.subType + "Scene")
			$("#building" + target.subType + "SceneDesc").text(target.desc)
		}
		if(target.type == "Training") {
			trainingSceneHandler(target);
			buildingTrainingSceneUpdater();
			for(let i = 0; i < target.capacity; i++) {
				occupantSlotSetup(target, i, scene)
			}
		}
		else if(target.type == "Modification" && target.subType === false) {
			console.log("I made it to the modificationSceneHandler!");
			buildingModificationSceneUpdater();
			modificationSceneHandler(target);
		}
		else if(target.type == "Modification" && target.subType === "Tattoo") {
			tattooSceneHandler(target)
		}
		scene.style.display = "grid"
	}
	else {
		console.log("Something has gone wrong with the building filter. Target is undefined!")
	}
}
//buildingFunction--End of Building Functions

// personnelFunctions--Start of Personnel Functions
function personnelSetup() {
	let personnelSidePanel = document.getElementById("dollStatContainer");
	let personnelContainer = personnelSidePanel.querySelector(".gridBoxCenter95")

	clearBox(personnelContainer)

	let patients = gameState.personnel.patients;

	for(let i = 0; i < patients.length; i++) {

		let newSlot = slotBuilder(patients[i], personnelContainer)

		let textName = newSlot.querySelector(".textBoxLeft");
		let textStatus = newSlot.querySelector(".textBoxRight");

		textName.innerText = patients[i].name;
		textStatus.innerText = patients[i].status;

		newSlot.addEventListener("click", function() {
			personnelInformationHandler(patients[i])
			let scene = document.getElementById("scenePersonnelInformation")
			sceneChange(scene, "grid")
		})
	}
}

// Personnel Character filter
function personnelGenerator() {
	let generatedCharacter =  {name: false, id: false, desc: false, changeFlag: false, status: false, sexuality: false, appearance: {gender: {name: false, pronounPersonal: false, pronounPossesive: false}, bodyType: false, hairColor: false, hairLength: false, bodySize: false, height: false, hipSize: false, waistSize: false, clothingCheck:{shirt: false, pants: false, underClothing: false, dress: false}},skills: {}, traits: [], stats:{res: false, str: false, int: false}}
	console.log(generatedCharacter)
	// Body Generator

	//Body Type Selector
	let bodyTypeRand = Math.floor(Math.random() * bodyType.length);
	let selectedBodyType = bodyType[bodyTypeRand];
	generatedCharacter.appearance.bodyType = selectedBodyType;
	console.log("Max: " + selectedBodyType.max + " Min: " + selectedBodyType.min)

	for(let i = 0; i < bodyParts.length; i++) {
		for(let key in bodyParts[i]) {
			if (bodyParts[i].hasOwnProperty(key)) {
				console.log(key)
				value = bodyParts[i][key];
				console.log(value)
				for(let key2 in value) {
					console.log(key2)
					let rand = Math.floor(Math.random() * (selectedBodyType.max - selectedBodyType.min + 1)+ selectedBodyType.min)
					console.log(rand)
					let choice = value[key2][rand]
					console.log(choice)
					generatedCharacter.appearance[key] = {[key2]:choice}
				}
			}
		}
	}
	for(let i = 0; i < bodyPartsAlt.length; i++) {
		console.log(bodyPartsAlt[i])
		for(let key in bodyPartsAlt[i]) {
			console.log(key)
			if (bodyPartsAlt[i].hasOwnProperty(key)) {
				console.log(key)
				value = bodyPartsAlt[i][key];
				console.log(value)
				for(let key2 in value) {
					console.log(key2)
					let rand = Math.floor(Math.random() * value[key2].length)
					console.log(rand)
					console.log(value[key2])
					let choice = value[key2][rand]
					console.log(choice)
					let newObj = {[key2]:choice}
					if(!generatedCharacter.appearance[key]) {
						generatedCharacter.appearance[key] = {};
					}
					Object.assign(generatedCharacter.appearance[key], newObj)
				}
			}
		}
	}

	let skillAmount = Math.floor(Math.random() * 3) + 1;
	let skillArrayClone =  structuredClone(startingSkills)
	console.log(skillArrayClone)
	for(let i = 0 ; i < skillAmount; i++) {
		let skillChoice = Math.floor(Math.random() * skillArrayClone.length);
		let chosenSkill = skillArrayClone[skillChoice];
		skillArrayClone.splice(skillChoice, 1);
		chosenSkill.int = Math.floor(Math.random() * 50)
		generatedCharacter.skills[chosenSkill.id] = chosenSkill;
	}
	//Gender Selector
	let selectedGender = Math.floor(Math.random() * genders.length);
	generatedCharacter.appearance.gender = genders[selectedGender]
	//Clothing Generator
	let clothingSelectionArray = startingClothing.slice()
	for(let i = 0; i < clothingSelectionArray.length; i++) {
		for(let key in clothingSelectionArray[i]) {
			if (clothingSelectionArray[i].hasOwnProperty(key)) {
				value = clothingSelectionArray[i][key];
				let rand = Math.floor(Math.random() * value.length);
				console.log(rand)
				let choice = value[rand]
				// Checks to see if any of the clothes conflicts with each other and rolls again if so.
				if(generatedCharacter.appearance.clothingCheck[choice.type] === true) {
					while(generatedCharacter.appearance.clothingCheck[choice.type] === true) {
						let rand = Math.floor(Math.random() * value.length);
						choice = value[rand]
					}
				}
				else if(choice.con) {
					for(let c = 0; c < choice.con.length; c++) {
						generatedCharacter.appearance.clothingCheck[choice.con[c]] = true;
					}
				}
				generatedCharacter.appearance[key] = choice
			}
		}
	}
	//Name Selector
	if(generatedCharacter.appearance.gender.name === "man") {
		let selectedName = Math.floor(Math.random() * firstName.manNames.length);
		generatedCharacter.name = firstName.manNames[selectedName]
	}
	else if(generatedCharacter.appearance.gender.name == "woman") {
		let selectedName = Math.floor(Math.random() * firstName.womanNames.length);
		generatedCharacter.name = firstName.womanNames[selectedName]
	}
	//Sexuality Selector
	let selectedSexuality = Math.floor(Math.random() * sexuality.length);
	generatedCharacter.sexuality = sexuality[selectedSexuality]
	//Trait Selector
	let traitCount = Math.floor(Math.random() * 4) + 1;
	let traitSelectionArray = startingTraits.slice();
	console.log("Trait Count " + traitCount)
	for(let i = 0; i < traitCount; i++) {
		let rand = Math.floor(Math.random() * traitSelectionArray.length);
		let selectedTrait = traitSelectionArray[rand];
		personnelStatCounter(selectedTrait, generatedCharacter)
		traitSelectionArray.splice(rand, 1);
		generatedCharacter.traits.push(selectedTrait);
	}

	//Status Setter
	generatedCharacter.status = "Idle";
	//Moves generatedCharacter to the gameState
	gameState.personnel.patients.push(generatedCharacter)
	console.log(generatedCharacter)

	function personnelStatCounter(x, y) {
		let stat = x;
		let character = y;

		let res = stat["res"];
		let str = stat["str"];
		let int = stat["int"];

		character.stats.res += res;
		character.stats.str += str;
		character.stats.int += int;
	}
}
// Ensures the personnelInformation screen is always up to date and showing the correct character.
function personnelInformationHandler(x) {
	let characterFocus = x;
	gameState.personnel.focus = characterFocus;
	console.log("Game State Focus: " + gameState.personnel.focus.name)

	traitsPanelSetup(characterFocus.traits)
	skillsPanelSetup(characterFocus.skills)

	let wardrobeSelection = document.getElementById("personnelInformationWardrobeSelection")
	clearBox(wardrobeSelection)

	$("#scenePersonnelInformationCharName").text(characterFocus.name)
	$("#scenePersonnelInformationCharGender").text(capitalizeFunc(characterFocus.appearance.gender.name))
	$("#scenePersonnelInformationCharSexuality").text(capitalizeFunc(characterFocus.sexuality))
	$("#scenePersonnelInformationCharBodyType").text(capitalizeFunc(characterFocus.appearance.bodyType.name))
	$("#scenePersonnelInformationCharStr").text(characterFocus.stats.str)
	$("#scenePersonnelInformationCharRes").text(characterFocus.stats.res)
	$("#scenePersonnelInformationCharInt").text(characterFocus.stats.int)
	if(characterFocus.desc === false || characterFocus.changeFlag === true) {
		characterFocus.desc = textHandler(characterFocus, text.personnelInformationSceneDesc.desc)
		$("#scenePersonnelInformationDesc").text(characterFocus.desc)
	}
	else {
		$("#scenePersonnelInformationDesc").text(characterFocus.desc)
	}
	//personnelInformation Traits Panel Setup
	function traitsPanelSetup(x) {
		let traits = x;
		let scene = document.getElementById("scenePersonnelInformationTraits");

		clearBox(scene)

		for(let i = 0; i < traits.length; i++) {
			let traitContainer = document.createElement("div");
			let traitCenter = document.createElement("div");
			let traitBorderBox = document.createElement("div");
			let traitInnerContainer = document.createElement("div");
			let traitInnerText = document.createElement("div");

			traitContainer.setAttribute("class", "gridBoxFull");
			traitCenter.setAttribute("class", "gridBoxCenter99");
			traitBorderBox.setAttribute("class", "borderBoxFullREdgeHidden");
			traitInnerContainer.setAttribute("class", "gridBoxFull");
			traitInnerText.setAttribute("class", "gridBoxCenter");

			traitContainer.append(traitCenter);
			traitCenter.append(traitBorderBox);
			traitBorderBox.append(traitInnerContainer);
			traitInnerContainer.append(traitInnerText);

			scene.append(traitContainer)

			traitBorderBox.style.background = "darkslateblue"
			traitInnerText.innerText = traits[i].name
		}
	}
	function skillsPanelSetup(x) {
		let skills = x
		let panel = document.getElementById("personnelInformationSkillPanel");

		clearBox(panel)

		for(let key in skills) {
			console.log(skills)
			console.log("Look at this key: " + key)
			let skillSlot = document.createElement("div");
			let skillDualRow = document.createElement("div");
			let skillDualColumn = document.createElement("div");
			let skillGridBox = document.createElement("div");
			let progressBar = document.createElement("div");
			let progressBarProgress = document.createElement("div");

			skillSlot.setAttribute("class", "slotContainerBorder");
			skillDualRow.setAttribute("class", "gridBoxDualRowGap");
			skillDualColumn.setAttribute("class", "gridBoxDualColumnGap");
			skillGridBox.setAttribute("class", "gridBoxFull");
			progressBar.setAttribute("class", "progressBar");
			progressBarProgress.setAttribute("class", "progressBarProgress");

			progressBarProgress.setAttribute("id", "personnelInformation" + key);

			skillGridBox.innerText = skills[key].name;
			let progress = progressCheck(skills[key].int, 100);
			progressBarProgress.style.width = progress + "%"

			panel.append(skillSlot);
			skillSlot.append(skillDualRow);
			skillDualRow.append(skillDualColumn);
			skillDualColumn.append(skillGridBox);
			skillDualRow.append(progressBar);
			progressBar.append(progressBarProgress);
		}
	}
}

// Start of the personnelInformationWardrobeFunction
$(function personnelWardrobeSetup() {
	console.log("Howdy I am personnelWardrobe")
	$("#personnelInformationWardrobeBtnHeadWear").on("click", function() {
		personnelWardrobe("headWear");
	})
	$("#personnelInformationWardrobeBtnEyeWear").on("click", function() {
		personnelWardrobe("eyeWear");
	})
	$("#personnelInformationWardrobeBtnNeckWear").on("click", function() {
		personnelWardrobe("neckWear");
	})
	$("#personnelInformationWardrobeBtnNeckJewelery").on("click", function() {
		personnelWardrobe("neckJewelery");
	})
	$("#personnelInformationWardrobeBtnEarrings").on("click", function() {
		personnelWardrobe("earrings");
	})
	$("#personnelInformationWardrobeBtnRings").on("click", function() {
		personnelWardrobe("rings");
	})
	$("#personnelInformationWardrobeBtnUpperBody").on("click", function() {
		personnelWardrobe("upperBody");
	})
	$("#personnelInformationWardrobeBtnOverShirt").on("click", function() {
		personnelWardrobe("overShirt");
	})
	$("#personnelInformationWardrobeBtnUnderwear").on("click", function() {
		personnelWardrobe("underwear")
	})
	$("#personnelInformationWardrobeBtnLowerBody").on("click", function() {
		personnelWardrobe("lowerBodyClothing");
	})
	$("#personnelInformationWardrobeBtnGenitals").on("click", function() {
		personnelWardrobe("genitalJewelery");
	})
	$("#personnelInformationWardrobeBtnLegs").on("click", function() {
		personnelWardrobe("legWear");
	})
	$("#personnelInformationWardrobeBtnFeet").on("click", function() {
		personnelWardrobe("feetWear");
	})
})
//End of the personnelInformationSetup

function personnelWardrobe(x) {
	let wardrobeSelection = document.getElementById("personnelInformationWardrobeSelection")
	clearBox(wardrobeSelection)
	let clothingFocus = x;
	let charFocus = gameState.personnel.focus;
	let selectedArray = clothing[clothingFocus]
	for(let i = 0; i < selectedArray.length; i++) {
		let btnContainer = document.createElement("div");
		let btnCenter99 = document.createElement("div");
		let btnBackground = document.createElement("div");
		let btnInnerContainer = document.createElement("div");
		let btnText = document.createElement("div");

		btnContainer.setAttribute("class", "gridBoxFull");
		btnCenter99.setAttribute("class", "gridBoxCenter99");
		btnBackground.setAttribute("class", "borderBoxFullREdgeHidden");
		btnInnerContainer.setAttribute("class", "gridBoxFull");
		btnText.setAttribute("class", "gridBoxCenter");

		btnText.innerText = capitalizeFunc(selectedArray[i].name);
		btnText.style.color = "white";
		btnBackground.style.backgroundColor = "darkslateblue";

		btnContainer.append(btnCenter99);
		btnCenter99.append(btnBackground);
		btnBackground.append(btnInnerContainer);
		btnInnerContainer.append(btnText);

		wardrobeSelection.append(btnContainer)

		btnContainer.addEventListener("click", function() {
			console.log(charFocus.appearance[clothingFocus])
			charFocus.appearance[clothingFocus] = selectedArray[i];
			charFocus.desc = textHandler(charFocus, text.personnelInformationSceneDesc.desc)
			$("#scenePersonnelInformationDesc").text(charFocus.desc)
		})
	}
}
//personnelFunctions--End of the Personnel Function

//trainingSceneFunctions -- Start of the Training Scene Function
function trainingSceneHandler(x) {
	let building = x;
	console.log(building)
	let scene = document.getElementById("buildingTrainingScene")
	let desc = document.getElementById("buildingTrainingSceneDesc")
	console.log(desc)
	desc.innerText = building.desc;
	characterTrainingSelect();
	capacityCheck("buildingTrainingScene", building)


	function characterTrainingSelect() {
		console.log("I made it down to the character Training select ma!")
		let panel = document.getElementById("trainingSceneCharacterSelectionPanel");
		clearBox(panel)
		for(let i = 0; i < gameState.personnel.patients.length; i++) {
			console.log("Looks like I have some patients!")
			let charContainer = document.createElement("div");
			let charBorderBox = document.createElement("div");
			let charGridBoxFull = document.createElement("div");
			let charBox99 = document.createElement("div");
			let charBoxDualRow = document.createElement("div");
			let charNameContainer = document.createElement("div");
			let charNameCenter = document.createElement("div");
			let charNameTextBox = document.createElement("div");
			let charDescContainer = document.createElement("div");
			let charDescCenter = document.createElement("div");
			let charDescTextBox = document.createElement("div");

			charContainer.setAttribute("class", "gridBox");
			charBorderBox.setAttribute("class", "borderBoxFullREdgeHidden");
			charGridBoxFull.setAttribute("class", "gridBoxFull");
			charBox99.setAttribute("class", "gridBoxCenter99");
			charBoxDualRow.setAttribute("class", "gridBoxDualRowGap");
			charNameContainer.setAttribute("class", "gridBoxFull");
			charNameCenter.setAttribute("class", "gridBoxCenter");
			charNameTextBox.setAttribute("class", "textBoxCenter");
			charDescContainer.setAttribute("class", "gridBoxFull");
			charDescCenter.setAttribute("class", "gridBoxCenter");
			charDescTextBox.setAttribute("class", "textBoxCenter");

			panel.append(charContainer);
			charContainer.append(charBorderBox);
			charBorderBox.append(charGridBoxFull);
			charGridBoxFull.append(charBox99);
			charBox99.append(charBoxDualRow)
			charBoxDualRow.append(charNameContainer);
			charNameContainer.append(charNameCenter);
			charNameCenter.append(charNameTextBox);
			charBoxDualRow.append(charDescContainer);
			charDescContainer.append(charDescCenter);
			charDescCenter.append(charDescTextBox);

			charContainer.style.height = "10vh";
			charBorderBox.style.background = "mediumslateblue";

			charNameTextBox.innerText = gameState.personnel.patients[i].name
			charDescTextBox.innerText = gameState.personnel.patients[i].appearance.gender.name
			let occupyCheck = false;
			for(let k = 0; k < gameState.buildingSceneFocus.capacity; k++) {
				if(gameState.buildingSceneFocus.occupant[k] === gameState.personnel.patients[i]) {
					charBorderBox.style.background = "red"
					occupyCheck = true;
					charContainer.addEventListener("click", function() {
						gameState.buildingSceneFocus.occupant[k] = false;
						occupantSlotSetup(gameState.buildingSceneFocus, k, scene)
						characterTrainingSelect();
					})
					break;
				}
			}
			if(occupyCheck != true) {
				charContainer.addEventListener("click", function() {
					occupantCheck(gameState.personnel.patients[i])
					for(let k = 0; k < gameState.buildingSceneFocus.capacity; k++) {
						console.log(k)
						if(!gameState.buildingSceneFocus.occupant[k]) {
							gameState.buildingSceneFocus.occupant[k] =  gameState.personnel.patients[i]
							occupantSlotSetup(gameState.buildingSceneFocus, k, scene)
							characterTrainingSelect()
							break;
						}
					}
				})
			}
		}
	}
}
//trainingFunction -- End of the Training Scene Function
//Start of the Modification Scene Handler
function modificationSceneHandler(x) {
	let progressBar = document.getElementById("modificationSceneProgressBar")
	let progressText = document.getElementById("modificationSceneProgressText")
	let charPanel = document.getElementById("modificationSceneCharacterSelectionPanel");
	let panel = document.getElementById("modificationSceneSurgeryFocusPanel")
	let selectionPanel = document.getElementById("modificationSceneSurgeryFocusPanelChangePanel")
	let hidePanel = document.getElementById("buildingModificationSceneSurgeryNoOccupantCover")
	let activePanel = document.getElementById("buildingModificationSceneSurgeryActiveCover")
	let building = x;
	buildingSceneBtnSetup();
	characterModificationSelect();
	surgeryPanelFocusSetup();

	function buildingSceneBtnSetup() {
		$("#buildingModificationSceneSurgeryFocusBtnHead").off();
		$("#buildingModificationSceneSurgeryFocusBtnUpperBody").off();
		$("#buildingModificationSceneSurgeryFocusBtnLowerBody").off();

		$("#buildingModificationSceneSurgeryFocusBtnHead").on("click", function() {
			building.bodyPartFocus = "head"
			surgeryPanelFocusSetup();
		})
		$("#buildingModificationSceneSurgeryFocusBtnUpperBody").on("click", function() {
			building.bodyPartFocus = "upperbody"
			surgeryPanelFocusSetup();
		})
		$("#buildingModificationSceneSurgeryFocusBtnLowerBody").on("click", function() {
			building.bodyPartFocus = "lowerbody"
			surgeryPanelFocusSetup();
		})
	}

	function characterModificationSelect() {
		clearBox(charPanel)
		for(let i = 0; i < gameState.personnel.patients.length; i++) {
			let charContainer = document.createElement("div");
			let charBorderBox = document.createElement("div");
			let charGridBoxFull = document.createElement("div");
			let charBox99 = document.createElement("div");
			let charBoxDualRow = document.createElement("div");
			let charNameContainer = document.createElement("div");
			let charNameCenter = document.createElement("div");
			let charNameTextBox = document.createElement("div");
			let charDescContainer = document.createElement("div");
			let charDescCenter = document.createElement("div");
			let charDescTextBox = document.createElement("div");

			charContainer.setAttribute("class", "gridBox");
			charBorderBox.setAttribute("class", "borderBoxFullREdgeHidden");
			charGridBoxFull.setAttribute("class", "gridBoxFull");
			charBox99.setAttribute("class", "gridBoxCenter99");
			charBoxDualRow.setAttribute("class", "gridBoxDualRowGap");
			charNameContainer.setAttribute("class", "gridBoxFull");
			charNameCenter.setAttribute("class", "gridBoxCenter");
			charNameTextBox.setAttribute("class", "textBoxCenter");
			charDescContainer.setAttribute("class", "gridBoxFull");
			charDescCenter.setAttribute("class", "gridBoxCenter");
			charDescTextBox.setAttribute("class", "textBoxCenter");

			charPanel.append(charContainer);
			charContainer.append(charBorderBox);
			charBorderBox.append(charGridBoxFull);
			charGridBoxFull.append(charBox99);
			charBox99.append(charBoxDualRow)
			charBoxDualRow.append(charNameContainer);
			charNameContainer.append(charNameCenter);
			charNameCenter.append(charNameTextBox);
			charBoxDualRow.append(charDescContainer);
			charDescContainer.append(charDescCenter);
			charDescCenter.append(charDescTextBox);

			charContainer.style.height = "7vh";
			charBorderBox.style.background = "darkslateblue";

			charNameTextBox.innerText = gameState.personnel.patients[i].name
			charDescTextBox.innerText = gameState.personnel.patients[i].appearance.gender.name

			if(building.occupant[0] === gameState.personnel.patients[i]) {
				charBorderBox.style.background = "red"
			}

			if(building.potentialOccupant === gameState.personnel.patients[i]) {
				charBorderBox.style.background = "yellow"
			}

			charContainer.addEventListener("click", function() {
				if(building.occupant[0] != gameState.personnel.patients[i] && !building.occupant[0]) {
					hidePanel.style.display = "none"
					building.potentialOccupant = gameState.personnel.patients[i]
					for(let c = 0; c < charPanelSlots.length; c++) {
						charPanelSlots[c].style.background = "darkslateblue"
					}
					charBorderBox.style.background = "yellow"
					if(building.selectedIndivdualPart != false) {
						surgerySelectionPanelSetup(building.selectedIndivdualPart)
					}
					else {
						surgeryPanelFocusSetup();
					}
				}
				else if(building.occupant[0] === gameState.personnel.patients[i]){
					building.occupant[0] =  false;
					hidePanel.style.display = "grid"
					activePanel.style.display = "none"
					progressBar.style.width = "0%"
					progressText.innerText = "Current Surgery Progress: Unoccupied"
					building.progress = 0;
					characterModificationSelect();
				}
			})
		}
		let charPanelSlots = charPanel.querySelectorAll(".borderBoxFullREdgeHidden")
	}

	function surgeryPanelFocusSetup() {
		let focusBody = bodyPartsObj[building.bodyPartFocus];
		if(!focusBody) {
			building.bodyPartFocus = "head"
			focusBody = bodyPartsObj[building.bodyPartFocus]
		}
		clearBox(panel)
		clearBox(selectionPanel)
		for(let key in focusBody) {
			let partFocus = focusBody[key]

			if(partFocus) {
				for(let key in partFocus) {

					let surgeryFocusPanelBlockBox = document.createElement("div");
					let surgeryFocusPanelBackground = document.createElement("div");
					let surgeryFocusPanelGridBoxFull = document.createElement("div");
					let surgeryFocusPanelGridBoxCenter = document.createElement("div");

					surgeryFocusPanelBlockBox.setAttribute("class", "blockBox");
					surgeryFocusPanelBackground.setAttribute("class", "borderBoxFullREdgeHidden");
					surgeryFocusPanelGridBoxFull.setAttribute("class", "gridBoxFull");
					surgeryFocusPanelGridBoxCenter.setAttribute("class", "gridBoxCenter");

					panel.append(surgeryFocusPanelBlockBox)
					surgeryFocusPanelBlockBox.append(surgeryFocusPanelBackground);
					surgeryFocusPanelBackground.append(surgeryFocusPanelGridBoxFull);
					surgeryFocusPanelGridBoxFull.append(surgeryFocusPanelGridBoxCenter);
					console.log(partFocus)
					surgeryFocusPanelGridBoxCenter.innerText = partFocus[key][0].name

					surgeryFocusPanelBackground.style.background = "darkslateblue"
					surgeryFocusPanelBlockBox.style.height = "2.5vh"

					let selectionPanel = document.getElementById("modificationSceneSurgeryFocusPanelChangePanel")

					surgeryFocusPanelBlockBox.addEventListener("click", function() {
						building.selectedIndivdualPart = partFocus[key]
						surgerySelectionPanelSetup(partFocus[key])
					})
				}
			}
		}
	}

	function surgerySelectionPanelSetup(x) {
		let partFocus = x;
		clearBox(selectionPanel)
		for(let i = 1; i < partFocus.length; i++) {
			let surgeryFocusSelectionPanelBlockBox = document.createElement("div");
			let surgeryFocusSelectionPanelBackground = document.createElement("div");
			let surgeryFocusSelectionPanelGridBoxFull = document.createElement("div");
			let surgeryFocusSelectionPanelGridBoxCenter = document.createElement("div");

			surgeryFocusSelectionPanelBlockBox.setAttribute("class", "blockBox");
			surgeryFocusSelectionPanelBackground.setAttribute("class", "borderBoxFullREdgeHidden");
			surgeryFocusSelectionPanelGridBoxFull.setAttribute("class", "gridBoxFull");
			surgeryFocusSelectionPanelGridBoxCenter.setAttribute("class", "gridBoxCenter");

			selectionPanel.append(surgeryFocusSelectionPanelBlockBox)
			surgeryFocusSelectionPanelBlockBox.append(surgeryFocusSelectionPanelBackground);
			surgeryFocusSelectionPanelBackground.append(surgeryFocusSelectionPanelGridBoxFull);
			surgeryFocusSelectionPanelGridBoxFull.append(surgeryFocusSelectionPanelGridBoxCenter);

			surgeryFocusSelectionPanelGridBoxCenter.innerText = capitalizeFunc(partFocus[i].name)

			surgeryFocusSelectionPanelBackground.style.background = "mediumslateblue"
			surgeryFocusSelectionPanelBlockBox.style.height = "2.5vh"
			console.log(partFocus[0].type)
			console.log(partFocus[0].part)
			console.log(building.potentialOccupant.appearance[partFocus[0].part])
			console.log(building.potentialOccupant.appearance[partFocus[0].part][partFocus[0].type])
			if(building.potentialOccupant.appearance[partFocus[0].part][partFocus[0].type].name != partFocus[i].name) {
				surgeryFocusSelectionPanelBlockBox.addEventListener("click", function() {
					occupantCheck(building.potentialOccupant)
					building.occupant[0] = building.potentialOccupant;
					building.bodyPartSelected = partFocus[i]
					building.potentialOccupant = false
					activePanel.style.display = "grid"
					progressBar.style.width = "0%"
					progressText.innerText = "Current Surgery Progress: 0.00%"
					characterModificationSelect();
				})
			}
			else {
				surgeryFocusSelectionPanelBackground.style.background = "red"
			}
		}
	}
}
//End of the Modification Scene Handler
//Start of the Tattoo Scene Handler
function tattooSceneHandler(x) {
	let building = x;
	let panel = document.getElementById("buildingTattooSceneBodySectionFocusPanel");
	btnSetup();
	function btnSetup() {
		$("#buildingTattooSceneBodySectionFocusBtnHead").on("click", function() {
			tattooSceneBodyPartSelectorSetup("head");
		})

		$("#buildingTattooSceneBodySectionFocusBtnUpperBody").on("click", function() {
			tattooSceneBodyPartSelectorSetup("upperbody")
		})

		$("#buildingTattooSceneBodySectionFocusBtnLowerBody").on("click", function() {
			tattooSceneBodyPartSelectorSetup("lowerbody")
		})
	}

	function inputSetup() {

	}


	function tattooSceneBodyPartSelectorSetup(x) {
		building.bodyPartFocus = x;
		let focusBody = bodyPartsObj[building.bodyPartFocus];
		if(!focusBody) {
			building.bodyPartFocus = "head"
			focusBody = bodyPartsObj[building.bodyPartFocus]
		}
		clearBox(panel)
		for(let key in focusBody) {
			let partFocus = focusBody[key]
			console.log(focusBody)
			if(partFocus) {
				for(let key in partFocus) {
					console.log(partFocus)
					console.log(partFocus[key])
					let tattooFocusPanelBlockBox = document.createElement("div");
					let tattooFocusPanelBackground = document.createElement("div");
					let tattooFocusPanelGridBoxFull = document.createElement("div");
					let tattooFocusPanelGridBoxCenter = document.createElement("div");

					tattooFocusPanelBlockBox.setAttribute("class", "blockBox");
					tattooFocusPanelBackground.setAttribute("class", "borderBoxFullREdgeHidden");
					tattooFocusPanelGridBoxFull.setAttribute("class", "gridBoxFull");
					tattooFocusPanelGridBoxCenter.setAttribute("class", "gridBoxCenter");

					panel.append(tattooFocusPanelBlockBox)
					tattooFocusPanelBlockBox.append(tattooFocusPanelBackground);
					tattooFocusPanelBackground.append(tattooFocusPanelGridBoxFull);
					tattooFocusPanelGridBoxFull.append(tattooFocusPanelGridBoxCenter);

					tattooFocusPanelGridBoxCenter.innerText = capitalizeFunc(partFocus[key][0].part)

					tattooFocusPanelBackground.style.background = "mediumslateblue"
					tattooFocusPanelBlockBox.style.height = "2.5vh"

					let selectionPanel = document.getElementById("modificationSceneSurgeryFocusPanelChangePanel")

					tattooFocusPanelBlockBox.addEventListener("click", function() {
						building.selectedIndivdualPart = partFocus[key]
						surgerySelectionPanelSetup(partFocus[key])
					})
				}
			}
		}
	}
}
//End of the Tattoo Scene Handler
//Start of Text Handler
function textHandler(x, y) {
	let textFocus = x
	let textString = y
	let parsedString = textString.split(" ");
	for(let i = 0; i < parsedString.length; i++) {
		if(parsedString[i].charAt(0) === "$" || parsedString[i].charAt(0) === "+") {
			let finalText = valueParser(parsedString[i])
			textString = textString.replace(parsedString[i], finalText)
		}
		else if(parsedString[i].charAt(0) === "/") {
			let finalText = splitParser(parsedString[i]);
			textString = textString.replace(parsedString[i], finalText)
		}
	}
	textString = textString.replaceAll(" .", ".")
	return textString;

	function valueParser(x, ) {
		let split = x
		let flagCap
		// If a + is found by the split check it will split off the + that indicates a capitalization and mark flagCap as true
		if(split.charAt(0) === "+") {
			let capSplit = split.split("+")
			split = capSplit[1];
			flagCap = true;
		}
		split = x.split("$");
		let keyText = library[split[1]];
		let finalText = textFocus;
		for(let c = 0; c < keyText.length; c++) {
			finalText = finalText[keyText[c]]
		}
		// If flagCap is true it capitalizes the final text before returning it
		if(flagCap === true) {
			finalText = capitalizeFunc(finalText)
		}
		return finalText;
	}

	function splitParser(x) {
		let appearance, primaryString, check, finalText
		appearance = textFocus.appearance;
		primaryString = x.split("/");
		check = true;
		let values = primaryString[1].split("^");
		finalText = values[1];
		let parsedValues = values[0].split("-")
		for(let c = 0; c < parsedValues.length; c++) {
			check = true;
			let falseCheck = false;
			let key = parsedValues[c].split("=");
			let charValue = key[1];
			if(charValue.charAt(0) === "!") {
				falseCheck = true
				let falseCheckRemoved = charValue.split("!");
				charValue = falseCheckRemoved[1];
			}
			console.log("Key: " + key)
			console.log("CharValue: " + charValue)
			let charAttr = valueParser(key[0]);
			console.log(charAttr)
			if(charAttr != charValue && falseCheck === false){
				check = false
				finalText = ""
				break;
			}
			if(charAttr === charValue && falseCheck === true){
				finalText = "";
				check = false
				break;
			}
		}
		if(check === true) {
			finalTextSplit = finalText.split("_");
			for(let k = 0; k < finalTextSplit.length; k++) {
				if(finalTextSplit[k].charAt(0) === "$" || finalTextSplit[k].charAt(0) === "+") {
					let newValue = valueParser(finalTextSplit[k])
					finalText = finalText.replace(finalTextSplit[k], newValue)
				}
			}
			finalText = finalText.replaceAll("_", " ")
			finalText = finalText.replaceAll("*", "")
		}
		else {
			finalText ="";
		}
		return finalText;
	}
}
//End of Text Handler
// Sidepanel UI Builder Function

function slotBuilder(x, y) {
	let slotFocus = x;
	let slotAppendTarget = y;

	//Slot Container and Inner Container Setups
	let slotContainer = document.createElement("div");
	let slotGridDualRow = document.createElement("div")

	slotContainer.setAttribute("class", "slotContainerBorder");
	slotGridDualRow.setAttribute("class", "gridBoxDualRowGap");


	slotAppendTarget.append(slotContainer)
	slotContainer.append(slotGridDualRow);

	// Slot Rows Setup
	let slotInnerTopContainer = document.createElement("div");
	let slotInnerBottomContainer = document.createElement("div");

	slotInnerTopContainer.setAttribute("class", "gridBoxDualColumn");
	slotInnerBottomContainer.setAttribute("class", "gridBox");

	slotGridDualRow.append(slotInnerTopContainer);
	slotGridDualRow.append(slotInnerBottomContainer);

	// Top Slot Setups
	let slotInnerTopTextLeft = document.createElement("div");
	let slotInnerTopTextRight = document.createElement("div");

	slotInnerTopTextLeft.setAttribute("class", "textBoxLeft");
	slotInnerTopTextRight.setAttribute("class", "textBoxRight");

	slotInnerTopContainer.append(slotInnerTopTextLeft);
	slotInnerTopContainer.append(slotInnerTopTextRight);

	// Bottom Slot Setup
	let slotInnerBottomProgressDiv = document.createElement("div");
	let slotInnerBottomProgressBar = document.createElement("div");

	slotInnerBottomProgressDiv.setAttribute("class", "progressBar");
	slotInnerBottomProgressBar.setAttribute("class", "progressBarProgress");

	slotInnerBottomContainer.append(slotInnerBottomProgressDiv);
	slotInnerBottomProgressDiv.append(slotInnerBottomProgressBar);

	return slotContainer;

}

// Helper Functions
// Function that sets up a click event on an element and adds allows it to hide another element
function hideTarget(x, y) {
	let focus = x
	let target = y

	focus.addEventListener("click", function() {
		$("#" + target.id).slideToggle();
	})
}
// Clears out child elements
function clearBox(element)
{
	element.innerHTML = "";
}

//Capitalize First Letting in String Function
function capitalizeFunc(x) {
	let focus = x
	return focus.charAt(0).toUpperCase() + focus.slice(1)
}

//Math Fixer
function mathFixer(x, y) {
	let addInt = x
	let num = y
	let newNum = Number(num)
	newNum += addInt;
	newNum = newNum.toFixed(2);
	return newNum;
}

// Determines the current progress of a process and returns it
function progressCheck(x, y) {
	let currentProgress = x;
	let totalProgress = y;

	let currentPercentage = currentProgress / totalProgress
	currentPercentage = currentPercentage * 100;
	currentPercentage = currentPercentage.toFixed(2);
	return currentPercentage
}

// Hides prior scene and displays the new one. The y element is used if you want a specifc display type.
function sceneChange(x, y) {
	let newScene = x;
	if(newScene) {
		gameState.currentScene.prior = gameState.currentScene.current
		gameState.currentScene.current = newScene
	}

	else if(!newScene) {
		let holder = gameState.currentScene.current

		gameState.currentScene.current = gameState.currentScene.prior
		gameState.currentScene.prior = holder;

		newScene = gameState.currentScene.current
	}
	let parent = $(newScene).parent([".sceneContainerHidden"])
	if(parent[0] != gameState.currentScene.parent) {
		parent[0].style.display = "grid";
		gameState.currentScene.parent.style.display = "none"
		gameState.currentScene.parent = parent[0]
	}

	let oldScene = gameState.currentScene.prior;

	$("#" + oldScene.id).css({"display": "none"});
	$("#" + newScene.id).show();

	if(y) {
		$("#" + newScene.id).css({"display": y})
	}
}
//Start of Occupant Check
function occupantCheck(x) {
	let occupantFocus = x;
	let buildingSlots = gameState.buildings.buildingSlots;
	for(let k = 0; k < buildingSlots.length; k++) {
		for(let i = 0; i < buildingSlots[k].capacity; i++) {
			if (buildingSlots[k].occupant[i] === occupantFocus) {
				buildingSlots[k].occupant[i] = false;
				buildingSlots[k].progress = 0;
			}
		}
	}
}
//End of Occupant Check

//Occupant Slot Setup
function occupantSlotSetup(x, y, z) {
	let occupantSlots = z.querySelectorAll(".occupantCapacitySlot");
	let focus = x.occupant[y];
	let skill = x.stat;
	let count = y;
	let textBoxes = occupantSlots[y].querySelectorAll(".textBoxCenter");
	let progress = occupantSlots[y].querySelector(".progressBarProgress");

	if(focus == false || !focus) {
		progress.style.width = "0%"
		textBoxes[0].innerText = "Unoccupied"
		textBoxes[2].innerText = "0%";
		return 0;
	}
	if(!focus.skills[skill]) {
		progress.style.width = "0%"
		textBoxes[0].innerText = focus.name;
		textBoxes[2].innerText = "0%";
	}
	else {
		let progressInt = progressCheck(focus.skills[skill].int, 100)
		progress.style.width = progressInt + "%"
		textBoxes[0].innerText = focus.name;
		textBoxes[2].innerText = progressInt + "%"
	}
}
//End of Occupant Slot Setup
//Capacity Check
function capacityCheck(x, y) {
	let target = x;
	let building = y
	let primaryElement = document.getElementById(target);
	console.log(primaryElement)
	let occupantSlots = primaryElement.querySelectorAll(".occupantCapacitySlot");
	console.log(occupantSlots)
	for(let i = 0; i < occupantSlots.length; i++) {
		if(building.capacity > i) {
			occupantSlots[i].style.display = "grid";
		}
		else {
			occupantSlots[i].style.display = "none";
		}
	}
}
//End of Capacity Check
//Arrays
//BuildingArrays
let buildingTypes = [
	{ id: "conditioningSlot", type: "Conditioning", name: "Conditioning", cost: 10, build: 5, unlocked: true, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
{ id: "kinkTrainer", type: "Kink", name: "Kink Trainer", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
{ id: "patientCapacity", type: "Capacity", name: "Patient Capacity", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
{ id: "bodyChanger", type: "Modification", name: "Body Changer", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
{ id: "trainingSlot", type: "Training", name: "Training", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
]

let buildings = [
	{ id: "cookingTraining", name: "Basic Kitchen", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stat: "domesticTasks", statInt: 0.5, capacity: 2, trainable: true, skillTrainer: true, occupant: ["false"], occupantPrior: false, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

{ id: "cleaningTraining", name: "Mock Room", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stat: "domesticTasks", statInt: 0.5, capacity: 1, trainable: true, skillTrainer: true, occupantPrior: false, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

{ id: "makeupTraining", name: "Makeup Room", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stat: "makeup", statInt: 0.5, capacity: 2, trainable: true, skillTrainer: true, occupantPrior: false, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

{ id: "speechTraining", name: "Speech Training", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 1, trainable: true, skillTrainer: true, occupantPrior: false, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

{ id: "resistanceRemoval1", name: "Relaxation Center", type: "Conditioning", cost: 350, build: 5, unlocked: true, base: true, stat: "resistance", statInt: -1, capacity: 0, trainable: true, occupantPrior: false, desc: "A small room used for helping less enthusiastic wifes relax and accept their new role. With the aid of speakers sending a constant stream of subliminal messages to whoever occupies it." },

{ id: "hypnoUpg2", name: "Hypno Headphones", type: "Conditioning", cost: 1000, build: 10, unlocked: false, base: false, stats: "resistance/-10", capacity: 0, trainable: true, occupantPrior: false, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

{ id: "hypnoUpg3", name: "Hypno Headpiece", type: "Conditioning", cost: 2000, build: 10, unlocked: false, base: false, stats: "resistance/-20", capacity: 0, trainable: true, occupantPrior: false, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

{ id: "puppyUpg1", name: "Puppy Pound", type: "Kink", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, occupantPrior: false, desc: "A small room dedicated to training patients into good little puppies.", kinks: "petPlay"},

{ id: "farmUpg1", name: "Farm", type: "Kink", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, occupantPrior: false, desc: "A small room dedicated to training patients into good little puppies.", kinks: "farmPlay"},

{ id: "cellUpg1", name: "Cell", type: "Capacity", cost: 250, build: 5, unlocked: true, base: true, stats: "none", capacity: 1,trainable: false, occupantPrior: false, desc: "A small cell used to hold patients during their stay at the Spa." },

{ id: "basicSurgery", name: "Basic Surgery Station", type: "Modification",  cost: 750, build: 5, unlocked: false, base: true, stats: "none", bodyPartFocus: false, capacity: 1,trainable: false, occupantPrior: false, desc: "A basic surgery station used to enhance dolls." },

{ id: "tattooParlor", name: "Tattoo Parlor", type: "Modification",subType: "Tattoo", cost: 750, build: 5, unlocked: false, base: true, stats: "none", bodyPartFocus: false, capacity: 1,trainable: false, occupantPrior: false, desc: "A tattoo parlor for marking patients." }
]

// Character Arrays
// Body Parts

let height= {
	height:[
		{name: "very short"},
		{name: "short"},
		{name: "medium"},
		{name: "tall"},
		{name: "very tall"},
	]
}

let bodyPartsAlt = [

	head={
		hair: {
			hairColor:[
				{name: "green"},
				{name: "brown"},
				{name: "red"},
				{name: "brown"},
				{name: "black"},
				{name: "blue"},
			],

			hairLength:[
				{name: "short"},
				{name: "long"},
				{name: "medium"},
				{name: "really long"},
				{name: "bald"},
			],
		},

		eyes: {
			eyeColor:[
				{name: "green"},
				{name: "blue"},
				{name: "brown"},
				{name: "dark brown"},
				{name: "gray"},
			],
			eyeShape:[
				{name: "almond"},
				{name: "round"},
				{name: "downturned"},
				{name: "upturned"},
				{name: "hooded"},
			],
		},
		nose: {
			noseShape:[
				{name: "hooked"},
				{name: "straight"},
				{name: "snub"},
				{name: "bulbous"},
			],
		},
		lips: {
			lipShape:[
				{name: "full"},
				{name: "round"},
				{name: "thin"},
			],
		},
		ears: {
			earShape:[
				{name: "pointed"},
				{name: "narrow"},
				{name: "broad"},
			],
		},

	}
]

let bodyParts =[
	upperBody={
		breast : {
			breastSize:[
				{name: "flat", size: 0, tattoo: false},
				{name: "very tiny", size: 1, tattoo: false},
				{name: "tiny", size: 2, tattoo: false},
				{name: "very small", size: 3, tattoo: false},
				{name: "small", size: 4, tattoo: false},
				{name: "medium", size: 5, tattoo: false},
				{name: "plump", size: 6, tattoo: false},
				{name: "very plump", size: 7, tattoo: false},
				{name: "fat", size: 8, tattoo: false},
				{name: "very fat", size: 9, tattoo: false},
			],
		},
		shoulder: {
			shoulderWidth: [
				{name: "extremely tiny", size: 0, tattoo: false },
				{name: "very tiny", size: 1, tattoo: false},
				{name: "tiny", size: 2, tattoo: false},
				{name: "very small", size: 3, tattoo: false},
				{name: "small", size: 4, tattoo: false},
				{name: "medium", size: 5, tattoo: false},
				{name: "wide", size: 6, tattoo: false},
				{name: "very wide", size: 7, tattoo: false},
				{name: "broad", size: 8, tattoo: false},
				{name: "very broad", size: 9, tattoo: false},
			],
		},
		waist: {
			waistSize: [
				{name: "extremely tiny", size: 0, tattoo: false },
				{name: "very tiny", size: 1, tattoo: false},
				{name: "tiny", size: 2, tattoo: false},
				{name: "very small", size: 3, tattoo: false},
				{name: "small", size: 4, tattoo: false},
				{name: "medium", size: 5, tattoo: false},
				{name: "plump", size: 6, tattoo: false},
				{name: "very plump", size: 7, tattoo: false},
				{name: "thick", size: 8, tattoo: false},
				{name: "fat", size: 9, tattoo: false},
			],
		},
	},
lowerBody={
	hip: {
		hipSize:[
			{name: "extremely tiny", size: 0, tattoo: false },
			{name: "very tiny", size: 1, tattoo: false},
			{name: "tiny", size: 2, tattoo: false},
			{name: "very small", size: 3, tattoo: false},
			{name: "small", size: 4, tattoo: false},
			{name: "medium", size: 5, tattoo: false},
			{name: "wide", size: 6, tattoo: false},
			{name: "very wide", size: 7, tattoo: false},
			{name: "thick", size: 8, tattoo: false},
			{name: "hourglass", size: 9, tattoo: false},
		],
	},
	thigh: {
		thighSize: [
			{name: "extremely thin", size: 0, tattoo: false },
			{name: "very thin", size: 1, tattoo: false},
			{name: "thin", size: 2, tattoo: false},
			{name: "very small", size: 3, tattoo: false},
			{name: "small", size: 4, tattoo: false},
			{name: "medium", size: 5, tattoo: false},
			{name: "plump", size: 6, tattoo: false},
			{name: "very plump", size: 7, tattoo: false},
			{name: "thick", size: 8, tattoo: false},
			{name: "fat", size: 9, tattoo: false},
		],
	},
	ass: {
		assSize: [
			{name: "extremely tiny", size: 0, tattoo: false },
			{name: "very tiny", size: 1, tattoo: false},
			{name: "tiny", size: 2, tattoo: false},
			{name: "very small", size: 3, tattoo: false},
			{name: "small", size: 4, tattoo: false},
			{name: "medium", size: 5, tattoo: false},
			{name: "plump", size: 6, tattoo: false},
			{name: "very plump", size: 7, tattoo: false},
			{name: "thick", size: 8, tattoo: false},
			{name: "fat", size: 9, tattoo: false},
		],
	},
},
]

//Body Type Scale
let bodyType = [
	{name: "extremely thin", min: 0, max: 2},
{name: "thin", min: 1, max: 3},
{name: "skinny", min: 2, max: 4},
{name: "medium", min: 4, max: 6},
{name: "plump", min: 5, max: 6},
{name: "thick", min: 6, max: 7},
{name: "fat", min: 8, max: 9},
]

//Personnel Names
let firstName = {
	manNames:[
		"John", "Steve", "Gary", "Steve", "Frank"
	],
	womanNames:[
		"Sarah", "Velma", "Daphne", "Chloe", "Jenny"
	]
}

//Personnel Genders
let genders = [
	{name: "man", pronounPersonal: "he",  pronounPossesive: "him",  pronounPlural: "his", pronounPlural2: "his"},
{name: "woman", pronounPersonal: "she", pronounPossesive: "her", pronounPlural: "hers", pronounPlural2: "her"},
]

//Personnel Sexuality
let sexuality = ["straight", "gay", "bisexual", "asexual"]
//Starting Arrays
//Personnel Traits
let startingTraits = [
	{name: "Lazy", desc: "This doll has spent their time avoiding hard or complex work, despite societies pressues.", res: -1, str:-1, int: -1},
{name: "Smart", desc: "This dolls mind tends to work quicker than others.", res: 0, str:0, int: 2},
{name: "Stubborn", desc: "This doll resists the influences and pushes or others, even if that other is correct.", res: 2, str:1, int: -1},
{name: "Slow", desc: "Things tend to go over this dolls head", res: 0, str:0, int: -2},
{name: "Strong", desc: "This doll is built quite powerfully. Not someone to underestimate.", res: 0, str:3, int: 0},
{name: "Weak", desc: "This doll has a fairly weak build. An easy target.", res: 0, str:-3, int: 0},
]

let startingSkills = [
	{id: "oralSex", name: "Oral Sex", int: false},
{id: "analSex", name: "Anal Sex", int: false},
{id: "dominatRole", name: "Domination", int: false},
{id: "submissiveRole", name: "Submission", int: false},
{id: "dirtyTalk", name: "Dirty Talk", int: false},
{id: "domesticTasks", name: "Domestic Skills", int: false},
{id: "makeup", name: "Makeup Skills", int: false},
{id: "etiquette", name: "Etiquette", int: false},
{id: "combat", name: "Combat Skills", int: false},
{id: "medicine", name: "Medical Skills", int: false},
{id: "social", name: "Social Skills", int: false}
]

let startingClothing = [
	head = {
		eyeWear: [
			{id: "glasses", name: "glasses"},
			{id: "eyePatch", name: "eye patch"},
			{id: "none", name: "none"},
		],
		earJewelery: [
			{id: "silverStuds", name: "silver studs"},
			{id: "goldStuds", name: "gold studs"},
			{id: "pearlEarrings", name: "pearl earrings"},
			{id: "hoops", name: "hoops"},
			{id: "charmEarrings", name: "charm earrings"},
			{id: "none", name: "none"},
		],
	},
neck = {
	neckJewelery: [
		{id: "goldNecklace", name: "gold necklace"},
		{id: "silverNecklace", name: "silver necklace"},
		{id: "crystalNecklace", name: "crystal necklace"},
		{id: "charmNecklace", name: "charm necklace"},
		{id: "pearlNecklace", name: "pearl necklace"},
		{id: "none", name:"none"},
	],
	neckWear: [
		{id: "choker", name: "choker"},
		{id: "scarf", name: "scarf"},
		{id: "ascot", name: "ascot"},
		{id: "collar", name: "collar"},
		{id: "none", name: "none"},
	]
},
upperBody = {
	upperBody: [
		{id: "tShirt", name: "t-shirt", type: "shirt", con:["dress"]},
		{id: "tankTop", name: "tank top", type:"shirt", con: ["dress"]},
		{id: "blouse", name: "blouse", type:"shirt", con: ["dress"]},
		{id: "baseballT", name: "baseball-t", type:"shirt", con: ["dress"]},
		{id: "cropTop", name: "crop top", type:"shirt", con: ["dress"]},
		{id: "flannelShirt", name: "flannel shirt", type:"shirt", con: ["dress"]},
	],
	overshirt: [
		{id: "jacket", name: "jacket"},
		{id: "flannelShirt", name: "flannel shirt"},
	],
	rings: [
		{id: "metalBand", name: "metal band"},
		{id: "diamondRing", name: "diamond ring"},
		{id:"charmRing", name: "charm ring"},
	],
},
lowerBody = {
	lowerBodyClothing: [
		{id: "leggings", name: "leggings", type:"pants", con: ["dress","legWear"]},
		{id: "skirt", name: "skirt", type: "skirt", con: ["dress"]},
		{id: "jeans", name: "jeans", type:"pants", con: ["dress", "legWear"]},
		{id: "shortShorts", name: "short shorts", type: "shorts", con: ["dress", "legWear"]},
		{id: "basketballShorts", name: "basketball shorts"},
		{id: "longSkirt", name: "long skirt", type: "skirt", con: ["dress"]},
	],
	underwear: [
		{id: "panties", name: "panties"},
		{id: "boxers", name: "boxers"},
		{id: "thong", name: "thong"},
		{id: "speedo", name: "speedo"},
	],
	legWear: [
		{id: "tights", name: "tights", type: "legWear", con: ["pants"]},
		{id: "stockings", name: "stockings", type: "legWear", con:["pants"]},
		{id: "fishnets", name: "fishnets"},
		{id: "none", name: "bare legs", type: "noUnderClothing"}
	],
	genitalJewelery: [
		{id: "none", name: "none"},
	],
},
feet = {
	feetWear: [
		{id: "tennisShoes", name: "tennis shoes"},
		{id: "flats", name: "flats"},
		{id: "sandals", name: "sandals"},
		{id: "heels", name: "heels"},
		{id: "highHeels", name: "high heels"},
		{id: "boots", name: "boots"},
		{id: "workShoes", name: "work shoes"},
	],
},
]
//End of Starting Arrays
//Non-Starting Arrays
let skills = {
	oral:{id: "oralSex", name: "Oral Sex", int: false},
	anal:{id: "analSex", name: "Anal Sex", int: false},
	dominant:{id: "dominatRole", name: "Domination", int: false},
	submissive:{id: "submissiveRole", name: "Submission", int: false},
	dirtyTalk:{id: "dirtyTalk", name: "Dirty Talk", int: false},
	domesticTasks:{id: "domesticTasks", name: "Domestic Skills", int: false},
	makeup:{id: "makeup", name: "Makeup Skills", int: false},
	etiquette:{id: "etiquette", name: "Etiquette", int: false},
	combat:{id: "combat", name: "Combat Skills", int: false},
	medicine:{id: "medicine", name: "Medical Skills", int: false},
	social:{id: "social", name: "Social Skills", int: false}
}

let clothing = {
	eyeWear: [
		{id: "none", name: "none"},
		{id: "glasses", name: "glasses"},
		{id: "eyePatch", name: "eye patch"},
	],
	headWear: [
		{id: "none", name: "none"},
		{id: "hat", name: "hat"},
	],
	neckWear: [
		{id: "none", name: "none"},
		{id: "choker", name: "choker"},
		{id: "scarf", name: "scarf"},
		{id: "ascot", name: "ascot"},
		{id: "collar", name: "collar"},
	],
	neckJewelery: [
		{id: "none", name: "none"},
		{id: "goldNecklace", name: "gold necklace"},
		{id: "silverNecklace", name: "silver necklace"},
		{id: "crystalNecklace", name: "crystal necklace"},
		{id: "charmNecklace", name: "charm necklace"},
		{id: "pearlNecklace", name: "pearl necklace"},
	],
	earrings: [
		{id: "none", name: "none"},
		{id: "silverStuds", name: "silver studs"},
		{id: "goldStuds", name: "gold studs"},
		{id: "pearlEarrings", name: "pearl earrings"},
		{id: "hoops", name: "hoops"},
		{id: "charmEarrings", name: "charm earrings"},
	],
	rings: [
		{id: "none", name: "none"},
		{id: "metalBand", name: "metal band"},
		{id: "diamondRing", name: "diamond ring"},
		{id:"charmRing", name: "charm ring"},
	],
	upperBody: [
		{id: "none", name: "none"},
		{id: "tShirt", name: "t-shirt", type: "shirt", con:["dress"]},
		{id: "tankTop", name: "tank top", type:"shirt", con: ["dress"]},
		{id: "blouse", name: "blouse", type:"shirt", con: ["dress"]},
		{id: "baseballT", name: "baseball-t", type:"shirt", con: ["dress"]},
		{id: "cropTop", name: "crop top", type:"shirt", con: ["dress"]},
		{id: "flannelShirt", name: "flannel shirt", type:"shirt", con: ["dress"]},
	],
	overShirt: [
		{id: "none", name: "none"},
		{id: "jacket", name: "jacket"},
		{id: "flannelShirt", name: "flannel shirt"},
	],
	lowerBodyClothing: [
		{id: "leggings", name: "leggings", type:"pants", con: ["dress","legWear"]},
		{id: "skirt", name: "skirt", type: "skirt", con: ["dress"]},
		{id: "jeans", name: "jeans", type:"pants", con: ["dress", "legWear"]},
		{id: "shortShorts", name: "short shorts", type: "shorts", con: ["dress", "legWear"]},
		{id: "basketballShorts", name: "basketball shorts"},
		{id: "longSkirt", name: "long skirt", type: "skirt", con: ["dress"]},
	],
	underwear: [
		{id: "panties", name: "panties"},
		{id: "boxers", name: "boxers"},
		{id: "thong", name: "thong"},
		{id: "speedo", name: "speedo"},
	],
	genitalJewelery: [
		{id: "none", name: "none"},
		{id: "chastityCage", name: "chastity cage"},
	],
	legWear: [
		{id: "none", name: "bare legs", type: "noUnderClothing"},
		{id: "tights", name: "tights", type: "legWear", con: ["pants"]},
		{id: "stockings", name: "stockings", type: "legWear", con:["pants"]},
		{id: "fishnets", name: "fishnets"},
	],
	feetWear: [
		{id: "none", name: "bare feet"},
		{id: "tennisShoes", name: "tennis shoes"},
		{id: "flats", name: "flats"},
		{id: "sandals", name: "sandals"},
		{id: "heels", name: "heels"},
		{id: "highHeels", name: "high heels"},
		{id: "boots", name: "boots"},
		{id: "workShoes", name: "work shoes"},
	],
}

//Body Parts Arrays
let bodyPartsObj = {
	head:{
		eyes: {
			eyeColor:[
				{name: "Eye Color", desc:"Change Eye Color", surgeryTime: 30, type: "eyeColor", part: "eyes" },
				{name: "green"},
				{name: "blue"},
				{name: "brown"},
				{name: "dark brown"},
				{name: "gray"},
			],
			eyeShape:[
				{name: "Eye Shape", desc:"Change Eye Shape", surgeryTime: 50,  type: "eyeShape", part: "eyes"},
				{name: "almond"},
				{name: "hooded"},
				{name: "downturned"},
				{name: "upturned"},
				{name: "round"},
			],
		},
		nose: {
			noseShape:[
				{name: "Nose Shape", desc:"Change Nose Shape", surgeryTime: 50, type: "noseShape", part: "nose"},
				{name: "hooked"},
				{name: "straight"},
				{name: "snub"},
				{name: "bulbous"},
			],
		},

		ears: {
			earShape:[
				{name: "Ear Shape", desc:"Change Ear Shape", surgeryTime: 50, type: "earShape", part: "ears"},
				{name: "pointed"},
				{name: "narrow"},
				{name: "broad",},
			],
		},
		lips: {
			lipShape:[
				{name: "Lip Shape", desc:"Change Lip Shape", surgeryTime: 50, type: "lipShape", part: "lips"},
				{name: "full"},
				{name: "round"},
				{name: "thin",},
			],
		},

	},
	upperbody:{
		breast: {
			breastSize:[
				{name: "Breast Size", desc:"Change Breast Size", surgeryTime: 5, type: "breastSize", part: "breast"},
				{name: "flat", size: 0},
				{name: "very tiny", size: 1},
				{name: "tiny", size: 2},
				{name: "very small", size: 3},
				{name: "small", size: 4,},
				{name: "medium", size: 5},
				{name: "plump", size: 6},
				{name: "very plump", size: 7},
				{name: "fat", size: 8,},
				{name: "very fat", size: 9},
			],
		},
		shoulder: {
			shoulderWidth: [
				{name: "Shoulder Width", desc:"Change Shoulder Width", surgeryTime: 150, type: "shoulderWidth", part: "shoulder"},
				{name: "extremely tiny", size: 0},
				{name: "very tiny", size: 1},
				{name: "tiny", size: 2},
				{name: "very small", size: 3},
				{name: "small", size: 4},
				{name: "medium", size: 5},
				{name: "wide", size: 6},
				{name: "very wide", size: 7},
				{name: "broad", size: 8},
				{name: "very broad", size: 9,},
			],
		},
		waist: {
			waistSize: [
				{name: "Waist Size", desc:"Change Waist Size", surgeryTime: 150, type: "waistSize", part: "waist"},
				{name: "extremely tiny", size: 0},
				{name: "very tiny", size: 1},
				{name: "tiny", size: 2},
				{name: "very small", size: 3},
				{name: "small", size: 4},
				{name: "medium", size: 5},
				{name: "plump", size: 6},
				{name: "very plump", size: 7},
				{name: "thick", size: 8},
				{name: "fat", size: 9},
			],
		},

	},
	lowerbody:{
		hips: {
			hipSize:[
				{name: "Hip Size", desc:"Change Hip Size", surgeryTime: 150, type: "hipSize", part: "hip"},
				{name: "extremely tiny", size: 0},
				{name: "very tiny", size: 1},
				{name: "tiny", size: 2},
				{name: "very small", size: 3},
				{name: "small", size: 4,},
				{name: "medium", size: 5},
				{name: "wide", size: 6,},
				{name: "very wide", size: 7,},
				{name: "thick", size: 8,},
				{name: "hourglass", size: 9,},
			],
		},
		thigh: {
			thighSize: [
				{name: "Thigh Size", desc:"Change Thigh Size", surgeryTime: 120, type: "thighSize", part: "thigh"},
				{name: "extremely thin", size: 0,},
				{name: "very thin", size: 1,},
				{name: "thin", size: 2,},
				{name: "very small", size: 3,},
				{name: "small", size: 4,},
				{name: "medium", size: 5,},
				{name: "plump", size: 6,},
				{name: "very plump", size: 7},
				{name: "thick", size: 8,},
				{name: "fat", size: 9,},
			],
		},
		ass: {
			assSize: [
				{name: "Ass Size", desc:"Change Ass Size", surgeryTime: 120, type: "assSize", part: "ass"},
				{name: "extremely tiny", size: 0},
				{name: "very tiny", size: 1,},
				{name: "tiny", size: 2,},
				{name: "very small", size: 3,},
				{name: "small", size: 4,},
				{name: "medium", size: 5,},
				{name: "plump", size: 6,},
				{name: "very plump", size: 7,},
				{name: "thick", size: 8,},
				{name: "fat", size: 9,},
				{name: "fast af", size: 9,},
			],
		},
	},
}
//End of Non-Starting Arrays
//Text Parser Library Array
let library = {
	assSize: ["appearance", "ass", "assSize", "name"],
	bodyType:["appearance","bodyType", "name"],
	breastSize:["appearance", "breast", "breastSize", "name"],
	earShape: ["appearance", "ears", "earShape", "name"],
	eyeColor:["appearance", "eyes", "eyeColor", "name"],
	eyeShape:["appearance", "eyes", "eyeShape", "name"],
	eyeWear: ["appearance", "eyeWear", "name"],
	eyeWearID: ["appearance", "eyeWear", "id"],
	gender: ["appearance","gender", "name"],
	genitalJewelery: ["appearance", "genitalJewelery", "name"],
	genitalJeweleryID: ["appearance", "genitalJewelery", "id"],
	hairColor: ["appearance", "hair", "hairColor", "name"],
	hairLength: ["appearance", "hair", "hairLength", "name"],
	height:["appearance", "height", "name"],
	hipSize: ["appearance", "hip", "hipSize", "name"],
	legWear: ["appearance", "legWear", "name"],
	legWearID: ["appearance", "legWear", "id"],
	lipShape: ["appearance", "lips", "lipShape", "name"],
	lowerBodyClothing: ["appearance", "lowerBodyClothing", "name"],
	lowerBodyClothingID: ["appearance", "lowerBodyClothing", "id"],
	name: ["name"],
	neckJewelery:["appearance", "neckJewelery", "name"],
	neckJeweleryID:["appearance", "neckJewelery", "id"],
	neckWear:["appearance", "neckWear", "name"],
	neckWearID:["appearance", "neckWear", "id"],
	noseShape:["appearance", "nose", "noseShape", "name"],
	pronounPersonal:["appearance","gender", "pronounPersonal"],
	pronounPossesive:["appearance","gender", "pronounPossesive"],
	pronounPlural:["appearance","gender", "pronounPlural"],
	pronounPlural2:["appearance","gender", "pronounPlural2"],
	shirt:["appearance", "upperBody", "name"],
	shirtID:["appearance", "upperBody", "id"],
	shoes: ["appearance", "feetWear", "name"],
	shoesID: ["appearance", "feetWear", "id"],
	shoulderWidth:["appearance", "shoulder", "shoulderWidth", "name"],
	thighSize: ["appearance", "thigh", "thighSize", "name"],
	underwear:["appearance", "underwear", "name"],
	underwearID:["appearance", "underwear", "id"],
	waistSize:["appearance", "waist", "waistSize", "name"],
}

let text = {
	personnelInformationSceneDesc:{desc: "$name is a $height /$bodyType=medium^medium_sized /$bodyType=!medium^$bodyType $gender with $hairLength $hairColor hair, a $noseShape nose, $lipShape lips, $earShape ears and $eyeColor eyes /$eyeWear=none^*.  /$eyeWearID=glasses^with_a_pair_of_glasses*. /$eyeWearID=eyePatch^with_an_eye_patch*.  /$neckJeweleryID=!none-$neckWearID=!none^+$pronounPersonal_has_a_$neckJewelery_and_a_$neckWear_on_$pronounPlural2_neck_and /$neckJeweleryID=!none-$neckWearID=none^+$pronounPersonal_has_a_$neckJewelery_on_$pronounPlural2_neck_and /$neckWearID=!none-$neckJeweleryID=none^+$pronounPersonal_has_a_$neckWear_on_$pronounPlural2_neck_and /$neckWearID=none-$neckJeweleryID=none^+$pronounPlural2_neck_is_bare_and_$pronounPersonal is wearing a $shirt covering $pronounPlural2 $shoulderWidth shoulders, $breastSize /$gender=man^pecs, /$gender=woman^breasts, and $waistSize waist. +$pronounPlural2 hips are $hipSize with $thighSize thighs and a $assSize ass. +$pronounPersonal is wearing /$lowerBodyClothingID=skirt^a_skirt /$lowerBodyClothingID=!skirt^$lowerBodyClothing /$legWearID=!barelegs^with_$legWear_and /$legWearID=barelegs^with /$underwearID=!thong-$underwearID=!speedo^$underwear /$underwearID=!panties-$underwearID=!boxers^a_$underwear underneath /$genitalJeweleryID=chastityCage-$gender=man^with_a_chastity_cage_tight_around_$pronounPlural2_cock /$genitalJeweleryID=chastityCage-$gender=woman^with_a_chastity_cage_tight_around_$pronounPlural2_pussy and a pair of $shoes ."  }
}
