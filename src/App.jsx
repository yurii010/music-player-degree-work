import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<LoginPage />}></Route>
      <Route path={'/main'} element={<MainPage />}></Route>
    </Routes>
  )
}

export default App
