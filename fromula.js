// Adding event listener to all cells to store the entered value into db
for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
        let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getActiveCell(address);

            // let enteredValue = activeCell.value;
            let enteredValue = activeCell.innerText;

            // console.log(enteredValue);
            // console.log(cellProp.value);
            //No need to update any thing
            if(enteredValue == cellProp.value || !enteredValue)         return;

            cellProp.value = enteredValue;
            // console.log("Kela remove");
            removeChildFromParent(cellProp.formula);     //value swata lihili ahe tr kaheka parent child relation
            cellProp.formula = "";                      //jo kahi formula ahe to erase kra karan cell chi value ata hard coded ahe
            updateChildrenCells(address);               //navin value sobat children na update kra

        }) 
    }
}

//Formula bar evaluation
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula){           //formulaBar chi value not null havi. Jr string empty asel tr ti by default false aste
        let address = addressBar.value;
        let [cell, cellProp] = getActiveCell(address);
        if(cellProp.formula !== inputFormula)   removeChildFromParent(cellProp.formula);
        
        //For adding child to parent in graphcomponent
        addChildToGraphComponent(inputFormula, address);

        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse != null){
            // alert("Your formula forms cycle. Please update it.");
            let response = confirm("Your formula forms cycle. Do you want to trace the path?");
            while(response === true){
                //keep on tracking color until user is statisfies
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);          // Wait till completion of color tracking
                response = confirm("Your formula forms cycle. Do you want to trace the path?");

            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);
        
        //To update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        // console.log(sheetDB);

        updateChildrenCells(address);
}});

//Function to evaluate formula, it can be normal one such as 10 + 20 or it can be dependent such as A1 + 10 or A1 + A2
function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");        //Returns array which splits strings based upon given parameter(in this case given parameter is space)
    
    for(let i=0; i<encodedFormula.length; i++){
        let ch = encodedFormula[i].charCodeAt(0);
        if(ch >= 65 && ch <= 90){
            let [cell, cellProp] = getActiveCell(encodedFormula[i]);        //Here encodedFormula[i] is address such as "A1" or "B5"
            encodedFormula[i] = cellProp.value;
        }
    }
    
    let decodedFormula = encodedFormula.join(" ");          //Joins array to string seperated by space
    return eval(decodedFormula);           //Default js function which evaluates strings and returns ans
}

function setCellUIAndCellProp(evaluatedValue, formula, address){
    let [cell, cellProp] = getActiveCell(address);

    cell.innerText = evaluatedValue;    //UI Update

    //DB Update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}

//Function to add child to parent, it is required to add dependencies
function addChildToParent(formula){
    let childAddress = addressBar.value;

    let encodedFormula = formula.split(" ");
    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell, parentCellProp] = getActiveCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

//Function to remove child from parent
function removeChildFromParent(formula){
    let childAddress = addressBar.value;

    let encodedFormula = formula.split(" ");
    for(let i=0; i<encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell, parentCellProp] = getActiveCell(encodedFormula[i]);
            //get index of item to remove it
            let idx = parentCellProp.children.indexOf(childAddress);
            //removes or erases an element from array
            parentCellProp.children.splice(idx, 1);
        }
    }
}

//Depth first search, function to update all the children of a parent
function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = getActiveCell(parentAddress);
    let children = parentCellProp.children;

    for(let i=0; i<children.length; i++){
        let [childCell, childCellProp] = getActiveCell(children[i]);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        //To update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, childFormula, children[i]);

        //recursive call to update all the children i.e. dfs
        updateChildrenCells(children[i]);
    }
}

//Function to add child to graph component (required in cycleValidation.js)
function addChildToGraphComponent(formula, childAddress){
    let [rid, cid] = decodeFromAddress(childAddress);

    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [prid, pcid] = decodeFromAddress(encodedFormula[i]);        //prid id parent row id and pcid is parent column id
            // B1 : A1 + 10      here A1 is parent so pid = 0, cid = 0
            graphComponentMatrix[prid][pcid].push([rid, cid]);
        }
    }
}

//Function to remove child from graph component
function removeChildFromGraphComponent(formula, childAddress){
    let [rid, cid] = decodeFromAddress(childAddress);

    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [prid, pcid] = decodeFromAddress(encodedFormula[i]);        //prid id parent row id and pcid is parent column id
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}