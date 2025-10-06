import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import CustomerList from './pages/CustomerList';
import SelectedCustomers from './pages/SelectedCustomers';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/selected" element={<SelectedCustomers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
