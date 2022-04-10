import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from "./firebase.init";
import Form from 'react-bootstrap/Form'
 import Button from 'react-bootstrap/Button'; 
import { useState } from "react";

const auth = getAuth(app)

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');



  const handleEmailBlur = event => {

    setEmail(event.target.value)
   /*  console.log(event.target.value); */
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value)
    /* console.log(event.target.value) */
  }

  const handleRegisteredChange = event =>{
    /* console.log(event.target.checked); */
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      
      return;
    }
     if(!/(?=.*?[#?!@$^&*-])/.test(password)){
       setError('password should contain at least on special character');
        return;
     }
    setValidated(true);
    setError(' ');

    if(registered){
      console.log(email, password);
      signInWithEmailAndPassword(auth, email, password)
      .then(result =>{
        const user = result.user;
        console.log(user);
      })
      .catch(error =>{
        console.error(error);
        setError(error.message);
      })
    }
    else{
          createUserWithEmailAndPassword(auth, email, password)
        .then(result =>{
          const user = result.user;
          console.log(user);
          setEmail(' ');
          setPassword(' ');
          verifyEmail();
        })
        .catch(error =>{
          console.error(error);
          setError(error.message);
        })
    }

    console.log('form submitted', email, password);
    event.preventDefault();
  }
  // forget password 
  const handlePasswordReset = () =>{
      sendPasswordResetEmail(auth, email)
      .then(() =>{
        console.log('email sent');
      })
      
  }

  // verify email
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log('email Verification sent');
    })
  }


  return (
    <div className="app">
      <div className="registration w-50 mx-auto mt-5">
        <h2 className="text-primary"> please {registered ? 'Login': 'Register' }!!</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>

              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required/>
              
              <Form.Control.Feedback type="invalid">
                 Please provide a valid password.
              </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered?" />
          </Form.Group>

          <p className="text-danger">{error}</p>
          
          <Button onClick={handlePasswordReset} variant="link">Forget password</Button> <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login': 'Register'}
          </Button>
        </Form>
      </div>

    </div>
  );
}

export default App;
