import {Route, Routes} from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout'
import axios from 'axios';
import { UserContextProvider } from './components/UserContext';
import ProfilePage from './pages/ProfilePage';
import PoliciesPage from './pages/PoliciesPage';
import PolicyFormPage from './pages/PolicyFormPage';
import PolicyPage from './pages/PolicyPage';
import CustomerPage from './pages/CustomerPage';
import BookingsPage from './pages/BookingsPage';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return(
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/account' element={<ProfilePage />} />
        <Route path='/account/policies' element={<PoliciesPage />} />
        <Route path='/account/policies/new' element={<PolicyFormPage />} />
        <Route path='/account/policies/:id' element={<PolicyFormPage />} />
        <Route path='/policy/:id' element={<PolicyPage />} />
        <Route path='/account/customers' element={<CustomerPage />} />
        <Route path='/account/customers/:id' element={<BookingsPage />} />
      </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
