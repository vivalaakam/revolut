import {put, call} from 'redux-saga/effects';
import {takeEvery, delay} from 'redux-saga';

import moment from 'moment';

const SET_BIRTHDAY = 'user/SET_BIRTHDAY';
const SET_USERNAME = 'user/SET_USERNAME';
const SET_PHONE = 'user/SET_PHONE';
const SET_ERROR = 'user/SET_ERROR';
const RESET_ERROR = 'user/RESET_ERROR';
const UPDATE_USER = 'user/UPDATE_USER';
const VALIDATE_USER = 'user/VALIDATE_USER';
const SUBMIT_USER = 'user/SUBMIT_USER';

const STATE_USER = 'user/STATE_USER';

const FIELDS = ['birthday', 'username', 'firstName', 'lastName', 'phone'];

const $$initialState = {
    birthday: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    state: null,
    progress: 0,
    errors: {}
};

export default function user(state = $$initialState, action) {
    switch (action.type) {
        case UPDATE_USER:
            return {
                ...state,
                ...action.payload
            };
        case SET_ERROR:
            let errors = {...state.errors, ...action.payload};

            return {
                ...state,
                errors
            };

        case RESET_ERROR:
            delete state.errors[action.payload];
            return {
                ...state
            };
        default:
            return state
    }
}


export function setBirthday(date) {
    return {
        type: SET_BIRTHDAY,
        payload: {
            date
        }
    }
}

export function setUsername(username) {
    return {
        type: SET_USERNAME,
        payload: {
            username
        }
    }
}

export function updateUser(data) {
    return {
        type: UPDATE_USER,
        payload: data
    }
}

export function setPhone(phone) {
    return {
        type: SET_PHONE,
        payload: {phone}
    }
}

export function setError(error) {
    return {
        type: SET_ERROR,
        payload: error
    }
}

export function resetError(field) {
    return {
        type: RESET_ERROR,
        payload: field
    }
}

export function submitUser(data) {
    return {
        type: SUBMIT_USER,
        payload: data
    }
}

const validators = {
    birthday: (birthday) => moment(birthday, 'DD.MM.YYYY').isValid() ? false : {birthday: 'Invalid date'},
    username: username => (/^[a-z0-9._-]+$/gi).test(username) ? false : {username: 'Invalid username'},
    phone: phone => (/^[0-9]+$/gi).test(phone) ? false : {phone: 'Invalid phone no'}
};

export function* updateBirthday({payload}) {
    if (!(/_/g).test(payload.date)) {
        let error = validators.birthday(payload.date);
        if (!error) {
            yield put(updateUser({birthday: payload.date}));
        } else {
            yield put(setError(error))
        }
    }
}

export function* updateUsername({payload}) {
    if (payload.username !== '') {
        let error = validators.username(payload.username);
        if (!error) {
            yield put(updateUser({username: payload.username}));
        } else {
            yield put(setError(error))
        }
    } else {
        yield put(updateUser({username: payload.username}));
    }
}

export function* updatePhone({payload}) {
    var error = validators.phone(payload.phone);
    if (!error) {
        yield put(updateUser({phone: payload.phone}));
    } else {
        yield put(setError(error))
    }
}

export function* resetErrors({payload}) {
    yield Object.keys(payload).map(key => put(resetError(key)))
}

export function* submit({payload}) {
    let state = true;

    let blank = yield FIELDS.map(key => !payload[key] ? put(setError({[key]: 'Cannot be blank'})) : false)
        .filter(val => val);

    state = state && !blank.length;

    let valid = yield Object.keys(validators).map(field => {
        let error = validators[field](payload[field]);
        return error && put(setError(error));

    }).filter(val => val);

    state = state && !valid.length;

    if (state) {
        yield call(submitData, payload);
    }
}

function* submitData(data) {
    yield put(updateUser({state: 'in_progress'}));
    let {token} = yield fetch(`/astrosign/${data.username}`).then(data => data.json());

    yield call(progressSubmit, token, data)
}

function* progressSubmit(token, data) {
    let {progress, available} = yield fetch(`/astrosign/${data.username}?token=${token}`).then(data => data.json());

    if (progress === 100) {
        yield put(updateUser({progress: progress, state: available ? 'success' : 'failure'}));
    } else {
        yield put(updateUser({progress: progress}));
        yield delay(1000 * Math.random());
        yield call(progressSubmit, token, data)
    }
}

export function* watchSubmitUser() {
    yield* takeEvery(SUBMIT_USER, submit);
}

export function* watchUser() {
    yield* takeEvery(UPDATE_USER, resetErrors);
}

export function* watchBirthday() {
    yield* takeEvery(SET_BIRTHDAY, updateBirthday)
}

export function* watchUsername() {
    yield* takeEvery(SET_USERNAME, updateUsername);
}

export function* watchPhone() {
    yield* takeEvery(SET_PHONE, updatePhone);
}
