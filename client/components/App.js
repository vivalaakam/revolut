import React, {Component} from 'react';
import MaskedInput from 'react-maskedinput';
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

    render() {
        const {user} = this.props;
        return (
            <div>
                <div className="wrapper">
                    <div className="row">
                        <MaskedInput mask="11.11.1111" name="expiry" placeholder="DD.MM.YYYY"
                                     onChange={::this.changeDate}/>
                    </div>
                    <div className="row">
                        <span>{user.state}</span>
                        <span>
                            {user.state ? user.progress : ''}
                        </span>
                    </div>
                    <div className="row">
                        http://r.revolut/<span>capricorn</span>/<span>{this.getUserName()}</span>
                    </div>
                    <div className="form">
                        <div className="row">
                            <Input name="firstName" onChange={::this.updateUser} placeholder="First Name"
                                   error={this.getError('firstName')}/>
                        </div>
                        <div className="row">
                            <Input name="lastName" onChange={::this.updateUser} placeholder="Last Name"
                                   error={this.getError('lastName')}/>
                        </div>
                        <div className="row">
                            <Input name="username" onChange={::this.changeUsername} placeholder="Username"
                                   error={this.getError('username')}/>
                        </div>
                        <div className="row">
                            <Input name="phone" onChange={::this.changePhone} placeholder="Phone No"
                                   error={this.getError('phone')}/>
                        </div>
                        <div className="row">
                            <button onClick={::this.submit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
