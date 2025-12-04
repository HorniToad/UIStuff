
let div = document.getElementsByClassName("hideBoxOuter");
for(let i = 0; i < div.length; i++) {
    let divHideBox = div[i].querySelector(".hideBoxInner");
    let divBtn = div[i].querySelector(".hideBtn");

    divBtn.addEventListener("click", function() {
        $("#" + div[i].id).children(".hideBoxInner").slideToggle();
    })
}

let gameState;

$(function gameStateHandler () {
    // Test Dummy Char
    let testDummy = {name: "Mat", id: "mat01", status: "Idle"}

    let scene = document.getElementById("baseBox")
    let parent = $(scene).parent([".sceneContainerHidden"])
    parent[0].style.display = "grid"
    let buildingTemplate = {floorSlots: [], buildingSlots: [], slots: 20, floors: 5, buildFocus: false, buildTypeFocus: false, buildItemFocus: false, buildingSceneFocus: false}
    let personnelTemplate = {patients: [testDummy, testDummy, testDummy, testDummy, testDummy, testDummy, testDummy, testDummy], employees: [], customers: []};

    gameState = {tickState: false, tickRate: false, completeTick: 10, currentTick: 0, date: false, currentDay: 1, cash: 500, patientCap: false, conditionFocus: false, charGen: false, personnel: personnelTemplate, buildings: buildingTemplate, currentScene: {current: scene, prior: false, parent: parent[0] } }
    console.log(gameState)
    gameStartUpHandler();

})

// Start Up Function
function gameStartUpHandler() {
    buildingSetup();
    personnelSetup();

}

// Start of Building Functions

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
        let buildingBase = { active: false, floor: false, id: false, name: false, desc: false, occupant: false, type: false, capacity: false, progress: false, stat: false }
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
                console.log(gameState.buildFocus)
                buildBoxTypeSetup()
                buildBoxScrollSetup()
                buildBtnSetup()
                let scene = document.getElementById("buildBox")
                sceneChange(scene, "grid")
            })
        }
        else if(buildingSlots[i].active === true) {
            $("#" + buildingSlots[i].id).on("click", function buildingSlotClickSetup() {
                buildingFilter(buildingSlots[i])
            })
        }
    }
}
// Setups the building type select box and adds event listeners so you can switch between different building types.
function buildBoxTypeSetup() {

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

                buildBoxScrollSetup();
            })

        }
    }

