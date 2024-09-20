"use client"
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/usuario_parceiro/SidebarLayout';
import { Box, Typography, Grid, Button, TextField, Paper } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa os estilos padrão do react-calendar
import { format } from 'date-fns';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import EditIcon from '@mui/icons-material/Edit';

const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Carrega os horários disponíveis do Firebase
  useEffect(() => {
    const fetchHorarios = async () => {
      if (selectedDate) {
        const docRef = doc(db, 'agendas', format(selectedDate, 'yyyy-MM-dd'));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHorariosDisponiveis(docSnap.data().horarios || []);
        } else {
          setHorariosDisponiveis([]);
        }
      }
    };
    fetchHorarios();
  }, [selectedDate]);

  // Salva ou atualiza os horários no Firebase
  const salvarHorarios = async () => {
    if (selectedDate) {
      const docRef = doc(db, 'agendas', format(selectedDate, 'yyyy-MM-dd'));
      await setDoc(docRef, { horarios: horariosDisponiveis }, { merge: true });
    }
  };

  // Função para editar um horário
  const handleEditHorario = (index: number) => {
    setEditIndex(index);
    setEditValue(horariosDisponiveis[index]);
  };

  // Função para salvar a edição do horário
  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const newHorarios = [...horariosDisponiveis];
      newHorarios[editIndex] = editValue;
      setHorariosDisponiveis(newHorarios);
      setEditIndex(null);
      salvarHorarios();
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h4" gutterBottom>Agenda</Typography>

        <Grid container spacing={3}>
          {/* Calendário */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Calendar
                onChange={(value) => {
                  // O valor pode ser uma data única, um array de datas ou null
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  }
                }}
                value={selectedDate}
              />
            </Paper>
          </Grid>

          {/* Horários disponíveis */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Horários disponíveis</Typography>
              <Grid container spacing={1}>
                {horariosDisponiveis.map((hora, index) => (
                  <Grid item xs={6} key={index}>
                    {editIndex === index ? (
                      <TextField
                        fullWidth
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                      />
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<EditIcon />}
                        onClick={() => handleEditHorario(index)}
                      >
                        {hora}
                      </Button>
                    )}
                  </Grid>
                ))}
              </Grid>
              <Button variant="contained" sx={{ mt: 2 }} onClick={salvarHorarios}>
                Salvar horários
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </SidebarLayout>
  );
};

export default AgendaPage;
