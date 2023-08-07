import Landing from "./Pages/Landing"
import Register from "./Pages/Register";
import Error from "./Pages/Error";
import PageNotFound from "./Pages/PageNotFound";
import Search from "./Pages/Protected_Routes/Search";
import MobileNavbar from "./Global_Components/UserNavbar";
function App() {

  return (
    <>
      {/* <Landing /> */}
      {/* <Register /> */}
      {/* <Error /> */}
      {/* <PageNotFound /> */}
      <Search />
      {/* <MobileNavbar /> */}
    </>
  );
}

export default App;
