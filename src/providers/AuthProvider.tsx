'use client';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';

type State = {
  user: User | null; 
};

type Action = { type: string; payload?: any };

const initialState: State = {
  user: null,
};

const AuthContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          user: action.payload,
        };
        default:
          return state;
        }
      }, initialState);
      
      const { LSItem } = useLocalStorage('user');
      const storedUser = LSItem ? JSON.parse(LSItem) : null;

  useEffect(() => {
    if (storedUser) {
      if (state.user?.uid !== storedUser.uid) {
        dispatch({ type: 'SET_USER', payload: storedUser });
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [state.user, router, storedUser]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }
  return context;
};

export { AuthContextProvider, useAuthContext };
