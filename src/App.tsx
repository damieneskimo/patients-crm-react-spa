import Notes from './components/Notes';
import LoginForm from './components/LoginForm';
import PatientsList from './components/PatientsList';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { useState } from 'react';
import { apiClient } from './api';
import Modal from 'react-modal';
import Layout from './components/Layout';

Modal.setAppElement('#root');

function App() {
  const [isLoggedin, setLoginStatus] = useState(() => {
    return (typeof window !== 'undefined' && sessionStorage.getItem('loggedIn') === 'true') || false
  });

  const login = () => {
    setLoginStatus(true);
    sessionStorage.setItem('loggedIn', 'true');
  }

  const logout = () => {
    apiClient.post('/logout').then(response => {
        if (response.status === 204) {
          setLoginStatus(false);
          sessionStorage.setItem('loggedIn', 'false');
        }
      }).catch(error => {
          console.error(error);
      });
  }

  return (
    <Router>
        <Switch>
          <Route path="/login">
            {isLoggedin? <Redirect to='/patients' /> : <LoginForm onLogin={login} />}
          </Route>

          <Layout onLogout={logout}>
            <Route exact path="/">
              {isLoggedin? <Redirect to='/patients' /> : <Redirect to='/login' />}
            </Route>

            <Route exact path="/patients">
              {isLoggedin? <PatientsList /> : <Redirect to='/login' />}
            </Route>

            <Route path="/patients/:patientId/notes">
              {isLoggedin? <Notes /> : <Redirect to='/login' />}
            </Route>
          </Layout>
        </Switch>
    </Router>
  );
}

export default App;
