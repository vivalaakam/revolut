import moment from 'moment';
import { put, call, select } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { createAction } from 'redux-actions';
import { setError, resetError } from './error';

const SET_BIRTHDAY = 'user/SET_BIRTHDAY';
const SET_USERNAME = 'user/SET_USERNAME';
const SET_PHONE = 'user/SET_PHONE';
const UPDATE_USER = 'user/UPDATE_USER';
const CHECK_USER = 'user/CHECK_USER';

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
      return state;
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
};

const validators = {
  birthday(birthday) {
    return moment(birthday, 'DD.MM.YYYY').isValid() ? false : { birthday: 'Invalid date' };
  },
  username(username) {
    return (/^[a-z0-9._-]+$/gi).test(username) ? false : { username: 'Invalid username' };
  },
  phone(phone) {
    return (/^[0-9]+$/gi).test(phone) ? false : { phone: 'Invalid phone no' };
  }
};

export function getUser(state) {
  return state.user;
}

export function* canCheckUser() {
  const cuser = yield select(getUser);
  return cuser.birthday && cuser.username && cuser.username !== cuser.prev_username;
}

function* fetchAstrosign(birthday) {
  const { astrosign } = yield fetch('/astrosign/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ birthday })
  }).then(data => data.json());
  yield put(updateUser({ astrosign }));
}


function* updateBirthday({ payload }) {
  if (!(/_/g).test(payload)) {
    const error = validators.birthday(payload);
    if (!error) {
      yield put(updateUser({ birthday: payload }));
      yield call(fetchAstrosign, payload);
    } else {
      yield put(setError(error));
    }
  }
}

function* updateUsername({ payload }) {
  if (payload !== '') {
    const error = validators.username(payload);
    if (!error) {
      yield put(updateUser({ username: payload }));
    } else {
      yield put(setError(error));
    }
  } else {
    yield put(updateUser({ username: payload }));
  }
}

function* updatePhone({ payload }) {
  const error = validators.phone(payload);
  if (!error) {
    yield put(updateUser({ phone: payload }));
  } else {
    yield put(setError(error));
  }
}

function* resetErrors({ payload }) {
  yield Object.keys(payload).map(key => put(resetError(key)));
}

export function* getBlank() {
  const cuser = yield select(getUser);
  const blank = yield FIELDS.map((key) => {
    if (!cuser[key]) {
      return put(setError({ [key]: 'Cannot be blank' }));
    }
    return false;
  })
    .filter(val => val);

  return blank;
}

export function* getValid() {
  const cuser = yield select(getUser);
  const valid = yield Object.keys(validators).map((field) => {
    const error = validators[field](cuser[field]);
    return error && put(setError(error));
  }).filter(val => val);

  return valid;
}

export function* watchUser() {
  yield* takeEvery(UPDATE_USER, resetErrors);
}

export function* watchBirthday() {
  yield* takeEvery(SET_BIRTHDAY, updateBirthday);
}

export function* watchUsername() {
  yield* takeEvery(SET_USERNAME, updateUsername);
}

export function* watchPhone() {
  yield* takeEvery(SET_PHONE, updatePhone);
}
