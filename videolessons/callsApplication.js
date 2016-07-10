var agreements = new Object();
agreements.data = {	
	// Server side for password recovery
	passwordRecoveryServer: 'authLogic.php',
	
	// Data will be sended to server with POST method
	passwordRecovery: {
		//It will be valid email address
		'mail': null, //String
		
		//Customers can\'t submit password recovery without it
		'accept': null, //String range 0 or 1
	},
	
	// Server side for registration new user
	registrationNewUserServer: 'authLogic.php',
	
	// Registration data will be sended to server with POST method
	registrationNewUser: {
		//It will be valid email address
		'mail': null, //String
	},	
	
	// Server side for login existed user
	authenticateUserServer: 'authLogic.php',
	
	// Authenticate data will be sended to server with POST method
	authenticateUser: {
		// It will be valid email address
		'mail': null, // String
		
		// It will be valid user password address
		'pass': null, // String
		
		// This field decides it remember user or not
		'alienComp': null, // String range 0 or 1
	},
};

agreements.phrases = {	
	emptyEmail: 'Just type your mail',
	incorrectEmail: 'This email is incorrect',
	emptyPassword: 'You can\'t use empty password',
	resetPassword: 'You must accept pass reset',
};

var formValidator;

var HrefLinks = React.createClass({
	onClickHandle: function(e) {		
		this.props.onClick(e, this.props);
	},
	
	render: function() {
		return (
			<label>
				<a
					className="link-href std-class"
					href="javascript:void(0)"
					data-toggle="tooltip"
					data-placement="left"
					title={this.props.title}
					onClick={this.onClickHandle}
				>
					{this.props.sense}
				</a>
				<span className="fontawesome-arrow-right"></span>
			</label>
		);		
	},
});

var InputPrimariFunctions = {
	getInitialState: function() {
		return {value: this.props.init};
	},
	
	onFocusField: function(e) {
		if(this.state.value === this.getInitialState().value) {
			this.setState({value: ''});
		}
	},
	
	onBlurField: function(e) {
		if(this.state.value === '') {
			this.setState({value: this.getInitialState().value});
		}
	},
	
	onChangeHandler: function(e) {
		this.setState({value: e.target.value});
		this.props.onFieldsChange(e, this.props);
	},
};

var CheckboxLable = React.createClass({
	getInitialState: function() {
		return {checked: this.props.init};
	},
	
	onCheckboxChange: function(e) {
		this.setState({checked: e.target.checked});
		this.props.onCheckboxChange(e, this.props);
	},
	
	render: function() {
		return (
			<label className="std-class checkbox" htmlFor="checkbox1">
				<input
					type="checkbox"
					id="checkbox1"
					data-toggle="checkbox"
					className="custom-checkbox"
					onChange={this.onCheckboxChange}
					checked={this.state.checked}
				/>
				<span className="icons">
					<span className="icon-unchecked"></span>
					<span className="icon-checked"></span>
				</span>
				{this.props.textValue}
			</label>
		);
	},
});

var PasswordAuthInput = React.createClass($.extend(InputPrimariFunctions, {
	getInitialState: function() {
		return {value: this.props.init, passVisibility: 'password'};
	},
	
	seeThePass: function(e) {
		e.preventDefault();
		
		if (this.state.passVisibility === 'password') {
			this.setState({passVisibility: 'text'});
		} else {
			this.setState({passVisibility: 'password'});
		}
	},
	
	render: function() {
		return (
			<label>
				<i className={this.props.icoClass} aria-hidden="true"></i>				
				<input
					type={this.state.passVisibility}
					className={'std-class ' + this.props.eid + '-class'}
					value={this.state.value}
					onChange={this.onChangeHandler}
					onBlur={this.onBlurField}
					onFocus={this.onFocusField}
					name={this.props.eid}
					maxLength={this.props.maxLen}
					required
				/>
				<i
					className="fa fa-eye-slash"
					aria-hidden="true"
					data-toggle="tooltip"
					data-placement="right"
					title="Password visibility"
					onClick={this.seeThePass}
				></i>
			</label>
		);
	},
}));

