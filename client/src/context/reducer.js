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
    EDIT_TASK_BEGIN,
    EDIT_TASK_SUCCESS,
    EDIT_TASK_ERROR,
    CLEAR_FILTERS,
    CHANGE_PAGE,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    DELETE_TASK_BEGIN,
} from "./actions"

import { initialState } from "./appContext"

const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please provide all values!",
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }
  if (action.type === REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      taskLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "User created! Redirecting...",
    };
  }
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === LOGIN_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      taskLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "Login successful! Redirecting...",
    };
  }
  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      taskLocation: "",
      userLocation: "",
    };
  }
  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      taskLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "User Profile Updated",
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }
  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editTaskId: "",
      details: "",
      title: "",
      taskLocation: state.userLocation || "",
      taskType: "practice",
      status: "pending",
    };
    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === CREATE_TASK_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === CREATE_TASK_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "new task created",
    };
  }
  if (action.type === CREATE_TASK_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_TASKS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_TASKS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      tasks: action.payload.tasks,
      totalTasks: action.payload.totalTasks,
      numOfPages: action.payload.numOfPages,
    };
  }
  if (action.type === SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      search: "",
      searchStatus: "all",
      searchType: "all",
      sort: "latest",
    };
  }
  if (action.type === CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }
  if (action.type === SET_EDIT_TASK) {
    const task = state.tasks.find((task) => task._id === action.payload.id);
    const { _id, title, details, taskLocation, taskType, status } = task;
    return {
      ...state,
      isEditing: true,
      editTaskId: _id,
      title,
      details,
      taskLocation,
      taskType,
      status,
    };
  }
  if (action.type === EDIT_TASK_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === EDIT_TASK_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Task Updated!",
    };
  }
  if (action.type === EDIT_TASK_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === DELETE_TASK_BEGIN) {
    return { ...state, isLoading: true };
  }
  throw new Error(`no such action : ${action.type}`);
};

export default reducer;