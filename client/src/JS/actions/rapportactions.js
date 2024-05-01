import axios from "axios";
import {
  CREATEREPORTSUCCESS,
  DOWNLOAD_REPORT_FAILED,
  DOWNLOAD_REPORT_SUCCESS,
  RAPPORTFAILED,
  RAPPORTLOADING,
  GETALLREPORTSSUCCESS,
  UPDATE_REPORT_SUCCESS,
  UPDATE_REPORT_FAIL,
} from "../actiontypes/rapporttypes";

const baseURL = "http://localhost:4500/rapport/";

/**
 *@method POST /rapport/add
 *@description post a report
 *@access protected(authentifié+role:student)
 */
export const createReport = (newReportData) => async (dispatch) => {
  dispatch({
    type: RAPPORTLOADING,
  });

  try {
    const formData = new FormData();
    formData.append("student", newReportData.student);
    formData.append("message", newReportData.message);
    formData.append("rapport_status", newReportData.rapport_status);
    formData.append("application", JSON.stringify(newReportData.application));

    for (let file of newReportData.files) {
      formData.append("files", file);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios.post(baseURL + "add", formData, config);

    alert(`${res.data.msg}`);
    dispatch({ type: CREATEREPORTSUCCESS });
    dispatch(getAllReports());
  } catch (error) {
    dispatch({ type: RAPPORTFAILED, payload: error });
    console.log(error);
    if (error.response.data.errors) {
      error.response.data.errors.forEach((el) => alert(el.msg));
    }
    if (error.response.data.msg) {
      alert(error.response.data.msg);
    }
  }
};

export const downloadReport = (reportId, filename) => async (dispatch) => {
  try {

    const res = await axios.get(`${baseURL}${reportId}/download/${filename}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();

    // Clean-up
    document.body.removeChild(link);

    // Dispatch success action
    dispatch({ type: DOWNLOAD_REPORT_SUCCESS });
  } catch (error) {
    // Dispatch failure action with error payload
    dispatch({ type: DOWNLOAD_REPORT_FAILED, payload: error });
    console.error("Error downloading report:", error);
  }
};

/**
 * @method GET /rapport
 * @description Get all reports
 * @access Protected (only accessible to authenticated users)
 */
export const getAllReports = () => async (dispatch) => {
  dispatch({ type: RAPPORTLOADING });

  try {
    const res = await axios.get(baseURL);

    dispatch({ type: GETALLREPORTSSUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: RAPPORTFAILED, payload: error });
    console.error(error);
  }
};

/**
 * @method PUT /rapport/:id
 * @description update report
 * @access Protected (only accessible to authenticated users)
 */
export const updateReport = (reportId, updatedData) => async (dispatch) => {
  try {
    const res = await axios.put(baseURL + `${reportId}`, updatedData);

    dispatch({
      type: UPDATE_REPORT_SUCCESS,
      payload: res.data,
    });
    dispatch(getAllReports());
    alert(`${res.data.msg}`);
  } catch (error) {
    dispatch({
      type: UPDATE_REPORT_FAIL,
      payload: error.response.data.msg,
    });
  }
};