var StandartAuthInput = React.createClass($.extend(InputPrimariFunctions, {
	render: function() {	
		return (
			<label>
				<i className={this.props.icoClass} aria-hidden="true"></i>				
				<input
					type={this.props.type}
					className={'std-class ' + this.props.eid + '-class'}
					value={this.state.value}
					onChange={this.onChangeHandler}
					onBlur={this.onBlurField}
					onFocus={this.onFocusField}
					name={this.props.eid}
					maxLength={this.props.maxLen}
					required
				/>
			</label>
		);
	},
}));

var AuthButton = React.createClass({	
	getInitialState: function() {
		return {validateStage: 'prevalidate'};
	},
	
	render: function() {
		return (
			<label className="std-class butt-subm">
				<input
					className="btn btn-block btn-lg btn-info"
					type="submit"
					value={this.props.btnName}
					readOnly
				/>
			</label>
		);
	},
});

var ErrorMessage = React.createClass({
	render: function() {
		if (this.props.currentError && this.props.currentError.length > 0) {
			var b = this.props.currentError.map(function(entry, i) {
				return (					
					<h6 className="std-calss err-field" key={i}>{entry}</h6>
				);
			});
		}
		
		if (b) {
			return <section>{b}</section>;
		} else {		
			return null;
		}
	},
});

