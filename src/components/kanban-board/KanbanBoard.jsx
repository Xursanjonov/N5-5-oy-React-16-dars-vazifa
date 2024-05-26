import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { FaXmark } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { DATA } from "@/static";
import { STATUS_ITEMS } from "../../static";

const KanbanBoard = () => {
  const [statusSections, setStatusSections] = useState(STATUS_ITEMS)
  const [data, setData] = useState(JSON.parse(localStorage.getItem('message')) || DATA)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [changeStatus, setChangeStatus] = useState(null)
  const [newStatus, setNewStatus] = useState(null)

  const title = useRef(null)
  const desc = useRef(null)

  // Status sections
  const deleteStatus = useCallback((id) => {
    if (confirm(`${id} Shu status o'chirilsinmi ? `)) {
      let index = statusSections?.findIndex(el => el.id === id)
      STATUS_ITEMS?.splice(index, 1)
      setStatusSections([...STATUS_ITEMS])
    }
  }, [statusSections])

  useEffect(() => {
    localStorage.setItem('status', JSON.stringify(statusSections))
  }, [statusSections])
  // karbon item delete
  const deleteItem = useCallback((id) => {
    if (confirm('Rostan o`chirmochimisiz ?')) {
      const filterData = data?.filter(el => el.id !== id)
      setData([...filterData])
    }
  }, [data])
  useEffect(() => {
    if (changeStatus) {
      let index = data?.findIndex(el => el.id === changeStatus.id)
      console.log(index);
      data?.splice(index, 1, changeStatus)
      setData([...data])
    }
  }, [changeStatus])
  // All data localStorage save
  useEffect(() => { localStorage.setItem('message', JSON.stringify(data)) }, [data])

  const filterByStatus = (status) => {
    return data?.filter(el => el.status === status)?.map((el) =>
      <div key={el.id} className="kanban__item">
        <p className="kanban__item__title-btn" >
          {el.title} <FaTrashAlt onClick={() => deleteItem(el.id)} fontSize={12} color='red' />
        </p>
        <p className="kanban__commit">{el.desc}</p>
        <div className="kanban__status">
          <select value={el.status} onChange={(e) => setChangeStatus({ ...el, status: e.target.value })} >
            {
              STATUS_ITEMS?.map(el => (
                <option key={el.id} value={el.title} >{el.title}</option>
              ))
            }
          </select>
          <span>{el?.createdAt?.split('T')[1].slice(0, 5)}</span>
        </div>
      </div>
    )
  }

  let memoFilterByStatus = useCallback((status) => { return filterByStatus(status) }, [data])
  const handleCreateItem = (e) => {
    e.preventDefault()
    let date = new Date()
    let timeZoneGMT = (hour) => new Date(date.getTime() + (hour * 60 * 60 * 1000))

    let newItems = {
      id: date,
      title: title.current.value,
      desc: desc.current.value,
      status: selectedStatus,
      createAt: timeZoneGMT(5).toISOString()
    }
    setData(prev => [...prev, newItems])
    setSelectedStatus(null)
    setNewStatus(null)
    title.current.value = ""
    desc.current.value = ""
  }
  // Status Section create
  const handaleNewStatus = (e) => {
    e.preventDefault()
    STATUS_ITEMS?.push(statusSections)
    setStatusSections({ id: nanoid(), title: '', bgColor: '' })
  }

  return (
    <section>
      <div className="container">
        <div className="kanban">
          <h2 className="kanban__title">Kanban Board</h2>
          <div className="kanban__header"> <button onClick={() => setNewStatus('dsBlock')} className="kanban__newStatus__btn">Add</button> </div>
          {
            STATUS_ITEMS.length ? (
              <div className="kanban__wrapper">
                {
                  STATUS_ITEMS?.map(status => (
                    <div key={status.id} className={`kanban__box ${status.bgColor}`}>
                      <div className="kanban__heading">
                        <p>{status.title} to start / {memoFilterByStatus(status.title).length}</p>
                      </div>
                      <div className="kanban__block">{memoFilterByStatus(status.title).length ? memoFilterByStatus(status.title) : (
                        <div className='kanban__delete'>
                          <h1 className='kanban__delete__title'>Statusda hozircha ma`lumot yo`q</h1>
                          <button onClick={() => deleteStatus(status.id)} className='kanban__delete__btn'>Status Delete</button>
                        </div>
                      )}</div>
                      <button onClick={() => (setSelectedStatus(status.title), setNewStatus('dsBlock'))} className="kanban__add_btn">Add item</button>
                    </div>
                  ))
                }
              </div>) : (
              <div className="kanban__newStatus">
                <h1>Saytimizga hush kelibsiz Kuningizni hozirdan rejalashtirib oling</h1>
                <button onClick={() => setNewStatus('dsBlock')} className="kanban__newStatus__btn"> Get Started </button>
                <div className={`modal overflow ${newStatus ? newStatus : 'hidden'}`} onClick={() => setNewStatus(null)}></div>
                <div className={`modal__style ${newStatus ? newStatus : ' hidden'}`}>
                  <form onSubmit={handaleNewStatus} className="status__form__control">
                    <h1 className="from-title">Create New Status <FaXmark color="red" onClick={() => setNewStatus('hidden')} /> </h1>
                    <input onChange={(e) => setStatusSections({ ...statusSections, title: e.target.value })} required
                      className="from-input" type="text" placeholder="Status Title" />
                    <select className="from-selected" defaultValue={'purple'} onChange={(e) => setStatusSections(prev => ({ ...prev, bgColor: e.target.value }))} >
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                    </select>
                    <button className="from-btn" type="submit">Create Status</button>
                  </form>
                </div>
              </div>)}
        </div>
      </div> {selectedStatus ? (<Fragment>
        <div className={`modal overflow ${newStatus ? newStatus : 'hidden'}`} onClick={() => setNewStatus(null)}></div>
        <div className={`modal__style ${newStatus ? newStatus : ' hidden'}`}>
          <form onSubmit={handleCreateItem} className="status__form__control">
            <h1 className="from-title">Create {selectedStatus} <FaXmark color="red" onClick={() => setNewStatus('hidden')} /> </h1>
            <input ref={title} type="text" className="from-input" required placeholder="Title" />
            <input ref={desc} type="text" className="from-input" placeholder="Description" />
            <button className="from-btn" type="submit">Create {selectedStatus}</button>
          </form>
        </div>
      </Fragment>) : <></>}
    </section>
  );
};


export default memo(KanbanBoard)