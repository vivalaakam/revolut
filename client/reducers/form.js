import {put, call, select} from 'redux-saga/effects';
import {takeEvery, delay} from 'redux-saga';
import {createAction} from 'redux-actions';
import {getUser, getBlank, getValid, updateUser} from './user';

const UPDATE_FORM = 'form/UPDATE_FORM';
const CHECK_FORM = 'form/CHECK_FORM';
const SUBMIT_FORM = 'form/SUBMIT_FORM';

const $$initialState = {
    can_login: null,
    state: 'new',
    progress: 0
};

export default function error(state = $$initialState, action) {
    switch (action.type) {
        case UPDATE_FORM:
            return {...state, ...action.payload};
        default:
            return state
    }
}

const updateForm = createAction(UPDATE_FORM);
const submitForm = createAction(SUBMIT_FORM);
const checkForm = createAction(CHECK_FORM);

export {
    updateForm, submitForm, checkForm
}

export function getForm(state) {
    return state.form
}

function* checkUser() {
    let user = yield select(getUser);
    if (user.birthday && user.username && user.username !== user.prev_username) {
        yield call(fetchToken, user);
    }
}

function* fetchToken(user) {
    yield put(updateForm({can_login: 'in_progress'}));
    let {token} = yield fetch(`/${user.astrosign}/${user.username}`).then(data => data.json());
    yield put(updateUser({prev_username: user.username}))
    yield call(progressCheck, token, user)
}

function* submitData(data) {
    let resp = yield fetch(`/${data.astrosign}/${data.username}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(data => data.json());

    yield put(updateForm(resp));
}

function* progressCheck(token, user) {
    let {progress, available} = yield fetch(`/${user.astrosign}/${user.username}?token=${token}`).then(data => data.json());

    if (progress === 100) {
        yield put(updateForm({progress: progress, can_login: available ? 'success' : 'failure'}));
    } else {
        yield put(updateForm({progress: progress}));
        yield delay(1000 * Math.random());
        yield call(progressCheck, token, user)
    }
}

function* submit() {
    let form = yield select(getForm);
    let state = true;

    let blank = yield call(getBlank);
    state = state && !blank.length;

    let valid = yield call(getValid);
    state = state && !valid.length;

    if (state && form.can_login === 'success') {
        yield call(submitData, form);
    }
}

export function* watchCheckUser() {
    yield * takeEvery(CHECK_FORM, checkUser);
}

export function* watchSubmitUser() {
    yield* takeEvery(SUBMIT_FORM, submit);
}
