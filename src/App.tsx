import { Outlet, useLocation } from "react-router-dom";
import NavBar from "@components/NavBar";

function App() {
  const location = useLocation();
  
  // No mostrar NavBar en páginas de autenticación
  const isAuthPage = location.pathname.startsWith('/auth');

  return (
    <>
      {!isAuthPage && <NavBar />}
      <Outlet />
    </>
  )
}

export default App;
