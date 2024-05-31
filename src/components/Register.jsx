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
      theDisplayName = 'NO DISPLAY NAME PROVIDED';
    }
    let success = await register(email, password, theDisplayName);
    if (!success) {
      setErrorMessage("Ой! Щось пішло не так.");
      setRegistrationRunning(false);
    }
  };

  return (
    <div className="bg-[#212121] p-8 text-white rounded-xl">
      <p className="text-2xl mb-4"> Реєстрація</p >
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
          <label className="block mb-2">Введіть ім'я користувача</label>
          <input
            type='text'
            name='displayName'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-2">Введіть пароль</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="form-group mb-4">
          <button className="text-blue-500 hover:underline" onClick={toggleShowRegisterScreen}>
            Вже є профіль? Увійдіть тут.
          </button>
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleButtonClick}
            disabled={registrationRunning}
          >
            {registrationRunning ? 'Зачекайте...' : 'Зареєструватися'}
          </button>
          {errorMessage && (
            <p className="text-red-500 error-message pt-4">{errorMessage}</p>
          )}
        </div>
      </div >
    </div>
  );
};