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
            setErrorMessage("Ой! Щось пішло не так.");
        };
    };

    useEffect(() => {
        if (profile) {
            navigate('/main');
        }
    }, [profile, navigate]);

    return (
        <div className="bg-[#212121] flex flex-row h-screen w-screen">
            <div className='bg-[#292929] rounded-2xl w-full flex items-center justify-center m-3'>
                <div className="flex flex-row m-3">
                    {showRegisterForm ? (
                        <Register toggleShowRegisterScreen={toggleShowRegisterScreen} />
                    ) : (
                        <div className="bg-[#212121] p-8 text-white rounded-xl">
                            <p className="text-2xl mb-4">Логін</p>
                            <div id="form">
                                <div className="form-group mb-4">
                                    <label className="block mb-2">Введіть пошту</label>
                                    <input
                                        type='text'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="block mb-2">Введіть ваш пароль</label>
                                    <input
                                        type='password'
                                        name='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={toggleShowRegisterScreen}
                                    >
                                        Немає профілю? Зареєструйтесь тут.
                                    </button>
                                </div>
                                <div className="form-group">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={handleButtonClick}
                                        disabled={loginRunning}
                                    >
                                        {loginRunning ? 'Зачекайте...' : 'Увійти'}
                                    </button>
                                    {errorMessage && (
                                        <p className="error-message pt-4 text-red-500">{errorMessage}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
