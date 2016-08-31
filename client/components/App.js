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

    getUserName() {
        return this.props.user.username || 'username';
    }

    updateUser(e) {
        this.props.actions.updateUser({
            [ e.target.name]: e.target.value
        })
    }

    getError(field) {
        return this.props.user.errors[field] || false;
    }

    submit() {
        let {actions, user} = this.props;
        actions.submitUser(user);
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
                    <Input name="username" onChange={::this.changeUsername} placeholder="Username"
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
        const {user} = this.props;
        const state = classnames('State', {
            State_inProgress: user.state === 'in_progress',
            State_success: user.state === 'success',
            State_failure: user.state === 'failure'
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
                                         onChange={::this.changeDate}/>
                        </div>
                    </div>


                    <div className="Row Url">
                        http://r.revolut/<span className="Url-gray">capricorn</span>/<span
                        className="Url-gray">{this.getUserName()}</span>
                    </div>
                    <div className="Row Progress">
                        <div className={state}>
                            {user.state && user.state === 'in_progress' ? user.progress : ''}
                        </div>
                    </div>
                    <div className="Form">
                        {user.state === 'success' ? this.formSuccess() : this.formEntry() }
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
