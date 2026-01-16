let gameState;

//gameStateHandler-- Start of the Game State Handler
function gameStateHandler() {

}

// Tick Counter Function
function tickStateCounter() {
    if(gameState.tickState.currentTick < gameState.tickState.completeTick) {
        gameState.tickState.currentTick++;
    }
    else if(gameState.tickState.currentTick == 10){
        gameState.tickState.currentTick = -1;
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
        gameState.tickState.tick = setInterval(tickStateCounter, speed)
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
    let tickTemplate =  {tick: false, tickRate: false, completeTick: 10, currentTick: 0}

    gameState = {tickState: tickTemplate, date: false,currentDate: false, cash: 500, patientCap: false, conditionFocus: false, charGen: false, personnel: personnelTemplate, buildings: buildingTemplate, currentScene: {current: scene, prior: false, parent: parent[0] } }
    console.log(gameState)
    personnelGenerator();
    personnelGenerator();
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
        //Personnel Scene Btn Setup and Event Listener
        let personnelScene = document.getElementById("scenePersonnelInformation")
        $("#leftStatBoxSceneBtnPersonnel").on("click", function() {
            sceneChange(personnelScene)
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
    if(target != undefined) {
        if(gameState.buildingSceneFocus && gameState.buildingSceneFocus != target) {
            let oldTarget = document.getElementById("building" + gameState.buildingSceneFocus.type + "Scene")
            oldTarget.style.display = "none";
        }
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
    let generatedCharacter =  {name: false, id: false, desc: false, changeFlag: false, status: false, sexuality: false, appearance: {gender: {name: false, pronounPersonal: false, pronounPossesive: false}, bodyType: false, hairColor: false, hairLength: false, bodySize: false, height: false, hipSize: false, waistSize: false, clothingCheck:{shirt: false, pants: false, underClothing: false, dress: false}}, traits: [], stats:{res: false, str: false, int: false}}
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
                value = bodyParts[i][key];
                let rand = Math.floor(Math.random() * (selectedBodyType.max - selectedBodyType.min + 1)+ selectedBodyType.min)
                console.log(rand)
                let choice = value[rand]
                generatedCharacter.appearance[key] = choice
            }
        }
    }
    for(let i = 0; i < bodyPartsAlt.length; i++) {
        console.log(bodyPartsAlt[i])
        for(let key in bodyPartsAlt[i]) {
            if (bodyPartsAlt[i].hasOwnProperty(key)) {
                value = bodyPartsAlt[i][key];
                console.log("Value for BodyPartsAlt: " + value)
                let rand = Math.floor(Math.random() * bodyPartsAlt.length)
                console.log(rand)
                let choice = value[rand]
                generatedCharacter.appearance[key] = choice
            }
        }
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
        $("#personnelInformationWardrobeBtnLowerBody").on("click", function() {
            personnelWardrobe("lowerBodyClothing");
        })
        $("#personnelInformationWardrobeBtnGenitals").on("click", function() {
            personnelWardrobe("genitals");
        })
        $("#personnelInformationWardrobeBtnLegs").on("click", function() {
            personnelWardrobe("legWear");
        })
        $("#personnelInformationWardrobeBtnFeet").on("click", function() {
            personnelWardrobe("feet");
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

// Determines the current progress of a process and returns it
function progressCheck(x, y) {
    let currentProgress = x;
    let totalProgress = y;

    let currentPercentage = currentProgress / totalProgress
    currentPercentage = currentPercentage * 100;
    return currentPercentage
}

// Hides prior scene and displays the new one. The y element is used if you want a specifc display type.
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

// Character Arrays
// Body Parts
let bodyPartsAlt = [
    height= {
        height:[
        {name: "very short"},
        {name: "short"},
        {name: "medium"},
        {name: "tall"},
        {name: "very tall"},
        ]
    },

    head={
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

         eyeColor:[
            {name: "green"},
            {name: "blue"},
            {name: "brown"},
            {name: "dark brown"},
            {name: "gray"},
        ],
    }
]

let bodyParts =[
    upperBody={
        breastSize:[
            {name: "flat", size: 0 },
            {name: "very tiny", size: 1},
            {name: "tiny", size: 2},
            {name: "very small", size: 3},
            {name: "small", size: 4},
            {name: "medium", size: 5},
            {name: "plump", size: 6},
            {name: "very plump", size: 7},
            {name: "fat", size: 8},
            {name: "very fat", size: 9},
        ],
        shoulderWidth: [
            {name: "extremely tiny", size: 0 },
            {name: "very tiny", size: 1},
            {name: "tiny", size: 2},
            {name: "very small", size: 3},
            {name: "small", size: 4},
            {name: "medium", size: 5},
            {name: "wide", size: 6},
            {name: "very wide", size: 7},
            {name: "broad", size: 8},
            {name: "very broad", size: 9},
        ],
        waistSize: [
            {name: "extremely tiny", size: 0 },
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
    lowerBody={
        hipSize:[
            {name: "extremely tiny", size: 0 },
            {name: "very tiny", size: 1},
            {name: "tiny", size: 2},
            {name: "very small", size: 3},
            {name: "small", size: 4},
            {name: "medium", size: 5},
            {name: "wide", size: 6},
            {name: "very wide", size: 7},
            {name: "thick", size: 8},
            {name: "hourglass", size: 9},
        ],
        thighSize: [
            {name: "extremely thin", size: 0 },
            {name: "very thin", size: 1},
            {name: "thin", size: 2},
            {name: "very small", size: 3},
            {name: "small", size: 4},
            {name: "medium", size: 5},
            {name: "plump", size: 6},
            {name: "very plump", size: 7},
            {name: "thick", size: 8},
            {name: "fat", size: 9},
        ],
        assSize: [
            {name: "extremely tiny", size: 0 },
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

let startingClothing = [
    head = {
        eyeWear: [
            {name: "glasses"},
            {name: "eyePatch"},
            {name: "none"},
        ],
        earJewelery: [
            {name: "studs"},
            {name: "hoops"},
            {name: "pearl earrings"},
            {name: "none"},
        ],
    },
    neck = {
        neckJewelery: [
            {name: "choker"},
            {name: "silver necklace"},
            {name: "gold necklace"},
            {name: "statement necklace"},
            {name:"none"},
        ],
        neckWear: [
            {name: "scarf"},
            {name: "ascot"},
            {name: "tie"},
            {name: "none"}
        ]
    },
    upperBody = {
        upperBody: [
            {name: "tank-top", type:"shirt", con: ["dress"]},
            {name: "t-shirt", type:"shirt", con: ["dress"]},
            {name: "blouse", type:"shirt", con: ["dress"]},
            {name: "flannel shirt", type:"shirt", con: ["dress"]},
        ],
        overshirt: [
            {name: "coat"},
            {name: "leather jacket"},
            {name: "sweater"},
        ]
    },
    lowerBody = {
        lowerBodyClothing: [
            {name: "skirt", type: "skirt", con: ["dress"]},
            {name: "shorts", type: "skirt", con: ["dress", "legWear"]},
            {name: "jeans", type:"pants", con: ["dress", "legWear"]},
            {name: "leggings", type:"pants", con: ["dress","legWear"]},
        ],
        underwear: [
            {name: "panties"},
            {name: "boxers"},
            {name: "thong"},
            {name: "speedo"},
        ],
        legWear: [
            {name: "tights", type: "legWear", con: ["pants"]},
            {name: "stockings", type: "legWear", con:["pants"]},
            {name: "barelegs", type: "noUnderClothing"},
        ],
    },
    feet = {
        shoes: [
            {name: "boots"},
            {name: "tennis shoes"},
            {name: "sneakers"},
            {name: "sandals"},
            {name: "heels"},
            {name: "flats"},
        ],
    },
]
//End of Starting Arrays
//Non-Starting Arrays
let clothing = {
    eyeWear: [
        {name: "glasses"},
        {name: "eye patch"},
        {name: "none"},
    ],
    headWear: [
        {name: "hat"},
    ],
    neckWear: [
        {name: "choker"},
        {name: "scarf"},
        {name: "ascot"},
        {name: "collar"},
    ],
    neckJewelery: [
        {name: "gold necklace"},
        {name: "silver necklace"},
        {name: "crystal necklace"},
        {name: "charm necklace"},
        {name: "pearl necklace"},
    ],
    earrings: [
        {name: "silver studs"},
        {name: "gold studs"},
        {name: "pearl earrings"},
        {name: "hoops"},
        {name: "charm earrings"},
    ],
    rings: [
        {name: "metal band"},
        {name: "diamond ring"},
        {name: "charm ring"},
    ],
    upperBody: [
        {name: "t-shirt"},
        {name: "tank top"},
        {name: "blouse"},
        {name: "baseball-t"},
        {name: "crop top"},
        {name: "flannel shirt"},
    ],
    overShirt: [
        {name: "jacket"},
        {name: "flannel shirt"},
    ],
    lowerBodyClothing: [
        {name: "skirt"},
        {name: "jeans"},
        {name: "short shorts"},
        {name: "baseball shorts"},
        {name: "long skirt"},
    ],
    genitals: [
        {name: "chastity cage"},
    ],
    legWear: [
        {name: "stockings"},
        {name: "fishnets"},
        {name: "bare legs"}
    ],
    feet: [
        {name: "tennis shoes"},
        {name: "flats"},
        {name: "sandals"},
        {name: "heels"},
        {name: "high heels"},
        {name: "boots"},
        {name: "work shoes"},
    ],
}
//End of Non-Starting Arrays
//Text Parser Library Array
let library = {
    assSize: ["appearance", "assSize", "name"],
    bodyType:["appearance","bodyType", "name"],
    breastSize:["appearance", "breastSize", "name"],
    eyeColor:["appearance", "eyeColor", "name"],
    eyeWear: ["appearance", "eyeWear", "name"],
    gender: ["appearance","gender", "name"],
    hairColor: ["appearance", "hairColor", "name"],
    hairLength: ["appearance", "hairLength", "name"],
    height:["appearance", "height", "name"],
    hipSize: ["appearance", "hipSize", "name"],
    legWear: ["appearance", "legWear", "name"],
    lowerBodyClothing: ["appearance", "lowerBodyClothing", "name"],
    name: ["name"],
    neckJewelery:["appearance", "neckJewelery", "name"],
    neckWear:["appearance", "neckWear", "name"],
    pronounPersonal:["appearance","gender", "pronounPersonal"],
    pronounPossesive:["appearance","gender", "pronounPossesive"],
    pronounPlural:["appearance","gender", "pronounPlural"],
    pronounPlural2:["appearance","gender", "pronounPlural2"],
    shirt:["appearance", "upperBody", "name"],
    shoes: ["appearance", "shoes", "name"],
    shoulderWidth:["appearance", "shoulderWidth", "name"],
    thighSize: ["appearance", "thighSize", "name"],
    underwear:["appearance", "underwear", "name"],
    waistSize:["appearance", "waistSize", "name"],
}

let text = {
    personnelInformationSceneDesc:{desc: "$name is a $height /$bodyType=medium^medium_sized /$bodyType=!medium^$bodyType $gender with $hairLength $hairColor hair and $eyeColor eyes /$eyeWear=none^*.  /$eyeWear=glasses^with_a_pair_of_glasses*. /$eyeWear=eyePatch^with_an_eye_patch*.  /$neckJewelery=!none-$neckWear=!none^+$pronounPersonal_has_a_$neckJewelery_and_a_$neckWear_on_$pronounPlural2_neck_and /$neckJewelery=!none-$neckWear=none^+$pronounPersonal_has_a_$neckJewelery_on_$pronounPlural2_neck_and /$neckWear=!none-$neckJewelery=none^+$pronounPersonal_has_a_$neckWear_on_$pronounPlural2_neck_and /$neckWear=none-$neckJewelery=none^+$pronounPlural2_neck_is_bare_and_$pronounPersonal is wearing a $shirt covering $pronounPlural2 $shoulderWidth shoulders, $breastSize /$gender=man^pecs, /$gender=woman^breasts, and $waistSize waist. +$pronounPlural2 hips are $hipSize with $thighSize thighs and a $assSize ass. +$pronounPersonal is wearing /$lowerBodyClothing=skirt^a_skirt /$lowerBodyClothing=!skirt^$lowerBodyClothing /$legWear=!barelegs^with_$legWear_and /$legWear=barelegs^with /$underwear=!thong-$underwear=!speedo^$underwear /$underwear=!panties-$underwear=!boxers^a_$underwear underneath and a pair of $shoes ."  }
}
