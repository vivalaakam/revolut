import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Input from '../Input';
import Back from '../Back';
import Progress from '../Progress';
import Success from '../Success';
import Url from '../Url/index';
import style from './App.scss';

export default class App extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired
  };

  getError(field) {
    return this.props.error[field] || false;
  }

  getUserName() {
    return this.props.user.username || 'username';
  }

  getAstrosign() {
    return this.props.user.astrosign || 'astrosign';
  }

  changeDate(e) {
    const value = e.target.value;
    this.props.actions.setBirthday(value);
  }

  changeUsername(e) {
    const value = e.target.value;
    this.props.actions.setUsername(value);
  }

  changePhone(e) {
    const value = e.target.value;
    this.props.actions.setPhone(value);
  }

  checkUser() {
    this.props.actions.checkForm();
  }


  updateUser(e) {
    this.props.actions.updateUser({
      [e.target.name]: e.target.value
    });
  }

  submit(e) {
    e.preventDefault();
    const { actions } = this.props;
    actions.submitForm();
  }

  formEntry() {
    return (
      <div>
        <div className={classnames(style.Row, style.Text)}>
          Fill in the registration form
        </div>
        <div className={style.Row}>
          <Input
            name="firstName"
            onChange={::this.updateUser}
            placeholder="First Name"
            error={this.getError('firstName')}
          />
        </div>
        <div className={style.Row}>
          <Input
            name="lastName"
            onChange={::this.updateUser}
            placeholder="Last Name"
            error={this.getError('lastName')}
          />
        </div>
        <div className={style.Row}>
          <Input
            name="username"
            onChange={::this.changeUsername}
            onBlur={::this.checkUser}
            placeholder="Username"
            error={this.getError('username')}
          />
        </div>
        <div className={style.Row}>
          <Input
            name="phone"
            onChange={::this.changePhone}
            placeholder="Phone No"
            error={this.getError('phone')}
          />
        </div>
        <div className={style.Row}>
          <button className={style.Submit} onClick={::this.submit}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { user, form } = this.props;
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
              <Input
                mask="11.11.1111"
                error={this.getError('birthday')}
                name="expiry"
                placeholder="DD.MM.YYYY"
                onChange={::this.changeDate}
                onBlur={::this.checkUser}
              />
            </div>
          </div>
          <div className={style.Row}>
            <Url user={user} />
          </div>
          <div className={style.Row}>
            <Progress form={form} />
          </div>
          <div className={style.Form}>
            {form.state === 'saved' ? <Success /> : this.formEntry() }
          </div>
        </div>
        <Back />
      </div>
    );
  }
}