// Sets up the buildBox scroll menu and the btns that fill it. It also adds an event listener to each button so when clicked the gameState object changes buildItemFocus
function buildBoxScrollSetup() {
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

// Adds an eventListener to the buildBoxBuildBtn so when clicked it fills the current slot with the selected building stats.
function buildBtnSetup() {
    let buildBtn = document.getElementById("buildBoxBuildBtn")
    $("#" + buildBtn.id).off()
    $("#" + buildBtn.id).on("click", function() {
            let selectedSlot = gameState.buildings.buildFocus
            let selectedBuild = gameState.buildings.buildItemFocus;

            selectedSlot.active = true;
            selectedSlot.capacity = selectedBuild.capacity
            selectedSlot.desc = selectedBuild.desc
            selectedSlot.name = selectedBuild.name;
            selectedSlot.type = selectedBuild.type;
            selectedSlot.stat = selectedBuild.statInt;
            selectedSlot.statName = selectedBuild.stat;
            selectedSlot.trainable = selectedBuild.trainable;

            let slot = document.getElementById(selectedSlot.id)

            let textBox = slot.querySelector(".gridBoxCenter")

            textBox.innerHTML = selectedBuild.name
            baseBoxButtonSetup();
            sceneChange()
    })
}

function buildSelection() {
        let btn = document.getElementById("buildBtn" + gameState.buildings.buildItemFocus.id)
        console.log(gameState.buildings.buildItemFocus.id)
        btn.style.background = "red"
        let desc = document.getElementById("buildBoxDescDiv");
        desc.innerText = gameState.buildings.buildItemFocus.desc
        $("#" + btn.id).off();
}

// Filters between different building options to display the correct sceneHome
function buildingFilter(x) {
    let target = x;
    if(target != undefined) {
        let buildContainer = document.getElementById("buildingSceneBox")
        sceneChange(buildContainer)
        gameState.buildingSceneFocus = target
        console.log(target)
        let scene = document.getElementById("building" + target.type + "Scene")
        scene.style.display = "grid"
        $("#building" + target.type + "SceneDesc").text(target.desc)
    }
    else {
        console.log("Something has gone wrong with the building filter. Target is undefined!")
    }
}

// End of Building Functions

// Start of Personnel Functions
function personnelSetup() {
    let personnelSidePanel = document.getElementById("dollStatContainer");
    let personnelContainer = personnelSidePanel.querySelector(".gridBoxCenter95")

    clearBox(personnelContainer)

    let patients = gameState.personnel.patients;

    for(let i = 0; i < patients.length; i++) {

        let newSlot = slotBuilder(patients[i], personnelContainer)
        console.log(newSlot)

        let textName = newSlot.querySelector(".textBoxLeft");
        let textStatus = newSlot.querySelector(".textBoxRight");

        textName.innerText = patients[i].name;
        textStatus.innerText = patients[i].status;

        newSlot.addEventListener("click", function() {
            let scene = document.getElementById("testPersonScene")
            sceneChange(scene, "grid")
        })
    }

}


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


// End of Personnel Functions


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

function sceneChange(x, y) {
    let newScene = x;
    console.log(newScene)
    if(newScene) {
        gameState.currentScene.prior = gameState.currentScene.current
        gameState.currentScene.current = newScene
    }

    else if(!newScene) {
        console.log("I made my way down here")
        let holder = gameState.currentScene.current

        gameState.currentScene.current = gameState.currentScene.prior
        gameState.currentScene.prior = holder;

        newScene = gameState.currentScene.current
    }
    console.log(newScene.id.toString())
    let parent = $(newScene).parent([".sceneContainerHidden"])
        console.log(parent[0])
        if(parent[0] != gameState.currentScene.parent) {
            console.log("Switched parents on me didn't ya")
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
    { id: "cookingTraining", name: "Basic Kitchen", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "cleaningTraining", name: "Mock Room", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "makeupTraining", name: "Makeup Room", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "speechTraining", name: "Speech Training", type: "Training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "resistanceRemoval1", name: "Relaxation Center", type: "Conditioning", cost: 350, build: 5, unlocked: true, base: true, stat: "resistance", statInt: -1, capacity: 0, trainable: true, desc: "A small room used for helping less enthusiastic wifes relax and accept their new role. With the aid of speakers sending a constant stream of subliminal messages to whoever occupies it." },

    { id: "hypnoUpg2", name: "Hypno Headphones", type: "Conditioning", cost: 1000, build: 10, unlocked: false, base: false, stats: "resistance/-10", capacity: 0, trainable: true, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

    { id: "hypnoUpg3", name: "Hypno Headpiece", type: "Conditioning", cost: 2000, build: 10, unlocked: false, base: false, stats: "resistance/-20", capacity: 0, trainable: true, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

    { id: "puppyUpg1", name: "Puppy Pound", type: "Kink", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, desc: "A small room dedicated to training patients into good little puppies.", kinks: "petPlay"},

    { id: "farmUpg1", name: "Farm", type: "Kink", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, desc: "A small room dedicated to training patients into good little puppies.", kinks: "farmPlay"},

    { id: "cellUpg1", name: "Cell", type: "Capacity", cost: 250, build: 5, unlocked: true, base: true, stats: "none", capacity: 1,trainable: false, desc: "A small cell used to hold patients during their stay at the Spa." },

    { id: "basicSurgery", name: "Basic Surgery Station", type: "Modification", cost: 750, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: false, desc: "A basic surgery station used to enhance dolls." }
]

