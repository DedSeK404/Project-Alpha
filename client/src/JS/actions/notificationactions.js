import axios from "axios";
import {
  GET_NOTIFICATIONS_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_LOADING,
  POST_NOTIFICATION_SUCCESS,
  MARK_NOTIFICATION_AS_READ_SUCCESS,
  UPDATE_NOTIFICATION,
} from "../actiontypes/notificationtypes";

const baseURL = "http://localhost:4500/notification/";

/**
 *@method POST /notification/add
 *@description create notification
 *@access protected(authentifié+role:student)
 */

export const postNotification = (notificationData) => async (dispatch) => {
  dispatch({
    type: NOTIFICATION_LOADING,
  });

  try {
    const res = await axios.post(baseURL + "add", notificationData);

    dispatch({ type: POST_NOTIFICATION_SUCCESS });
  } catch (error) {
    dispatch({ type: NOTIFICATION_FAILED, payload: error });
    console.log(error);
    if (error.response.data.errors) {
      error.response.data.errors.forEach((el) => alert(el.msg));
    }
    if (error.response.data.msg) {
      alert(error.response.data.msg);
    }
  }
};

/**
 * @route get /notification/
 * @description get all notifications
 * @access protected(authentifié+role:student)
 */

export const getAllNotifications = () => async (dispatch) => {
  dispatch({
    type: NOTIFICATION_LOADING,
  });

  try {
    const res = await axios.get(baseURL);

    dispatch({
      type: GET_NOTIFICATIONS_SUCCESS,
      payload: res.data.notifications,
    });
  } catch (error) {
    dispatch({ type: NOTIFICATION_FAILED, payload: error });
    console.log(error);
    if (error.response.data.errors) {
      error.response.data.errors.forEach((el) => alert(el.msg));
    }
    if (error.response.data.msg) {
      alert(error.response.data.msg);
    }
  }
};

export const markNotificationAsRead =
  (notificationData) => async (dispatch) => {
   
    try {
      await axios.put(
        baseURL + `${notificationData.notificationId}`,
        notificationData
      );
      dispatch({
        type: MARK_NOTIFICATION_AS_READ_SUCCESS,
        payload: notificationData.notificationId,
      });
      dispatch(getAllNotifications());
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Handle error if needed
    }
  };

export const updateNotification = (notification) => async (dispatch) => {
  dispatch({
    type: NOTIFICATION_LOADING,
  });

  dispatch({
    type: UPDATE_NOTIFICATION,
    payload: notification,
  });
  
};
