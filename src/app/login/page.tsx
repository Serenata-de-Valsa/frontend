"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import logo from '/public/images/Logo.png'; // Substituir pelo caminho do logo
import Footer from '@/components/usuario_cliente/Footer';

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
        if (tipoUsuario === "0") {
          router.push('/');
        } else {
          router.push('/profile_provider');
        }
      } else {
        throw new Error('Usuário não encontrado no banco de dados');
      }
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Box component="nav" sx={{ padding: 2, backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
        <Grid container justifyContent="center">
          <Link href="/" passHref>
            <Image src={logo} alt="Belezure logo" width={150} height={75} style={{ cursor: 'pointer' }} />
          </Link>
        </Grid>
      </Box>

      {/* Corpo da página */}
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        >
          <Image
            src="/images/background.png" // Substitua pelo caminho da imagem de fundo
            alt="Imagem de beleza"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </Box>

        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: 4,
                borderRadius: 6,
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: 1, color: '#3A1F18' }}>
                Faça seu login
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 4, color: '#3A1F18' }}>
                Seja bem-vindo (a) ao Belezure!
              </Typography>

              <Box component="form">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />

                {error && (
                  <Typography variant="body2" color="error" gutterBottom>
                    {error}
                  </Typography>
                )}

                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Lembrar senha"
                  sx={{ marginBottom: 2, color: '#3A1F18' }}
                />

                <Typography align="right" sx={{ marginBottom: 2, color: '#3A1F18' }}>
                  <Link href="/auth/forgot-password" passHref>
                    Esqueceu a senha?
                  </Link>
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    marginTop: 3,
                    marginBottom: 2,
                    backgroundColor: '#8A513D',
                    '&:hover': { backgroundColor: '#6D3F2E' },
                  }}
                  onClick={handleLogin}
                >
                  Entrar
                </Button>

                <Typography align="left" sx={{ color: '#3A1F18' }}>
                  <Link href="/auth/signup" passHref>
                    Ainda não tenho uma conta, quero ser cliente.
                  </Link>
                </Typography>

                <Typography align="left" sx={{ color: '#3A1F18' }}>
                  <Link href="/auth/signup-work" passHref>
                    Ainda não tenho uma conta, quero trabalhar com o Belezure.
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LoginPage;
