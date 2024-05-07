import axios from "axios";
import {
  ADDAPPLICATIONSUCCESS,
  ADDCOMPANYSUCCESS,
  APPLICATIONFAILED,
  APPLICATIONLOADING,
  COMPANYFAILED,
  COMPANYLOADING,
  DELETECOMPANYSUCCESS,
  EDITAPPLICATIONSUCCESS,
  GETALLAPPLICATIONSUCCESS,
  GETALLCOMPANIESSUCCESS,
} from "../actiontypes/companytypes";
import { postNotification } from "./notificationactions";

const baseURL = "http://localhost:4500/stage/company/";
const baseURLApplication = "http://localhost:4500/stage/";

/**
 * @route GET /company/
 * @description get all companies
 * @access protected(authentifié+role:student)
 */

export const getallCompanies = () => async (dispatch) => {
  dispatch({ type: COMPANYLOADING });
  try {
    const { data } = await axios.get(baseURL);

    dispatch({ type: GETALLCOMPANIESSUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: COMPANYFAILED, payload: error });
  }
};

/**
 *@method POST /company/add
 *@description add a new company
 *@access protected(authentifié+role:student)
 */

export const addcompany = (newCompany) => async (dispatch) => {
  dispatch({
    type: COMPANYLOADING,
  });

  try {
    const res = await axios.post(baseURL + "add", newCompany);

    alert(`${res.data.msg}`);
    dispatch({ type: ADDCOMPANYSUCCESS });
    dispatch(getallCompanies());
  } catch (error) {
    dispatch({ type: COMPANYFAILED, payload: error });
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
 *@method DELETE /company/delete/${companyID}`
 *@description delete a company
 *@access protected(authentifié+role:student)
 */
export const deleteCompany = (companyID) => async (dispatch) => {
  dispatch({
    type: COMPANYLOADING,
  });

  try {
    const { data } = await axios.delete(baseURL + `delete/${companyID}`);

    alert(`${data.msg}`);
    dispatch({ type: DELETECOMPANYSUCCESS, payload: data.msg });
    dispatch(getallCompanies());
  } catch (error) {
    dispatch({ type: COMPANYFAILED, payload: error });
    console.log(error);
  }
};

/**
 * @route get /application/
 * @description get all applications
 * @access protected(authentifié+role:admin)
 */

export const getallApplications = () => async (dispatch) => {
  dispatch({ type: APPLICATIONLOADING });
  try {
    const { data } = await axios.get(baseURLApplication + "application/");

    dispatch({ type: GETALLAPPLICATIONSUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: APPLICATIONFAILED, payload: error });
  }
};

/**
 *@method POST /application/add
 *@description add a new application
 *@access protected(authentifié+role:student)
 */
export const addApplication =
  (newApplication, notificationData) => async (dispatch) => {
    dispatch({
      type: APPLICATIONLOADING,
    });
console.log(notificationData)
    try {
      const res = await axios.post(
        baseURLApplication + "application/add",
        newApplication
      );

      alert(`${res.data.msg}`);
      dispatch({ type: ADDAPPLICATIONSUCCESS });
      dispatch(getallApplications());
      dispatch(postNotification(notificationData));
    } catch (error) {
      dispatch({ type: APPLICATIONFAILED, payload: error });
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
 * @route patch /application/edit
 * @description update  application
 * @access protected(authentifié+role:admin)
 */

export const editApplication =
  (editData) => async (dispatch) => {
    dispatch({
      type: APPLICATIONLOADING,
    });
    
    try {
      const { data } = await axios.patch(
        baseURLApplication + "application/edit",
        editData
      );

      alert(`${data.msg}`);
      dispatch({ type: EDITAPPLICATIONSUCCESS, payload: data.msg });
      dispatch(getallApplications());
      dispatch(postNotification(editData.notificationData));
    } catch (error) {
      dispatch({ type: APPLICATIONFAILED, payload: error });
      console.log(error);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((el) => alert(el.msg));
      }
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      }
    }
  };
