import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Navbar from '@/components/usuario_cliente/Navbar';
import Footer from '@/components/usuario_cliente/Footer';

const UserProfilePage = () => {
  return (
    
    <Box >
        <Navbar />
        <Box sx={{ padding: 4 }}>
      {/* Informações do usuário */}
      <Box sx={{ marginBottom: 4, padding: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4">Nome do Usuário</Typography>
        <Typography variant="body1">Localização do Usuário</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
          Biografia do usuário ou outras informações relevantes podem ser mostradas aqui.
        </Typography>
        <Button variant="outlined" sx={{ marginTop: 2 }}>Editar Perfil</Button>
      </Box>

      {/* Histórico de Agendamentos */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Histórico de Agendamentos</Typography>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {/* Coloque os cards aqui */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
      </Grid>

      {/* Histórico de Mensagens */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Histórico de Mensagens</Typography>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {/* Coloque os cards aqui */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
      </Grid>

      {/* Favoritos */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Favoritos</Typography>
      <Grid container spacing={2}>
        {/* Coloque os cards aqui */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ height: 180, backgroundColor: '#f0f0f0' }}></Box>
        </Grid>
      </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default UserProfilePage;