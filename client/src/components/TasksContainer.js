import { useAppContext } from '../context/appContext'
import { useEffect } from 'react'
import Loading from './Loading'
import Task from './Task'
import Wrapper from '../assets/wrappers/JobsContainer'

const TasksContainer = () => {
    const { 
        getTasks, 
        tasks, 
        isLoading, 
        page, 
        totalTasks, 
        search,
        searchStatus,
        searchType,
        sort,
        numOfPages,} = useAppContext()

    useEffect(() => {
        getTasks()
    }, [page, search, searchStatus, searchType, sort])
    if (isLoading) {
        return <Loading center />
    }

    if(tasks.length === 0) {
        return (
        <Wrapper>
            <h2>You don't have any matching tasks</h2>
        </Wrapper>
        )
    }
  return (
    <Wrapper>
      <h5>{totalTasks} thing{tasks.length > 1 && "s"} to do</h5>
      <div className="tasks">
          {tasks.map((task) => {
              return <Task key={task._id}{...task} />
          })}
      </div>
      {/* pagination buttons */}
    </Wrapper>
  )
}

export default TasksContainer
