import {createAction} from 'redux-actions';

const SET_ERROR = 'error/SET_ERROR';
const RESET_ERROR = 'error/RESET_ERROR';

const $$initialState = {};

export default function error(state = $$initialState, action) {
    switch (action.type) {
        case SET_ERROR:
            return {...state, ...action.payload};

        case RESET_ERROR:
            delete state[action.payload];
            return {
                ...state
            };
        default:
            return state
    }
}

const setError = createAction(SET_ERROR);
const resetError = createAction(SET_ERROR);

export {
    setError,
    resetError
}