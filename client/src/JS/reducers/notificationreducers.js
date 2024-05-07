import {
  GET_NOTIFICATIONS_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_LOADING,
  POST_NOTIFICATION_SUCCESS,
} from "../actiontypes/notificationtypes";

const initialState = {
  loading: true,
  notifications: [],
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

    case NOTIFICATION_FAILED:
      return { ...state, error: payload, loading: false };

    default:
      return state;
  }
};
