"use client";

import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '@/components/usuario_cliente/Footer'; 
import Navbar from '@/components/usuario_cliente/Navbar';

const AgendarServico: React.FC = () => {
  const router = useRouter();
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [servicoAgendado, setServicoAgendado] = useState<boolean>(false); // Novo estado para o agendamento

  const horariosDisponiveis = ['08:30', '10:00', '11:00', '12:45', '14:00'];

  const handleAgendar = () => {
    if (!diaSelecionado || !horarioSelecionado) {
      alert('Por favor, selecione o dia e o horário.');
      return;
    }

    // Simula o agendamento e exibe a mensagem de sucesso
    setServicoAgendado(true);
  };

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {servicoAgendado ? (
          <Typography variant="h4" sx={{ textAlign: 'center', mt: 8, color: '#8A513D', fontWeight: 'bold' }}>
            O serviço foi agendado com sucesso!
          </Typography>
        ) : (
          <>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#8A513D', mb: 4 }}>
              Corte de Cabelo
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: '#8A513D', fontWeight: 'bold' }}>
              R$ 30,00
            </Typography>

            <Grid container spacing={4}>
              {/* Seção de calendário */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, fontWeight: 'bold', color: '#333' }}>
                  Escolher o dia no calendário
                </Typography>
                <DatePicker
                  selected={diaSelecionado}
                  onChange={(date: Date) => setDiaSelecionado(date)}
                  inline
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                />
              </Grid>

              {/* Seção de horários */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2, fontWeight: 'bold', color: '#333' }}>
                  Horários disponíveis
                </Typography>
                <Grid container spacing={2}>
                  {horariosDisponiveis.map((horario, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={horarioSelecionado === horario ? "contained" : "outlined"}
                        sx={{
                          backgroundColor: horarioSelecionado === horario ? '#8A513D' : '#FFF',
                          color: horarioSelecionado === horario ? '#FFF' : '#8A513D',
                          borderColor: '#8A513D',
                          '&:hover': { backgroundColor: '#8A513D', color: '#FFF' },
                          mb: 2,
                        }}
                        onClick={() => setHorarioSelecionado(horario)}
                      >
                        {horario}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
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
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default AgendarServico;
