import axios from 'axios';
import {
    GET_DATA_OVERTIME_SUCCESS,
    GET_DATA_OVERTIME_FAILURE,
    CREATE_DATA_OVERTIME_SUCCESS,
    CREATE_DATA_OVERTIME_FAILURE,
    DELETE_DATA_OVERTIME_SUCCESS,
    DELETE_DATA_OVERTIME_FAILURE
} from './dataOvertimeActionTypes';

export const getDataOvertime = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://localhost:5000/data_overtime');
            dispatch({
                type: GET_DATA_OVERTIME_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_OVERTIME_FAILURE,
                payload: error.response?.data?.msg || error.message
            });
        }
    };
};

export const createDataOvertime = (data, navigate) => async (dispatch) => {
    try {
        const response = await axios.post("http://localhost:5000/data_overtime", data);
        dispatch({
            type: CREATE_DATA_OVERTIME_SUCCESS,
            payload: response.data,
        });
        navigate("/data-overtime");
        return response.data;
    } catch (error) {
        dispatch({
            type: CREATE_DATA_OVERTIME_FAILURE,
            payload: error.response?.data?.msg || error.message,
        });
        throw error;
    }
};

export const deleteDataOvertime = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`http://localhost:5000/data_overtime/${id}`);
            dispatch({
                type: DELETE_DATA_OVERTIME_SUCCESS,
                payload: response.data.msg
            });
            dispatch(getDataOvertime());
        } catch (error) {
            dispatch({
                type: DELETE_DATA_OVERTIME_FAILURE,
                payload: error.response?.data?.msg || error.message
            });
        }
    };
};
