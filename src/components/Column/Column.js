import React, { useCallback, useEffect, useState } from 'react'
import './Column.scss'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import { mapOrder } from 'utilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'
import {Dropdown, Form } from 'react-bootstrap'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditAble'

function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowModal = () => setShowConfirmModal(!showConfirmModal)

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
    toggleShowModal()
  }

  const [columnTitle, setNewColumnTitle ] = useState('')
  const handleColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])
  const handleColumnTitleBlur = () => {
    // console.log(columnTitle)
    const newColumn = {
      ...column,
      title: columnTitle,
    }
    onUpdateColumn(newColumn)
  }

  useEffect(() => {
    setNewColumnTitle(column.title)
  }, [column.title])

  return (
    <div className="column">
      <header className='column-drag-handle'>
        <div className='column-title'>
          <Form.Control
            size= "sm"
            type="text"
            className='g2task-content-editable'
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur= {handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={e => e.preventDefault()}
            spellCheck= "false"
          />
        </div>
        <div className='column-dropdown-actions'>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" size='sm' className='dropdown-btn'/>
            <Dropdown.Menu>
              <Dropdown.Item >Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowModal}>Remove column...</Dropdown.Item>
              <Dropdown.Item >Move all cards...</Dropdown.Item>
              <Dropdown.Item >Move all cards...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          orientation="vertical"
          groupName="column"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass='card-ghost'
          dropClass='card-ghost-drop'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card=drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className='fa fa-plus icon'/>
          Add another card
        </div>
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content= {`Are you sure you want to remove <strong>${column.title}! </Strong>`}
      />
    </div>
  )
}
export default Column
