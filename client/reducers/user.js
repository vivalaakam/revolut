import {put, call, select} from 'redux-saga/effects';
import {takeEvery, delay} from 'redux-saga';
import {createAction} from 'redux-actions';
import {setError, resetError} from './error';

import moment from 'moment';

const SET_BIRTHDAY = 'user/SET_BIRTHDAY';
const SET_USERNAME = 'user/SET_USERNAME';
const SET_PHONE = 'user/SET_PHONE';
const SET_ERROR = 'user/SET_ERROR';
const RESET_ERROR = 'user/RESET_ERROR';
const UPDATE_USER = 'user/UPDATE_USER';
const VALIDATE_USER = 'user/VALIDATE_USER';
const SUBMIT_USER = 'user/SUBMIT_USER';
const CHECK_USER = 'user/CHECK_USER';
const STATE_USER = 'user/STATE_USER';

const FIELDS = ['birthday', 'username', 'firstName', 'lastName', 'phone'];

const $$initialState = {
    birthday: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    prev_username: '',
    astrosign: ''
};

export default function user(state = $$initialState, action) {
    switch (action.type) {
        case UPDATE_USER:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}

const setBirthday = createAction(SET_BIRTHDAY);
const setUsername = createAction(SET_USERNAME);
const setPhone = createAction(SET_PHONE);
const updateUser = createAction(UPDATE_USER);
const check = createAction(CHECK_USER);


export {
    setBirthday,
    setUsername,
    setPhone,
    updateUser,
    check
}

const validators = {
    birthday: (birthday) => moment(birthday, 'DD.MM.YYYY').isValid() ? false : {birthday: 'Invalid date'},
    username: username => (/^[a-z0-9._-]+$/gi).test(username) ? false : {username: 'Invalid username'},
    phone: phone => (/^[0-9]+$/gi).test(phone) ? false : {phone: 'Invalid phone no'}
};

export function getUser(state) {
    return state.user
}

function* updateBirthday({payload}) {
    if (!(/_/g).test(payload)) {
        let error = validators.birthday(payload);
        if (!error) {
            yield put(updateUser({birthday: payload}));
            yield call(fetchAstrosign, payload);
        } else {
            yield put(setError(error))
        }
    }
}

function* updateUsername({payload}) {
    if (payload !== '') {
        let error = validators.username(payload);
        if (!error) {
            yield put(updateUser({username: payload}));
        } else {
            yield put(setError(error))
        }
    } else {
        yield put(updateUser({username: payload}));
    }
}

function* updatePhone({payload}) {
    var error = validators.phone(payload);
    if (!error) {
        yield put(updateUser({phone: payload}));
    } else {
        yield put(setError(error))
    }
}

function* resetErrors({payload}) {
    yield Object.keys(payload).map(key => put(resetError(key)))
}

function* fetchAstrosign(birthday) {
    let {astrosign} = yield fetch(`/astrosign/`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({birthday})
    }).then(data => data.json());
    yield put(updateUser({astrosign}));
}

export function* getBlank() {
    let user = yield select(getUser);
    let blank = yield FIELDS.map(key => !user[key] ? put(setError({[key]: 'Cannot be blank'})) : false)
        .filter(val => val);

    return blank;
}

export function* getValid() {
    let user = yield select(getUser);
    let valid = yield Object.keys(validators).map(field => {
        let error = validators[field](user[field]);
        return error && put(setError(error));

    }).filter(val => val);

    return valid;
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

