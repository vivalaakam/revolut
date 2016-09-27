import React, {Component} from 'react';
import classnames from 'classnames';
import Input from '../Input/Input';
import Back from '../Back/Back';
import Progress from '../Progress/Progress';
import Success from '../Success/Success';
import Url from '../Url/Url';
import style from './App.scss';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    changeDate(e) {
        let value = e.target.value;
        this.props.actions.setBirthday(value);
    }

    changeUsername(e) {
        let value = e.target.value;
        this.props.actions.setUsername(value);
    }

    changePhone(e) {
        let value = e.target.value;
        this.props.actions.setPhone(value);
    }

    checkUser() {
        this.props.actions.checkForm();
    }

    getUserName() {
        return this.props.user.username || 'username';
    }

    getAstrosign() {
        return this.props.user.astrosign || 'astrosign';
    }

    updateUser(e) {
        this.props.actions.updateUser({
            [ e.target.name]: e.target.value
        })
    }

    getError(field) {
        return this.props.error[field] || false;
    }

    submit(e) {
        e.preventDefault();
        let {actions} = this.props;
        actions.submitForm();
    }

    formEntry() {
        return (
            <div>
                <div className={classnames(style.Row, style.Text)}>
                    Fill in the registration form
                </div>
                <div className={style.Row}>
                    <Input name="firstName" onChange={::this.updateUser} placeholder="First Name"
                           error={this.getError('firstName')}/>
                </div>
                <div className={style.Row}>
                    <Input name="lastName" onChange={::this.updateUser} placeholder="Last Name"
                           error={this.getError('lastName')}/>
                </div>
                <div className={style.Row}>
                    <Input name="username" onChange={::this.changeUsername} onBlur={::this.checkUser}
                           placeholder="Username"
                           error={this.getError('username')}/>
                </div>
                <div className={style.Row}>
                    <Input name="phone" onChange={::this.changePhone} placeholder="Phone No"
                           error={this.getError('phone')}/>
                </div>
                <div className={style.Row}>
                    <button className={style.Submit} onClick={::this.submit}>
                        Submit
                    </button>
                </div>
            </div>
        )
    }

    render() {
        const {user, form} = this.props;
        const state = classnames('State', {
            State_inProgress: form.can_login === 'in_progress',
            State_success: form.can_login === 'success',
            State_failure: form.can_login === 'failure'
        });

        return (
            <div className={style.Container}>
                <div className={style.ContainerWrapper}>
                    <div className={style.Logo}>
                        <div className={style.Row}>
                            We have an astro sign
                            present for you!
                        </div>
                    </div>
                    <div className={classnames(style.Row, style.Birth)}>
                        <div className={classnames(style.Row, style.Text)}>
                            Input your date of birth
                        </div>
                        <div className={style.Row}>
                            <Input mask="11.11.1111"
                                   error={this.getError('birthday')}
                                   name="expiry"
                                   placeholder="DD.MM.YYYY"
                                   onChange={::this.changeDate}
                                   onBlur={::this.checkUser}/>
                        </div>
                    </div>
                    <div className={style.Row}>
                        <Url user={user}/>
                    </div>
                    <div className={style.Row}>
                        <Progress form={form}/>
                    </div>
                    <div className={style.Form}>
                        {form.state === 'saved' ? <Success /> : this.formEntry() }
                    </div>
                </div>
                <Back/>
            </div>
        )
    }
}
