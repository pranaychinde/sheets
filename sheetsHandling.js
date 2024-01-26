let addSheetBtn = document.querySelector(".sheet-add-icon");
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheets-folder");
    
    let allSheetFolders = document.querySelectorAll(".sheets-folder");
    sheet.setAttribute("id", allSheetFolders.length);           //New sheet will have id based upon length (There will be always one sheet present)
    
    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length+1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();                     //New sheet add keli say 50th tr tithle ajubsjuche dheets disle pahijet, tithe hi property use krta yete

    //Database DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    sheet.click();
    handleSheetRemoval(sheet);
})

function handleSheetDB(sheetIdx){
    sheetDB = sheetDBCollection[sheetIdx];      //sheetDB is declared inside file "cell-properties.js" and this line will assign the sheetDB with correct DB from the sheetDBCollection (This is required to get which sheet is currently active and that sheet's data needed to be diplayed)
    graphComponentMatrix = graphComponentMatrixCollection[sheetIdx];
}

function handleSheetProperties(){
    for(let i = 0; i < rows; i++){
        for(let j=0; j < cols; j++){
            let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
            cell.click();           // 'addListenerToAttachCellProperties' function in file 'cell-properties.js' sets the properties from the DB to UI, this event listener triggers when it is click hence we will click each cell.
        }
    }
    //By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetActivenessUI(sheet){
    let allSheetFolders = document.querySelectorAll(".sheets-folder");
    for(let i=0; i<allSheetFolders.length; i++){
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = "#ced6e0";
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetActivenessUI(sheet);
    })
}


function createSheetDB(){
    let sheetDB = [];

    for(let i=0; i<rows; i++){
        let sheetRow = [];
        for(let j=0; j<cols; j++){
            let cellProp = {
                fontFamily: "Arial",
                fontSize: "14",
                bold: false,
                italic: false,
                uderlined: false,
                alignment: "left",
                fontColor: "#000000",
                BGcolor: "#000000", 
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }

    sheetDBCollection.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphComponentMatrix = [];

    for(let i=0; i < rows; i++){
        let row = [];
        for(let j=0; j < cols; j++){
            // Why array -> More than 1 child relation(dependancy)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }

    graphComponentMatrixCollection.push(graphComponentMatrix);
}

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown", (e) => {
        if(e.button !== 2)      return; // 0 -> left click, 1-> scroll, 2 -> right click
        
        let allSheetFolders = document.querySelectorAll(".sheets-folder");
        if(allSheetFolders.length === 1){
            alert("You need to have atleast one sheet!");
            return;
        }

        let response = confirm("Permanently delete sheet?");
        if(response === false)      return;

        let sheetIdx = Number(sheet.getAttribute("id"));

        //DB
        sheetDBCollection.splice(sheetIdx, 1);
        graphComponentMatrixCollection.splice(sheetIdx, 1);

        //UI
        handleSheetRemovalUI(sheet);

        //By default assign DB to sheet 1 (active)
        sheetDB = sheetDBCollection[0];
        graphComponentMatrix = graphComponentMatrixCollection[0];
        handleSheetProperties();
    })
}

function handleSheetRemovalUI(sheet){
    sheet.remove();

    let allSheetFolders = document.querySelectorAll(".sheets-folder");
    for(let i=0; i<allSheetFolders.length; i++){
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = "#ced6e0";
}