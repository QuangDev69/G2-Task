import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import { fetchBoardDetails, createNewColumn } from 'actions/ApiCall'


function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOnNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const newColumInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value)


  //use EF on react
  useEffect(() => {
    const boardId = '63f470c630ef0b3e55f4e3d1'
    fetchBoardDetails(boardId).then(board => {
      setBoard(board)
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
    })
  }, [])

  useEffect(() => {
    if (newColumInputRef && newColumInputRef.current) {
      newColumInputRef.current.focus()
      newColumInputRef.current.select()
    }
  }, [openNewColumnForm])
  if (isEmpty(board)) {
    return (
      <div className='not-found' style={{ padding: '15px', color: 'white' }}>
        Board not found
      </div>
    )
  }
  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult )

    let newBoard={ ...board }
    newBoard.columnOrder= newColumns.map(column => column._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }
  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !==null) {
      let newColumns = [...columns]

      let currentColumn = newColumns.find(column => column._id === columnId)

      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)

      setColumns(newColumns)
    }
  }
  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumInputRef.current.focus()
      return
    }
    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim()
    }
    createNewColumn(newColumnToAdd).then(column => {
      let newColumns = [...columns]
      newColumns.push(column )

      let newBoard={ ...board }
      newBoard.columnOrder= newColumns.map(column => column._id)
      newBoard.columns = newColumns

      setColumns(newColumns)
      setBoard(newBoard)
      setNewColumnTitle('')
      toggleOnNewColumnForm()
    })
  }

  const onUpdateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id

    let newColumns=[...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate)
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard={ ...board }
    newBoard.columnOrder= newColumns.map(column => column._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)

  }

  return (
    <div className='board-content'>
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload= {index => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumnState={onUpdateColumnState}
            />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className='task-manager-container'>
        {!openNewColumnForm &&
        <Row>
          <Col className='add-new-column' onClick={toggleOnNewColumnForm}>
            <i className='fa fa-plus icon'/> Add another column
          </Col>
        </Row>
        }
        {openNewColumnForm &&
        <Row>
          <Col className='enter-new-column'>
            <Form.Control
              size= "sm"
              type="text"
              placeholder="Enter column title..."
              className='input-enter-new-column'
              ref={newColumInputRef}
              value={newColumnTitle}
              onChange={onNewColumnTitleChange}
              onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
            />
            <Button variant='success' size="sm" onClick={addNewColumn}> Add column</Button>
            <span className='cancel-icon' onClick={toggleOnNewColumnForm}>
              <i className='fa fa-times icon'></i>
            </span>
          </Col>
        </Row>
        }
      </BootstrapContainer>
    </div>
  )
}
export default BoardContent
