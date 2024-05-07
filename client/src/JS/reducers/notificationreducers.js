import {
  GET_NOTIFICATIONS_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_LOADING,
  POST_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION, // Import the new action type
} from "../actiontypes/notificationtypes";

const initialState = {
  loading: true,
  notifications: [],
  socketNotifications: [], // Add socketNotifications array
  error: null,
};

export const notificationReducer = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case NOTIFICATION_LOADING:
      return { ...state, loading: true };

    case POST_NOTIFICATION_SUCCESS:
      return { ...state, loading: false };

    case GET_NOTIFICATIONS_SUCCESS:
      return { ...state, notifications: payload, loading: false };

    case UPDATE_NOTIFICATION: // Handle the new action type
      return {
        ...state,
        socketNotifications:  [payload],
        loading: false, // Add the new notification to socketNotifications array
      };

    case NOTIFICATION_FAILED:
      return { ...state, error: payload, loading: false };

    default:
      return state;
  }
};
