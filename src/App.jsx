import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
// import Elements from './pages/Elements';
// import Generic from './pages/Generic';
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/elements" element={<Elements />} />
        <Route path="/generic" element={<Generic />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
