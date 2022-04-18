import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddTask = () => {
    const {
        isLoading,
        isEditing,
        showAlert, 
        displayAlert, 
        title, details, 
        taskLocation, 
        taskType, 
        taskTypeOptions, 
        status, 
        statusOptions,
        handleChange,
        clearValues,
        createTask,
        editTask,
    } = useAppContext()

    const handleSubmit = e => {
        e.preventDefault()
        if(!title || !details || !taskLocation) {
            displayAlert()
            return
        }
        if(isEditing) {
          editTask()
          return
        }
        createTask()
    }

    const handleTaskInput = (e) => {
        const name = e.target.name
        const value = e.target.value
        handleChange({name, value})
    }

    return (
      <Wrapper>
        <form className="form">
          <h3>{isEditing ? "edit task" : "add task"}</h3>
          {showAlert && <Alert />}
          <div className="form-center">
            {/* Title */}
            <FormRow
              type="text"
              name="title"
              value={title}
              handleChange={handleTaskInput}
            />
            {/* Details */}
            <FormRow
              type="text"
              name="details"
              value={details}
              handleChange={handleTaskInput}
            />
            {/* Location */}
            <FormRow
              type="text"
              labelText="Task Location"
              name="taskLocation"
              value={taskLocation}
              handleChange={handleTaskInput}
            />
            {/* Task type */}
            <FormRowSelect 
              name="taskType" 
              labelText="category" 
              value={taskType} 
              handleChange={handleTaskInput} 
              list={taskTypeOptions} 
            />
            {/* Task status */}
            <FormRowSelect 
              name="status" 
              value={status} 
              handleChange={handleTaskInput} 
              list={statusOptions} 
            />
            {/* Submit button */}
            <div className="btn-container">
              <button
                type="submit"
                className="btn btn-block submit-btn"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                submit
              </button>
              {/* Clear button */}
              <button className="btn btn-block clear-btn" onClick={(e) => {
                e.preventDefault()
                clearValues()
              }}>
                clear
              </button>
            </div>
          </div>
        </form>
      </Wrapper>
    );
}

export default AddTask