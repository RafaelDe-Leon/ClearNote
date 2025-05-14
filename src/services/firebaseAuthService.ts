import { auth } from '@/main';
import type { Auth, UserCredential, User } from 'firebase/auth';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

class FirebaseAuthService {
  auth: Auth;

  constructor() {
    this.auth = auth;
  }

  /**
   * @Param {String} - email - users email
   * @Param {String} - password - users password
   * @returns if success userCred else null
   */
  async createUser(
    email: string,
    password: string,
  ): Promise<UserCredential | null> {
    try {
      const attempt = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return attempt;
    } catch (error) {
      console.error('error =', error);
      return null;
    }
  }

  /**
   * @definition - signed user in with email and password
   * @Param {String} - email - users email
   * @Param {String} - password - users password
   * @returns if success userCred else null
   */
  async signInUser(
    email: string,
    password: string,
  ): Promise<UserCredential | null> {
    try {
      const attempt = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return attempt;
    } catch (error) {
      console.error('error =', 'happened at', new Date(), 'errorMsg:', error);
      return null;
    }
  }

  signOut() {
    return auth.signOut();
  }

  authChangeSubscriber(
    signedInCallBack: (_user: User) => void,
    signedOutCallback: () => void,
  ) {
    return onAuthStateChanged(this.auth, (user: User | null) => {
      if (!user) return signedOutCallback();
      signedInCallBack(user);
    });
  }
}

export default FirebaseAuthService;
