//For delay and wait
function colorPromise(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse){
    let [srow, scol] = cycleResponse;

    //Dependency -> visited, dfsVisited
    let visited = [];
    let dfsVisited = [];

    for(let i = 0; i<rows; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];

        for(let j = 0; j<cols; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }

        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    // for(let i=0; i < rows; i++){
    //     for(let j=0; j < cols; j++){
    //         if(visited[i][j] === false){
    //             let response = dfsCycleDetectionTracePath(graphComponentMatrix, i, j, visited, dfsVisited);
    //             if(response === true)        return true;
    //         }
    //     }
    // }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srow, scol, visited, dfsVisited);
    if(response === true)     return Promise.resolve(true); 

    return Promise.resolve(false); 
}

//Coloring cell for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srow, scol, visited, dfsVisited){      // srow -> source row, scol -> source col
    visited[srow][scol] = true;
    dfsVisited[srow][scol] = true;

    let cell = document.querySelector(`.cell[rid = "${srow}"][cid = "${scol}"]`);


    cell.style.backgroundColor = "lightblue";
    await colorPromise();       

    for(let children = 0; children < graphComponentMatrix[srow][scol].length; children++){
        let [nbrr, nbrc] = graphComponentMatrix[srow][scol][children];              // nbrr -> neighbor row, nbrc -> neighbor col
        if(visited[nbrr][nbrc] === false){
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);     //Here await is important

            if(response === true){
                cell.style.backgroundColor = "transparent";           //Backtracking
                await colorPromise();       
                return Promise.resolve(true); 
            }           
        }
        else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true){
            let cyclicCell = document.querySelector(`.cell[rid = "${nbrr}"][cid = "${nbrc}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();

            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();
            
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);            
        }
    }

    dfsVisited[srow][scol] = false;
    return Promise.resolve(false); 
}