import React, { Fragment, memo } from 'react'
import KanbanBoard from './components/kanban-board/KanbanBoard'

// npm create vite
const App = () => {
  return (
    <Fragment>
      <KanbanBoard />
    </Fragment>
  )
}

export default memo(App)