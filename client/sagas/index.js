import {watchBirthday, watchUsername, watchPhone, watchUser, watchSubmitUser, watchCheckUser} from '../reducers/user';

export default function* rootSaga() {
    yield [
        watchSubmitUser(),
        watchBirthday(),
        watchUsername(),
        watchPhone(),
        watchUser(),
        watchCheckUser()
    ]
}
