import { useState } from 'react';
import { useAuthContext } from '../firebase/authProvider';

export const Register = ({ toggleShowRegisterScreen }) => {
  const { register, authErrorMessages } = useAuthContext();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationRunning, setRegistrationRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleButtonClick = async () => {
    setRegistrationRunning(true);

    let theDisplayName = displayName;
    if (theDisplayName?.length <= 0) {
      theDisplayName = 'NO DISPLAY NAME PROVIDED 😟';
    }
    let success = await register(email, password, theDisplayName);
    if (!success) {
      setErrorMessage("Oops! Something went wrong during registration.");
      setRegistrationRunning(false);
    }
  };

  return (
    <div className="container-fluid px-lg-5 login-form d-flex justify-content-center p-4">
      <div className="form-container">
        <h2>Registration</h2>
        <div id="form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type='text'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type='text'
              name='displayName'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button className="switch-to-register" onClick={toggleShowRegisterScreen}>
              Sign In To Existing Account
            </button>
          </div>
          <div className="form-group">
            <button className="button-in-form" onClick={handleButtonClick}>
              Register
            </button>
            {errorMessage && (
              <p className="error-message pt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};