let downloadBtn = document.querySelector(".download");
let uploadBtn = document.querySelector(".upload");

// Download 
downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], {type: "application/json"});

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "Sheet";              //anchor element has special attribute of download
    a.click();
});

//Open(upload)
uploadBtn.addEventListener("click", (e) => {
    // opens file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let files = input.files;
        let filesObj = files[0];

        fr.readAsText(filesObj);
        fr.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fr.result);          //We need to parse the data as we have previously stringyfied it

            //basic sheet with default data will be created
            addSheetBtn.click();

            //SheetDB, graphcomponentmatrix
            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            sheetDBCollection[sheetDBCollection.length - 1] = sheetDB;
            graphComponentMatrixCollection[graphComponentMatrixCollection.length - 1] = graphComponentMatrix;

            handleSheetProperties();            //To change the UI as per sheetDB
        })
    })
})