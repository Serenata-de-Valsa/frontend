"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, Modal, List, ListItem, ListItemButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '@/components/usuario_cliente/Footer';
import Navbar from '@/components/usuario_cliente/Navbar';

const AgendarServico: React.FC = () => {
  const router = useRouter();
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const horariosDisponiveis = ['08:30', '10:00', '11:00', '12:45', '14:00'];

  const handleAgendar = () => {
    if (!diaSelecionado || !horarioSelecionado) {
      alert('Por favor, selecione o dia e o horário.');
      return;
    }

    // Exibe o modal de confirmação
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirmarServico = () => {
    alert('Serviço confirmado com sucesso!');
    setModalOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#8A513D', mb: 4 }}>
          Corte de Cabelo
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#8A513D', fontWeight: 'bold' }}>
          R$ 20,00
        </Typography>

        <Grid container spacing={4}>
          {/* Seção de calendário */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Typography textAlign="center" variant="h6" gutterBottom sx={{ mt: 2, mb: 2, fontWeight: 'bold', color: '#333' }}>
              Escolher o dia no calendário
            </Typography>
            <Box
              sx={{
                height: '100%', // Preenche a altura total disponível
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DatePicker
                selected={diaSelecionado}
                onChange={(date: Date) => setDiaSelecionado(date)}
                inline
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR" // Define a localidade para português
                wrapperClassName="calendar-wrapper" // Classe de estilo personalizada
                calendarClassName="full-width-calendar" // Classe CSS personalizada para garantir a largura total
              />
            </Box>
          </Grid>

          {/* Seção de horários como lista */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, fontWeight: 'bold', color: '#333' }}>
              Horários disponíveis
            </Typography>
            <List>
              {horariosDisponiveis.map((horario, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    selected={horarioSelecionado === horario}
                    onClick={() => setHorarioSelecionado(horario)}
                    sx={{
                      textAlign: 'center',
                      backgroundColor: horarioSelecionado === horario ? '#8A513D' : '#FFF',
                      color: horarioSelecionado === horario ? '#FFF' : '#8A513D',
                      borderColor: '#8A513D',
                      mb: 2,
                      '&:hover': { backgroundColor: '#8A513D', color: '#FFF' },
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {horario}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        {/* Botão para agendar */}
        <Box mt={4}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#8A513D',
              color: '#FFF',
              '&:hover': { backgroundColor: '#713F33' },
              width: '100%',
              padding: '12px',
            }}
            onClick={handleAgendar} // Função de agendamento
          >
            Agendar Serviço
          </Button>
        </Box>

        {/* Modal de confirmação */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              borderRadius: '10px',
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#8A513D', mb: 2 }}>
              Seu serviço foi agendado
            </Typography>
            <Typography id="modal-description" sx={{ color: '#333', mb: 4 }}>
              Clique abaixo para confirmar seu agendamento com Virgínia Maria no dia {diaSelecionado?.toLocaleDateString('pt-BR')} às {horarioSelecionado}.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#F87E5C', color: '#FFF', '&:hover': { backgroundColor: '#F87E5C' } }}
                onClick={handleConfirmarServico}
              >
                Confirmar
              </Button>
              <Button
                variant="text"
                sx={{ color: '#8A513D', '&:hover': { backgroundColor: '#f1f1f1' } }}
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
      <Footer />
    </Box>
  );
};

export default AgendarServico;
