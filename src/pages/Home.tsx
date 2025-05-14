// UI COmponents
import { Button } from '@/components/ui/button';

import FirebaseAuthService from '@/services/firebaseAuthService';

// import { Link } from 'react-router-dom'

const Home = () => {
  const firebaseAuthService = new FirebaseAuthService();

  const handleCreate = async () => {
    try {
      const create = await firebaseAuthService.createUser(
        'dummy@email.com',
        '123456s*',
      );
      console.log('create =', create);
    } catch (error) {
      console.error('HANDLE ERROR', error);
      return null;
    }
  };

  const handleSignin = async () => {
    try {
      const signIn = await firebaseAuthService.signInUser(
        'dummy@email.com',
        '123456s*',
      );
      console.log('create =', signIn);
    } catch (error) {
      console.error('HANDLE ERROR', error);
      return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">Welcome to the Home Page</h1>
      {/* <Link to='/dashboard'> */}
      <Button className="mt-4" onClick={handleCreate}>
        Create Account
      </Button>
      <Button className="mt-4" onClick={handleSignin}>
        Sign In
      </Button>
      {/* </Link> */}
    </div>
  );
};

export default Home;
