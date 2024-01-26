// Storage -> 2D matrix (basix needed)
let graphComponentMatrixCollection = [];

let graphComponentMatrix = [];

// for(let i=0; i < rows; i++){
//     let row = [];
//     for(let j=0; j < cols; j++){
//         // Why array -> More than 1 child relation(dependancy)
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

function isGraphCyclic(graphComponentMatrix){
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

    for(let i=0; i < rows; i++){
        for(let j=0; j < cols; j++){
            if(visited[i][j] === false){
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if(response === true)        return [i, j];
            }
        }
    }

    return null;
}

// start -> vis(True) dfsVis(True)
// End -> dfsVis(False)
// If vis[i][j] is true -> already explored path, go back
//  Cycle detection conditon -> if(vis[i][j] == true && difVis[i][j] == true) -> cyle
function dfsCycleDetection(graphComponentMatrix, srow, scol, visited, dfsVisited){      // srow -> source row, scol -> source col
    visited[srow][scol] = true;
    dfsVisited[srow][scol] = true;

    for(let children = 0; children < graphComponentMatrix[srow][scol].length; children++){
        let [nbrr, nbrc] = graphComponentMatrix[srow][scol][children];              // nbrr -> neighbor row, nbrc -> neighbor col
        if(visited[nbrr][nbrc] === false){
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if(response === true){
                return true; 
            }           
        }
        else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true){
            return true;            //Cycle detected
        }
    }

    dfsVisited[srow][scol] = false;
    return false;
}