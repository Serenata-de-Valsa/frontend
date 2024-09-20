'use client';
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation'; // Importa usePathname
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); // Obtém a rota atual
  
  // Informações do usuário
  const fotoPerfilUrl = 'URL_DA_FOTO_DE_PERFIL'; // Atualize para a URL da foto do usuário
  const nomeUsuario = 'Virgínia Maria';
  const profissaoUsuario = 'Cabeleireira';

  const menuItems = [
    { text: 'Perfil', icon: <PersonIcon />, path: '/profile_provider' },
    { text: 'Cadastrar Serviços', icon: <AddCircleIcon />, path: '/profile_provider/cadastrar_servico' },
    { text: 'Verificar Serviços', icon: <CheckCircleIcon />, path: '/verificar-servico' },
    { text: 'Avaliações', icon: <StarIcon />, path: '/avaliacoes' },
    { text: 'Outras Métricas', icon: <BarChartIcon />, path: '/metricas' },
    { text: 'Agenda', icon: <CalendarTodayIcon />, path: '/profile_provider/agenda' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
  ];
  

  const bottomItems = [
    { text: 'Ajuda', icon: <HelpIcon />, path: '/ajuda' },
    { text: 'Sair', icon: <ExitToAppIcon />, path: '/sair' },
  ];

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: 240, 
            boxSizing: 'border-box',
            backgroundColor: '#FF7F50', // Cor de fundo personalizada
            color: '#FFF', // Cor do texto na sidebar
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Organiza os itens na vertical
          },
        }}
      >
        <Box>
          <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#FF6347', color: '#FFF' }}>
            <Avatar
              src={fotoPerfilUrl}
              alt={nomeUsuario}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
            />
            <Typography variant="h6">{nomeUsuario}</Typography>
            <Typography variant="body2">{profissaoUsuario}</Typography>
          </Box>
          <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton 
                  onClick={() => router.push(item.path)}
                  selected={(pathname ?? '') === item.path} // Garante que pathname seja uma string
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#FF4500',
                      color: '#FFF',
                      '& .MuiListItemIcon-root': {
                        color: '#FFF',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#FFF' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box>
          <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <List>
            {bottomItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton 
                  onClick={() => router.push(item.path)}
                  selected={(pathname ?? '') === item.path} // Garante que pathname seja uma string
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#FF4500',
                      color: '#FFF',
                      '& .MuiListItemIcon-root': {
                        color: '#FFF',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#FFF' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#FFF5F0', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
