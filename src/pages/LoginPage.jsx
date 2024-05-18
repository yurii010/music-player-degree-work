import { useState, useEffect } from 'react';
import { useAuthContext } from '../firebase/authProvider';
import { Register } from '../components/Register';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login, profile } = useAuthContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginRunning, setLoginRunning] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const toggleShowRegisterScreen = () => {
        setShowRegisterForm((currVal) => !currVal);
        setEmail('');
        setPassword('');
        setErrorMessage(null);
    };

    const handleButtonClick = async () => {
        setLoginRunning(true);
        let success = await login(email, password);
        setLoginRunning(false);
        if (!success) {
            setErrorMessage("Oops! Something went wrong during registration.");
        };
    };
    useEffect(() => {
        if (profile) {
            navigate('/main');
        }
    }, [profile, navigate]);

    return (
        <div className="">
            {showRegisterForm ? (
                <Register toggleShowRegisterScreen={toggleShowRegisterScreen} />
            ) : (
                <div className="">
                    <h2>Login</h2>
                    <div id="form">
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type='text'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                Don't have an account? Register here.
                            </button>
                        </div>
                        <div className="form-group">
                            <button className="button-in-form" onClick={handleButtonClick}>
                                Login
                            </button>
                            {errorMessage && (
                                <p className="error-message pt-4">{errorMessage}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;