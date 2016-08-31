import {watchBirthday, watchUsername, watchPhone, watchUser, watchSubmitUser} from '../reducers/user';

export default function* rootSaga() {
    yield [
        watchSubmitUser(),
        watchBirthday(),
        watchUsername(),
        watchPhone(),
        watchUser()
    ]
}
