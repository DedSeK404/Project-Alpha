import axios from "axios";
import {
  ADDAPPLICATIONSUCCESS,
  ADDCOMPANYSUCCESS,
  APPLICATIONFAILED,
  APPLICATIONLOADING,
  COMPANYFAILED,
  COMPANYLOADING,
  DELETECOMPANYSUCCESS,
  DOWNLOAD_APPLICATION_FILE_FAILED,
  DOWNLOAD_APPLICATION_FILE_SUCCESS,
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

    try {
      const formData = new FormData();
      formData.append("first_name", newApplication.first_name);
      formData.append("last_name", newApplication.last_name);
      formData.append("startDate", newApplication.startDate);
      formData.append("endDate", newApplication.endDate);
      formData.append("companyName", newApplication.companyName);
      formData.append("teacher_first_name", newApplication.teacher_first_name);
      formData.append("teacher_last_name", newApplication.teacher_last_name);
      formData.append("teacher_id", newApplication.teacher_id);
      formData.append("student", newApplication.student);
      formData.append("file", newApplication.file);
      console.log(formData.get("file"));

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const res = await axios.post(
        baseURLApplication + "application/add",
        formData,
        config
      );

      dispatch({ type: ADDAPPLICATIONSUCCESS });
      dispatch(getallApplications());
      dispatch(postNotification(notificationData));
      alert(`${res.data.msg}`);
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

export const editApplication = (editData) => async (dispatch) => {
  dispatch({
    type: APPLICATIONLOADING,
  });

  try {
    const { data } = await axios.patch(
      baseURLApplication + "application/edit",
      editData
    );

    dispatch({ type: EDITAPPLICATIONSUCCESS, payload: data.msg });
    dispatch(getallApplications());
    dispatch(postNotification(editData.notificationData));
    alert(`${data.msg}`);
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
 * @method GET /application
 * @description download applicationReport
 * @access Protected (only accessible to authenticated users)
 */
export const downloadApplicationReport =
  (reportId, filename) => async (dispatch) => {
    
    try {
      const res = await axios.get(
        `${baseURLApplication}${reportId}/download/${filename}`,
        {
          responseType: "blob",
        }
      );

      // Create a temporary URL for the blob data
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      // Append the link to the document body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the link from the document body
      document.body.removeChild(link);

      // Dispatch success action
      dispatch({ type: DOWNLOAD_APPLICATION_FILE_SUCCESS });
    } catch (error) {
      // Dispatch failure action with error payload
      dispatch({ type: DOWNLOAD_APPLICATION_FILE_FAILED, payload: error });
      console.error("Error downloading report:", error);
    }
  };
