import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

import { registerUser, loginUser, fetchArranchamento } from './src/services/api';

const handleLogin = async () => {
  const { data, error } = await loginUser('militar@exemplo.com', 'senha123');
  console.log(data, error);
};

const handleBuscarArranchamento = async () => {
  const { data, error } = await fetchArranchamento(1, '2025-08-14');
  console.log(data, error);
};

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://rwnupgdkjwrbcsdnmxns.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bnVwZ2RrandyYmNzZG5teG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDU1NDMsImV4cCI6MjA3MDc4MTU0M30.CXcX2l8oBd_jJkflvjO2oTsauIwIJu8Q5Xhd0NoUK4s'
);
