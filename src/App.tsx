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
import Layout from './components/Layout';

function App() {
  const [isLoggedin, setLoginStatus] = useState(() => {
    return (typeof window !== 'undefined' && sessionStorage.getItem('loggedIn') === 'true') || false
  });

  return (
    <Router>
        <Switch>
          <Route path="/login">
            {isLoggedin? <Redirect to='/patients' /> : <LoginForm onSetLoginStatus={setLoginStatus} />}
          </Route>

          <Layout onSetLoginStatus={setLoginStatus}>
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
