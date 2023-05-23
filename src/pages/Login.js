import { Authenticator } from '@aws-amplify/ui-react'
import { Auth, Hub } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuthState = async () => {
          try {
            const session = await Auth.currentSession();
            const idToken = session.getIdToken().getJwtToken();
            const user = session.getIdToken().payload.email;
            console.log('Authentication token:', idToken);
            console.log('User email:' , user);
            navigate('/chat');
          } catch (error) {
            console.log('Error retrieving authentication token:', error);
          }
        };
        checkAuthState();
        Hub.listen('auth', (data) => {
          const { payload } = data;
          if (payload.event === 'signIn') {
            checkAuthState();
          }
        });

        return () => Hub.remove('auth');
      }, [navigate]);
    return (
    <Authenticator>
        {({signOut}) => (
            <div>
                <h1>Hello, welcome to my ChatApp</h1>
                <h3>You are authenticated</h3>
                <button onClick={signOut}>Sign Out</button>
            </div>
        )}
    </Authenticator>
    );
};
export default Login;
