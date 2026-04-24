import {
    GET_DATA_OVERTIME_SUCCESS,
    GET_DATA_OVERTIME_FAILURE,
    CREATE_DATA_OVERTIME_SUCCESS,
    CREATE_DATA_OVERTIME_FAILURE,
    DELETE_DATA_OVERTIME_SUCCESS,
    DELETE_DATA_OVERTIME_FAILURE
} from '../../action/dataOvertimeAction/dataOvertimeActionTypes';

const initialState = {
    dataOvertime: [],
    loading: true,
    error: null,
    message: ''
};

const dataOvertimeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_OVERTIME_SUCCESS:
            return {
                ...state,
                dataOvertime: action.payload,
                loading: false,
                error: null
            };
        case GET_DATA_OVERTIME_FAILURE:
            return {
                ...state,
                dataOvertime: [],
                loading: false,
                error: action.payload
            };
        case CREATE_DATA_OVERTIME_SUCCESS:
            return {
                ...state,
                message: action.payload,
                loading: false,
                error: null
            };
        case CREATE_DATA_OVERTIME_FAILURE:
            return {
                ...state,
                message: '',
                loading: false,
                error: action.payload
            };
        case DELETE_DATA_OVERTIME_SUCCESS:
            return {
                ...state,
                message: action.payload,
                loading: false,
                error: null
            };
        case DELETE_DATA_OVERTIME_FAILURE:
            return {
                ...state,
                message: '',
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default dataOvertimeReducer;
