import axios from "axios";
import {
  ACCOUNTFAILED,
  ACCOUNTLOADING,
  GETALLACCOUNTSSUCCESS,
  GET_ONE_ACCOUNT_SUCCESS,
  UPDATE_USER_SUCCESS,
} from "../actiontypes/accounttypes";
import { getUser } from "./useraction";

const baseURL = "http://localhost:4500/account/";

/**
 *@method GET /account/
 *@description  get all users
 *@access authenticated user
 */
export const getAllAccounts = () => async (dispatch) => {
  dispatch({ type: ACCOUNTLOADING });

  const opts = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
  try {
    const { data } = await axios.get(baseURL, opts);

    dispatch({ type: GETALLACCOUNTSSUCCESS, payload: data.accounts });
    if (data.msg) {
      alert(data.msg);
    }
  } catch (error) {
    dispatch({ type: ACCOUNTFAILED, payload: error });
    console.log(error);
  }
};

/**
 *@method PUT /account/edit
 *@description  update user
 *@access authenticated user
 */
export const updateUser = (formData) => async (dispatch) => {
 
  try {
    dispatch({ type: ACCOUNTLOADING });
    const { data } = await axios.put(`${baseURL}edit/${formData.id}`, formData);

    dispatch({ type: UPDATE_USER_SUCCESS });
    dispatch(getUser());

    if (data.msg) {
      alert(data.msg);
    }
  } catch (error) {
    dispatch({ type: ACCOUNTFAILED, payload: error });
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
 *@method PUT /account/edit/pfp/:id
 *@description  update user pfp
 *@access authenticated user
 */
export const updateProfilePicture = (userId, file) => async (dispatch) => {
  dispatch({ type: ACCOUNTLOADING });

  try {
    const formData = new FormData(); // Create a new FormData object
    formData.append("file", file); // Append the file to the FormData object

    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.put(
      `${baseURL}edit/pfp/${userId}`,
      formData,
      options
    );

    dispatch({ type: UPDATE_USER_SUCCESS });
    dispatch(getUser());

    if (data.msg) {
      alert(data.msg);
    }
  } catch (error) {
    dispatch({ type: ACCOUNTFAILED, payload: error });
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
 *@method GET /account/
 *@description  get one user
 *@access authenticated user
 */
export const getOneAccount = (id) => async (dispatch) => {
  dispatch({ type: ACCOUNTLOADING });

  try {
    const { data } = await axios.get(`${baseURL}${id}`);

    dispatch({ type: GET_ONE_ACCOUNT_SUCCESS, payload: data.account });
    if (data.msg) {
      alert(data.msg);
    }
  } catch (error) {
    dispatch({ type: ACCOUNTFAILED, payload: error });
    console.log(error);
  }
};