var AuthForm = React.createClass({	
	getInitialState: function() {		
		this.initialState = {
			value: store.get('explicit') ? store.get('explicit') : 'auth',
			currentError: new Array(),
		};
		
		return this.initialState;
	},
	
	sendCredentialsToServer(params, path) {
		$.ajax({
			url: path,
			dataType: 'json',
			cache: false,
			type: 'POST',
			data: params,
			
			success: function(data) {
				console.log(path, data);
			}.bind(this),
			
			error: function(xhr, status, err) {
				console.error(path, status, err.toString());
			}.bind(this)
		});
	},	
	
	emailVaildFalse: function(theMail) {
		if (!theMail) {
			this.state.currentError.push(agreements.phrases.emptyEmail);
		} else if (!formValidator.form()) {
			this.state.currentError.push(agreements.phrases.incorrectEmail);
		}
	},
	
	passwordVaildFalse: function(password) {
		if (!password) {
			this.state.currentError.push(agreements.phrases.emptyPassword);
		}		
	},
	
	resetVaildFalse: function(accept) {
		if (!accept) {
			this.state.currentError.push(agreements.phrases.resetPassword);
		}		
	},
	
	submitButtonHandle: function(e) {
		e.preventDefault();
		
		var credentials = agreements.data.authenticateUser;		
		credentials.pass = this.state.password;
		credentials.mail = this.state.envelope;
		credentials.alienComp = (this.state.alienComp ? 1 : 0);
		
		this.state.currentError = new Array();	
		
		this.passwordVaildFalse(credentials.pass);
		this.emailVaildFalse(credentials.mail);
		
		this.checkAndSend(credentials, agreements.data.registrationNewUserServer);		
	},
	
	onSubmitRecovery: function(e) {
		e.preventDefault();
		
		var credentials = agreements.data.passwordRecovery;
		credentials.mail = this.state.envelope;
		credentials.accept = (this.state.iAllowRecovery ? 1 : 0);
		
		this.state.currentError = new Array();		
		
		this.emailVaildFalse(credentials.mail);
		this.resetVaildFalse(credentials.accept);
		
		this.checkAndSend(credentials, agreements.data.passwordRecoveryServer);
	},
	
	onSubmitReg: function(e) {
		e.preventDefault();
		
		var credentials = agreements.data.registrationNewUser;
		credentials.mail = this.state.envelope;
		
		this.state.currentError = new Array();	
		
		this.emailVaildFalse(credentials.mail);
			
		this.checkAndSend(credentials, agreements.data.registrationNewUserServer);		
	},
	
	checkAndSend: function(credentials, path) {		
		if (this.state.currentError.length < 1) {			
			this.sendCredentialsToServer(credentials, path);
		}
		
		void reactAuthFormRenderManual();	
	},
	
	onFieldsChange: function(e, props) {
		var state = new Object();
		state[props.eid] = e.target.value;
		
		this.setState(state);
	},
	
	onFocusField: function(e, props) {
		var state = new Object();
		state[props.eid] = '';
		
		if(this.state[props.eid] === this.getInitialState()[props.eid]) {
			this.setState(state);
		}
	},
	
	onBlurField: function(e, props) {
		var state = new Object();
		state[props.eid] =  this.getInitialState[props.eid];
		
		if(this.state[props.eid] === '') {
			this.setState(state);
		}
	},

	onCheckboxChange: function (e, props) {
		var state = new Object();
		state[props.eid] = e.target.checked;
		
		this.setState(state);
	},
	
	onRegistrationClick: function(e, props) {
		this.state.value = props.newState;
		
		store.set('explicit', this.state.value);
		
		this.state = this.getInitialState();
		
		void reactAuthFormRenderManual();
	},
	
	authLinkLook: function() {
		return (
			<HrefLinks
				onClick={this.onRegistrationClick}
				newState='auth'
				title='Sign in, if you have an account'
				sense='Sign in'
			/>
		);
	},
	
	envelopeInputLook: function() {
		return (
			<StandartAuthInput
				type='mail'
				icoClass="fa fa-envelope"
				init='example@company.com'
				eid="envelope"
				onFieldsChange={this.onFieldsChange}
				maxLen='40'
			/>
		);
	},
	
	passwordInputLook: function() {
		return (
			<PasswordAuthInput
				type='password'
				icoClass="fa fa-lock"
				init='Password'
				eid="password"
				onFieldsChange={this.onFieldsChange}
				maxLen='20'
			/>
		);
	},
	
	authStateRender: function() {
		return (
		<div id="login"  className="std-class container-signin">
			<form onSubmit={this.submitButtonHandle} name="AuthPageForm">
				<fieldset className="std-class clearfix">
					{this.envelopeInputLook()}
					{this.passwordInputLook()}
					<CheckboxLable
						init={false}
						textValue='Alien computer'
						onCheckboxChange={this.onCheckboxChange}
						eid='alienComp'
					/>
					<div className="std-class gap-10"></div>
					<div className="std-class gap-10"></div>
					<AuthButton  btnName="Sign in" />
				</fieldset>
			</form>
			<ErrorMessage currentError={this.state.currentError}/>
			<div className="std-class gap-10"></div>
			<HrefLinks
				onClick={this.onRegistrationClick}
				newState='reg'
				title='Do you have account? Why not?'
				sense='Sign up'
			/>
			<HrefLinks
				onClick={this.onRegistrationClick}
				newState='recovery'
				title='Restore or change password'
				sense='I forgot a password'
			/>
		</div>
		);
	},
	
	regStateRender: function() {
		return (
			<div id="login"  className="std-class container-reg">
				<form onSubmit={this.onSubmitReg} name="AuthPageForm">
					<fieldset className="std-class reg-state clearfix">
						{this.envelopeInputLook()}
						<div className="std-class gap-10"></div>
						<div className="std-class gap-10"></div>
						<AuthButton btnName="Sign up" />
					</fieldset>
				</form>
				<ErrorMessage currentError={this.state.currentError}/>
				<div className="std-class gap-10"></div>
				{this.authLinkLook()}
			</div>
		);
	},
	
	passForgotRender: function() {
		return (
			<div id="login"   className="std-class container-reg">
				<form onSubmit={this.onSubmitRecovery} name="AuthPageForm">
					<fieldset className="std-class reg-state clearfix">
						{this.envelopeInputLook()}						
						<CheckboxLable
							init={false}
							textValue='I allow reset my password'
							onCheckboxChange={this.onCheckboxChange}
							eid='iAllowRecovery'
						/>
						<div className="std-class gap-10"></div>
						<AuthButton btnName="Reset my password" />
					</fieldset>
				</form>
				<div className="std-class gap-10"></div>
				<ErrorMessage currentError={this.state.currentError}/>
				<div className="std-class gap-10"></div>
				{this.authLinkLook()}
			</div>
		);
	},
	
	render: function() {
		if (this.state.value === 'auth') {
			return this.authStateRender();
		} else if (this.state.value === 'reg') {
			return this.regStateRender();
		} else if (this.state.value === 'recovery') {
			return this.passForgotRender();
		}
	},
});

function reactAuthFormRenderManual() {
	ReactDOM.render(
		<AuthForm />,
		document.getElementById('calls-application-container'),
		function() {
			$('[data-toggle="tooltip"]').tooltip();
			
			formValidator = $(document.forms.AuthPageForm).validate({
				rules: {
					envelope: {
						required: true,
						email: true
					},
				},
			});
		}
	);
}

void reactAuthFormRenderManual();
