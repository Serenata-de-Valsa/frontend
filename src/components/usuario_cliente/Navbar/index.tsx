"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, InputBase, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Exemplo com Firebase
import { auth } from '@/firebase/firebaseConfig'; // Exemplo com Firebase

const Navbar: React.FC = () => {
  const [logado, setLogado] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Monitorar o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogado(true);  // Se estiver logado, define o estado como verdadeiro
      } else {
        setLogado(false); // Se não estiver logado, define o estado como falso
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);  // Faz o logout
    setLogado(false);
    handleCloseMenu();
    router.push('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#FFF0E5', color: '#333' }}>
      <Toolbar>
        {/* Logo */}
        <IconButton edge="start" color="inherit" aria-label="logo" onClick={() => handleNavigation('/')}>
          <img src="/images/Logo.png" alt="Logo" style={{ width: 150 }} />
        </IconButton>

        {/* Geolocalização */}
        <IconButton color="inherit" aria-label="geolocation">
          <LocationOn />
        </IconButton>

        {/* Área de Pesquisa */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', width: '60%' }}>
            <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
            <InputBase
              placeholder="O que você quer pesquisar?"
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                width: '100%',
                pl: 5,
                pr: 2,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Box>
        </Box>

        {/* Exibe botões de login se o usuário não estiver logado */}
        {!logado ? (
          <>
            <Button 
              onClick={() => handleNavigation('/cadastrar/')}
              variant="contained"
              color="primary"
              sx={{ bgcolor: '#FFB4A2', '&:hover': { backgroundColor: '#6D3F2E' }, color: '#FFF', marginRight: 2 }}
            >
              Criar conta
            </Button>
            <Button 
              onClick={() => handleNavigation('/login/')}
              variant="outlined"
              color="primary"
              sx={{ borderColor: '#FFB4A2', '&:hover': { backgroundColor: '#6D3F2E' }, color: '#FFB4A2' }}
            >
              Entrar
            </Button>
          </>
        ) : (
          /* Menu de perfil quando o usuário estiver logado */
          <>
            <IconButton onClick={handleMenuClick}>
              <Avatar alt="User Avatar" src="/images/default-avatar.png" /> {/* Aqui você pode colocar a foto do usuário */}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => handleNavigation('/perfil')}>Minha Conta</MenuItem>
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
