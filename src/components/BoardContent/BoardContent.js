import React, {useState,useEffect } from "react"
import { isEmpty } from "lodash";
import './BoardContent.scss'
import Column from "components/Column/Column";
import { mapOrder } from "utilities/sorts";
import { initialData } from "actions/initialData";

function BoardContent() {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => {
      const boardFromDb= initialData.boards.find(board => board.id === 'board-1')
      if (boardFromDb) {
          setBoard(boardFromDb)

          //sort col
        
          setColumns(mapOrder(boardFromDb.columns, boardFromDb.columnOrder, 'id'))
      }
    },[])
    if(isEmpty(board)){
      return <div className="not-found" style={{"padding":'15px', 'color': 'white'}}>Board not found</div>
    } 
    return(
        <div className="board-content">
        {columns.map((column, index)=><Column key={index} column={column}/>)}
      </div>
    )
}


export default BoardContent