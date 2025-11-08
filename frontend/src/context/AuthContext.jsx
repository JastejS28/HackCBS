import { createContext, useContext, useState, useEffect } from 'react';
import { 
    signInWithPopup, 
    signOut as firebaseSignOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [idToken, setIdToken] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                setUser(firebaseUser);
                setIdToken(token);
                // Store token in localStorage for API calls
                localStorage.setItem('token', token);
            } else {
                setUser(null);
                setIdToken(null);
                localStorage.removeItem('token');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            setIdToken(token);
            localStorage.setItem('token', token);
            
            // Sync user to MongoDB
            try {
                await axios.post(`${API_URL}/auth/sync`, {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    providerData: result.user.providerData
                });
            } catch (syncError) {
                console.error('User sync error:', syncError);
            }
            
            return result.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setIdToken(null);
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    const value = {
        user,
        idToken,
        loading,
        signInWithGoogle,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
