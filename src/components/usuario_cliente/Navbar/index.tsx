"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, InputBase, Button, Box } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';


const Navbar: React.FC = () => {
  const [logado, setLogado] = useState<boolean>(false);
  const router = useRouter();


  const handleNavigation = (path: string) => {
    router.push(path);
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

        {/* Botões Criar e Entrar */}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
