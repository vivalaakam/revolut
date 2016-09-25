import React, {Component} from 'react';
import MaskedInput from 'react-maskedinput';
import classnames from 'classnames';
import Input from './Input';
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
                <div className="Row Text">
                    Fill in the registration form
                </div>
                <div className="Row">
                    <Input name="firstName" onChange={::this.updateUser} placeholder="First Name"
                           error={this.getError('firstName')}/>
                </div>
                <div className="Row">
                    <Input name="lastName" onChange={::this.updateUser} placeholder="Last Name"
                           error={this.getError('lastName')}/>
                </div>
                <div className="Row">
                    <Input name="username" onChange={::this.changeUsername} onBlur={::this.checkUser}
                           placeholder="Username"
                           error={this.getError('username')}/>
                </div>
                <div className="Row">
                    <Input name="phone" onChange={::this.changePhone} placeholder="Phone No"
                           error={this.getError('phone')}/>
                </div>
                <div className="Row">
                    <button className="Submit" onClick={::this.submit}>
                        Submit
                    </button>
                </div>
            </div>
        )
    }

    formSuccess() {
        return (
            <div className="Success">
                <h3 className="Success__title">Great!</h3>
                <p className="Success_text">We’ll contact you on delivery
                    details as soon as possible</p>
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
            <div className="Container">
                <div className="Container-wrapper">
                    <div className="Logo">
                        <div className="Row">
                            We have an astro sign
                            present for you!
                        </div>
                    </div>
                    <div className="Row Birth">
                        <div className="Row Text">
                            Input your date of birth
                        </div>
                        <div className="Row">
                            <MaskedInput mask="11.11.1111"
                                         className={classnames('Input', {Error: this.getError('birthday')})}
                                         name="expiry" placeholder="DD.MM.YYYY"
                                         onChange={::this.changeDate}
                                         onBlur={::this.checkUser}/>
                        </div>
                    </div>


                    <div className="Row Url">
                        http://r.revolut/<span className="Url-gray">{this.getAstrosign()}</span>/<span
                        className="Url-gray">{this.getUserName()}</span>
                    </div>
                    <div className="Row Progress">
                        <div className={state}>
                            {form.can_login && form.can_login === 'in_progress' ? form.progress : ''}
                        </div>
                    </div>
                    <div className="Form">
                        {form.state === 'saved' ? this.formSuccess() : this.formEntry() }
                    </div>
                </div>
                <div className="Container-back">
                    <div className="Row">
                        The new fair way to instantly
                        send and spend money
                    </div>
                </div>
            </div>
        )
    }
}
