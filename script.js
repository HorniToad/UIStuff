
let div = document.getElementsByClassName("hideBoxOuter");
for(let i = 0; i < div.length; i++) {
    let divHideBox = div[i].querySelector(".hideBoxInner");
    let divBtn = div[i].querySelector(".hideBtn");

    divBtn.addEventListener("click", function() {
        $("#" + div[i].id).children(".hideBoxInner").slideToggle();
    })
}


let gameState = []

$(function gameStateHandler () {
    let buildingTemplate = {floorSlots: [], buildingSlots: [], buildFocus: false, buildTypeFocus: false, buildItemFocus: false}

    gameState = {tickState: false, tickRate: false, completeTick: 10, currentTick: 0, date: false, currentDay: 1, cash: 500, patientCap: false, custFocus: false, employeeFocus: false, conditionFocus: false, charGen: false, buildings: buildingTemplate, buildingSceneFocus: false}


    gameStartUpHandler();

})

// Start Up Function
function gameStartUpHandler() {
    buildingSetup();

}

// Building Functions

// Handles variables and building functions
function buildingSetup() {
    let slots = 12;
    let floors = 3;

    let closeBtn = document.getElementById("buildBoxCloseBtn")
    let buildBox = document.getElementById("buildBox")

    hideTarget(closeBtn, buildBox)
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

        if(buildingSlots[i].active === false) {
            $("#" + buildingSlots[i].id).on("click", function() {
                gameState.buildFocus = buildingSlots[i]
                console.log(gameState.buildFocus)
                $("#buildBox").slideDown();
                $("#buildBox").css({"display": "grid"})
            })
        }
    }
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



//Arrays

//BuildingArrays
let buildingTypes = [
    { id: "conditioningSlot", name: "Conditioning", cost: 10, build: 5, unlocked: true, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
    { id: "kinkTrainer", name: "Kink Trainer", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
    { id: "patientCapacity", name: "Patient Capacity", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
    { id: "bodyChanger", name: "Body Changer", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
    { id: "trainingSlot", name: "Training", cost: 10, build: 5, unlocked: false, stats: "resistance/-1", desc: "A basic hypnosis screen that helps to relax those who stare into it" },
]

let buildings = [
    { id: "cookingTraining", name: "Basic Kitchen", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "cleaningTraining", name: "Mock Room", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "makeupTraining", name: "Makeup Room", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "speechTraining", name: "Speech Training", type: "training", cost: 350, build: 5, unlocked: true, base: true, stats: "resistance/-5", capacity: 0, trainable: true, desc: "A basic hypnosis screen that helps to relax those who stare into it" },

    { id: "resistanceRemoval1", name: "Relaxation Center", type: "conditioning", cost: 350, build: 5, unlocked: true, base: true, stat: "resistance", statInt: -1, capacity: 0, trainable: true, desc: "A small room used for helping less enthusiastic wifes relax and accept their new role. With the aid of speakers sending a constant stream of subliminal messages to whoever occupies it." },

    { id: "hypnoUpg2", name: "Hypno Headphones", type: "conditioning", cost: 1000, build: 10, unlocked: false, base: false, stats: "resistance/-10", capacity: 0, trainable: true, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

    { id: "hypnoUpg3", name: "Hypno Headpiece", type: "conditioning", cost: 2000, build: 10, unlocked: false, base: false, stats: "resistance/-20", capacity: 0, trainable: true, desc: "A set of headphones that is strapped to the patients b head to ensure constant subliminal messages."},

    { id: "puppyUpg1", name: "Puppy Pound", type: "training", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, desc: "A small room dedicated to training patients into good little puppies.", kinks: "petPlay"},

    { id: "farmUpg1", name: "Farm", type: "training", cost: 500, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: true, effect: 1, desc: "A small room dedicated to training patients into good little puppies.", kinks: "farmPlay"},

    { id: "cellUpg1", name: "Cell", type: "capacity", cost: 250, build: 5, unlocked: true, base: true, stats: "none", capacity: 1,trainable: false, desc: "A small cell used to hold patients during their stay at the Spa." },

    { id: "basicSurgery", name: "Basic Surgery Station", type: "modification", cost: 750, build: 5, unlocked: false, base: true, stats: "none", capacity: 0,trainable: false, desc: "A basic surgery station used to enhance dolls." }
]

