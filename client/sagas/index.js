import { watchBirthday, watchUsername, watchPhone, watchUser } from '../reducers/user';
import { watchCheckUser, watchSubmitUser } from '../reducers/form';

export default function* rootSaga() {
  yield [
    watchSubmitUser(),
    watchBirthday(),
    watchUsername(),
    watchPhone(),
    watchUser(),
    watchCheckUser()
  ];
}
