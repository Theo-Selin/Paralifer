import React, { useReducer, useContext } from "react";

import reducer from "./reducer";
import axios from "axios";

import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_TASK_BEGIN,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
  GET_TASKS_BEGIN,
  GET_TASKS_SUCCESS,
  SET_EDIT_TASK,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
} from "./actions";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  showSidebar: false,
  isEditing: false,
  editTaskId: "",
  details: "",
  title: "",
  taskLocation: userLocation || "",
  taskTypeOptions: ["Quitting", "Practice", "Create", "Relaxing"],
  taskType: "Practice",
  statusOptions: ["started", "finished", "pending"],
  status: "pending",
  tasks: [],
  totalTasks: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  //request
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["Authorization"] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
    //response
    authFetch.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // console.log(error.response)
        if(error.response.status === 401){
            logoutUser()
        }
        return Promise.reject(error)
      }
    );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearAlert()
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 1000);
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", currentUser);
      // console.log(response)
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.message },
      });
    }
    clearAlert();
  };
  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post("/api/v1/auth/login", currentUser);
      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.message },
      });
    }
    clearAlert();
    console.log(currentUser);
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };
  const updateUser = async (currentUser) => {
      dispatch({type: UPDATE_USER_BEGIN})
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);

      const {user, location, token} = data

      dispatch({type: UPDATE_USER_SUCCESS, payload: {user, location, token}})
      addUserToLocalStorage({user, location, token})
    } catch (error) {
        if (error.response.status !== 401){
            dispatch({
                type: UPDATE_USER_ERROR, 
                payload: {msg: error.response.data.message}
            })
        }
    }
    clearAlert()
  };

  const handleChange = ({name, value}) => {
    dispatch({ type: HANDLE_CHANGE, payload: {name, value} })
  }
  const clearValues = () => {
    dispatch({type: CLEAR_VALUES })
  }
  const createTask = async () => {
    dispatch({type: CREATE_TASK_BEGIN})
    try {
      const {title, details, taskLocation, taskType, status} = state
      await authFetch.post("/tasks", {
        title, 
        details, 
        taskLocation, 
        taskType, 
        status
      })
      dispatch({type: CREATE_TASK_SUCCESS})
      dispatch({type: CLEAR_VALUES})
    } catch (error) {
      if(error.response.status === 401) return
      dispatch({type: CREATE_TASK_ERROR, payload: {msg: error.response.data.message}}
        )
    }
    clearAlert()
  }

  const getTasks = async () => {
    const { page, search, searchStatus, searchType, sort } = state

    let url = `/tasks?page=${page}&status=${searchStatus}&taskType=${searchType}&sort=${sort}`
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: GET_TASKS_BEGIN })
    try {
      const { data } = await authFetch(url)
      const { tasks, totalTasks, numOfPages } = data
      dispatch({
        type: GET_TASKS_SUCCESS,
        payload: {
          tasks,
          totalTasks,
          numOfPages,
        },
      })
    } catch (error) {
      //logoutUser()
    }
    clearAlert()
  }

  const setEditTask = (id) => {
    dispatch({type: SET_EDIT_TASK, payload: {id}})
  }
  const editTask = () => {
    console.log("edit task")
  }
  const deleteTask = (id) => {
    console.log(`delete job : ${id}`)
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch('/tasks/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createTask,
        getTasks,
        setEditTask,
        deleteTask,
        showStats,
        clearFilters,
        changePage,
        editTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
