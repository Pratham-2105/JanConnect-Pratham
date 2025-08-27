import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
// import Elements from './pages/Elements';
// import Generic from './pages/Generic';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/elements" element={<Elements />} />
        <Route path="/generic" element={<Generic />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
