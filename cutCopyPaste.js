let ctrlKey;

//By keydown, ctrlKey will get true value if it is pressed
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;        //returns bool
});

//By keyup, ctrlKey will get false value 
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;        //returns bool
});

for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
        let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell){
    cell.addEventListener("click", (e) => {
        //select cells range work
        if(!ctrlKey)        return;
        if(rangeStorage.length >= 2){
            //UI
            defaultSelectedCellsUI();

            //DB
            rangeStorage = [];
        }       

        //UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        // console.log(rangeStorage);
    })
}

function defaultSelectedCellsUI(){
    for(let i=0; i<rangeStorage.length; i++){
        let cell = document.querySelector(`.cell[rid = "${rangeStorage[i][0]}"][cid = "${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

//Copy functionality

let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if(rangeStorage.length < 2)         return;         //Invalid copy range

    copyData = [];          //Empty array to copy new data

    let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for(let i = startRow; i <= endRow; i++){
        let copyRow = [];
        for(let j = startCol; j <= endCol; j++){
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    defaultSelectedCellsUI();
});

pasteBtn.addEventListener("click", (e) => {

    if(rangeStorage.length < 2)         return;         //Invalid copy range

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    let address = addressBar.value;
    let [targetStartRow, targetStartCol] = decodeFromAddress(address); 

    //r -> refers copyData row
    //c -> refers copyData column
    for(let i = targetStartRow, r=0; i <= targetStartRow + rowDiff; i++, r++){
        for(let j = targetStartCol, c=0; j <= targetStartCol + colDiff; j++, c++){
            let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
            if(!cell)       continue;         //Out of bound condition where cell is null

            //DB
            let cellProp = sheetDB[i][j];
            let dataObj = copyData[r][c];

            cellProp.fontFamily = dataObj.fontFamily;
            cellProp.fontSize = dataObj.fontSize;
            cellProp.bold = dataObj.bold;
            cellProp.italic = dataObj.italic;
            cellProp.underlined = dataObj.underlined;
            cellProp.alignment = dataObj.value;
            cellProp.fontColor = dataObj.fontColor;
            cellProp.BGcolor = dataObj.BGcolor;
            cellProp.value = dataObj.value;

            //UI
            cell.click();
        }
    }
})

cutBtn.addEventListener("click", (e) => {
    if(rangeStorage.length < 2)         return;         //Invalid copy range

    copyData = [];          //Empty array to copy new data

    let [startRow, startCol, endRow, endCol] = [rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1]];
    for(let i = startRow; i <= endRow; i++){
        let copyRow = [];
        for(let j = startCol; j <= endCol; j++){
            let cellProp = sheetDB[i][j];
            let cellPropCopy = JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(cellPropCopy);

            cellProp.fontFamily = "Arial";
            cellProp.fontSize = "14";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underlined = false;
            cellProp.alignment = "left";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.value = "";



            let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
            cell.click();
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    defaultSelectedCellsUI();
});
