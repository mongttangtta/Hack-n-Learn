import { Outlet, useLocation } from 'react-router-dom';
import Header from './layout/Header'; // Assuming Header is the main layout header

export default function App() {
  const location = useLocation();
  const isChallengePage = location.pathname.startsWith('/challenge');

  return (
    <>
      {!isChallengePage && <Header />}
      <Outlet />
    </>
  );
}