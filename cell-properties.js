//Storage
let sheetDBCollection = [];     //Contains sheetDBs

let sheetDB = [];

addSheetBtn.click();            //declared in "sheetsHandling.js". Clicked to add default single sheet.

// for(let i=0; i<rows; i++){
//     let sheetRow = [];
//     for(let j=0; j<cols; j++){
//         let cellProp = {
//             fontFamily: "Arial",
//             fontSize: "14",
//             bold: false,
//             italic: false,
//             uderlined: false,
//             alignment: "left",
//             fontColor: "#000000",
//             BGcolor: "#000000", 
//             value: "",
//             formula: "",
//             children: []
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

//Selectors
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underlined = document.querySelector(".underlined");
let alignment = document.querySelectorAll(".alignment");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".bg-color-prop");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

// let addressBar = document.querySelector(".address-bar");

let activeColorProp = "#d1d8e0"
let inactiveColorProp = "#ecf0f1";

//Application of two way binding
//Attach property listener

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.fontFamily = fontFamily.value;    // data change (backend)    left fontFamily is from storage and right fontFamily is from querySelector
    cell.style.fontFamily = cellProp.fontFamily;    // UI change (frontend) part-1,
    fontFamily.value = cellProp.fontFamily;     //Part 2
    //part 1 is actual change and part 2 is change in representation of UI
})
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.fontSize = fontSize.value;    // data change (backend)    left fontSize is from storage and right fontSize is from querySelector
    cell.style.fontSize = cellProp.fontSize + "px";    // UI change (frontend) part-1, + "px" is most important in this part. 
    fontSize.value = cellProp.fontSize;     //Part 2

})

bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.bold = ! cellProp.bold;    // data change (backend)
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";    // UI change (frontend) part-1
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; // part-2 

})
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.italic = !cellProp.italic;    // data change (backend)
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";    // UI change (frontend) part-1
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; // part-2 

})
underlined.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.underlined = ! cellProp.underlined;    // data change (backend)
    cell.style.textDecoration = cellProp.underlined ? "underline" : "none";    // UI change (frontend) part-1
    underlined.style.backgroundColor = cellProp.underlined ? activeColorProp : inactiveColorProp; // part-2 

})

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) =>{
        let address = addressBar.value;
        let [cell, cellProp] = getActiveCell(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;            //Data change
        cell.style.textAlign = cellProp.alignment;  //UI change part 1

        switch(alignValue){         //UI change part 2
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    })
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.fontColor = fontColor.value;    // data change (backend)    left fontColor is from storage and right fontColor is from querySelector
    cell.style.color = cellProp.fontColor;    // UI change (frontend) part-1, + "px" is most important in this part. 
    fontColor.value = cellProp.fontColor;     //Part 2

})
BGcolor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    //Modification
    cellProp.BGcolor = BGcolor.value;    // data change (backend)    left BGcolor is from storage and right BGcolor is from querySelector
    cell.style.backgroundColor = cellProp.BGcolor;    // UI change (frontend) part-1, + "px" is most important in this part. 
    BGcolor.value = cellProp.BGcolor;     //Part 2

})

//Add properties to each cell as per sheets db
let allCells = document.querySelectorAll(".cell");
for(let i = 0; i < allCells.length; i++){
    addListenerToAttachCellProperties(allCells[i]);
}


//Extra needed functions

function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeFromAddress(address);
        let cellProp = sheetDB[rid][cid];


        //Apply actual cell properties (part1)
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underlined ? "underline" : "none";
        cell.style.textAlign = cellProp.alignment;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = (cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor);

        //Apply properties to UI Conatainer
        fontFamily.value = cellProp.fontFamily;
        fontSize.value = cellProp.fontSize;
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underlined.style.backgroundColor = cellProp.underlined ? activeColorProp : inactiveColorProp;
        switch(cellProp.alignment){        
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}

//fucntion to get active cell
function getActiveCell(address){
    let [rid, cid] = decodeFromAddress(address);    // destructing of array
    //Access cell and storage object
    let cell = document.querySelector(`.cell[rid = "${rid}"][cid = "${cid}"]`);    //For Frontend
    let cellProp = sheetDB[rid][cid];       //For Backend

    return [cell, cellProp];
}

//function to get row id and col id from address
function decodeFromAddress(address){
    //address -> "A1"
    let rid = Number(address.slice(1)) - 1; // slices from index 1 to end
    // let rid = Number(address[1]) - 1; 
    let cid = Number(address.charCodeAt(0)) - 65;
    // let cid = Number(address[0]) - 65;    //Not possible

    return [rid, cid];
}