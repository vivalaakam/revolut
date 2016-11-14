import { put, call, select } from 'redux-saga/effects';
import { takeEvery, delay } from 'redux-saga';
import { createAction } from 'redux-actions';
import { getUser, canCheckUser, getBlank, getValid, updateUser } from './user';

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
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const updateForm = createAction(UPDATE_FORM);
const submitForm = createAction(SUBMIT_FORM);
const checkForm = createAction(CHECK_FORM);

export {
  updateForm, submitForm, checkForm
};

export function getForm(state) {
  return state.form;
}

function* progressCheck(token, user) {
  const { progress, available } = yield fetch(`/${user.astrosign}/${user.username}?token=${token}`)
    .then(data => data.json());

  if (progress === 100) {
    yield put(updateForm({ progress, can_login: available ? 'success' : 'failure' }));
  } else {
    yield put(updateForm({ progress }));
    yield delay(1000 * Math.random());
    yield call(progressCheck, token, user);
  }
}

function* fetchToken() {
  const user = yield select(getUser);
  yield put(updateForm({ can_login: 'in_progress' }));
  const { token } = yield fetch(`/${user.astrosign}/${user.username}`).then(data => data.json());
  yield put(updateUser({ prev_username: user.username }));
  yield call(progressCheck, token, user);
}

function* checkUser() {
  const user = yield call(canCheckUser);
  if (user) {
    yield call(fetchToken);
  }
}

function* submitData(data) {
  const resp = yield fetch(`/${data.astrosign}/${data.username}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(json => json.json());

  yield put(updateForm(resp));
}

function* submit() {
  const form = yield select(getForm);
  const blank = yield call(getBlank);
  const valid = yield call(getValid);
  const state = !valid.length && !blank.length;

  if (state && form.can_login === 'success') {
    yield call(submitData, form);
  }
}

export function* watchCheckUser() {
  yield* takeEvery(CHECK_FORM, checkUser);
}

export function* watchSubmitUser() {
  yield* takeEvery(SUBMIT_FORM, submit);
}
