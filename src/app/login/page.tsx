"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Fazer login no Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar o tipo de usuário no Firestore
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const tipoUsuario = userData?.tipoUsuario; // Certifica-se de que o campo tipoUsuario existe

        // Armazenar as informações do usuário no localStorage
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('tipoUsuario', tipoUsuario);

        // Redirecionar para a página principal ou outra página após o login bem-sucedido
        if(tipoUsuario==="0"){
         router.push('/');
        }
        router.push('/profile_provider');
      } else {
        throw new Error('Usuário não encontrado no banco de dados');
      }
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Senha"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
        Entrar
      </Button>
    </Box>
  );
};

export default LoginPage;
