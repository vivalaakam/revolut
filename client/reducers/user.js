import {put, call, select} from 'redux-saga/effects';
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
const CHECK_USER = 'user/CHECK_USER';
const STATE_USER = 'user/STATE_USER';

const FIELDS = ['birthday', 'username', 'firstName', 'lastName', 'phone'];

const $$initialState = {
    birthday: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    can_login: null,
    prev_username: '',
    state: 'new',
    progress: 0,
    astrosign: '',
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

export function submitUser() {
    return {
        type: SUBMIT_USER
    }
}

export function check() {
    return {
        type: CHECK_USER
    }
}

const validators = {
    birthday: (birthday) => moment(birthday, 'DD.MM.YYYY').isValid() ? false : {birthday: 'Invalid date'},
    username: username => (/^[a-z0-9._-]+$/gi).test(username) ? false : {username: 'Invalid username'},
    phone: phone => (/^[0-9]+$/gi).test(phone) ? false : {phone: 'Invalid phone no'}
};

function getUser(state) {
    return state.user
}


export function* checkUser() {
    let user = yield select(getUser);
    if (user.birthday && user.username && user.username !== user.prev_username) {
        yield call(fetchToken, user);
    }
}

export function* updateBirthday({payload}) {
    if (!(/_/g).test(payload.date)) {
        let error = validators.birthday(payload.date);
        if (!error) {
            yield put(updateUser({birthday: payload.date}));
            yield call(fetchAstrosign, payload.date);
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

export function* submit() {
    let user = yield select(getUser);
    console.log(user);
    let state = true;

    let blank = yield FIELDS.map(key => !user[key] ? put(setError({[key]: 'Cannot be blank'})) : false)
        .filter(val => val);

    state = state && !blank.length;

    let valid = yield Object.keys(validators).map(field => {
        let error = validators[field](user[field]);
        return error && put(setError(error));

    }).filter(val => val);

    state = state && !valid.length;

    console.log(user , state);

    if (state && user.can_login === 'success') {
        yield call(submitData, user);
    }
}

export function* fetchAstrosign(birthday) {
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

export function* fetchToken(user) {
    yield put(updateUser({can_login: 'in_progress'}));
    let {token} = yield fetch(`/${user.astrosign}/${user.username}`).then(data => data.json());
    yield put(updateUser({prev_username: user.username}))
    yield call(progressCheck, token, user)
}

function* submitData(data) {
    console.log(data);
    let resp = yield fetch(`/${data.astrosign}/${data.username}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(data => data.json());

    yield put(updateUser(resp));
}

function* progressCheck(token, user) {
    let {progress, available} = yield fetch(`/${user.astrosign}/${user.username}?token=${token}`).then(data => data.json());

    if (progress === 100) {
        yield put(updateUser({progress: progress, can_login: available ? 'success' : 'failure'}));
    } else {
        yield put(updateUser({progress: progress}));
        yield delay(1000 * Math.random());
        yield call(progressCheck, token, user)
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

export function* watchCheckUser() {
    yield * takeEvery(CHECK_USER, checkUser);
}
