"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/usuario_parceiro/SidebarLayout";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default calendar styles
import { format } from "date-fns";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // For available times

const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [agendamentosDoDia, setAgendamentosDoDia] = useState<any[]>([]); // Adjust as needed

  // Fetch available times from Firebase
  useEffect(() => {
    const fetchHorarios = async () => {
      if (selectedDate) {
        const docRef = doc(db, "agendas", format(selectedDate, "yyyy-MM-dd"));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHorariosDisponiveis(docSnap.data().horarios || []);
          setAgendamentosDoDia(docSnap.data().agendamentos || []); // Get appointments of the day, if available
        } else {
          setHorariosDisponiveis([]);
          setAgendamentosDoDia([]); // Clear if no appointments
        }
      }
    };
    fetchHorarios();
  }, [selectedDate]);

  const salvarHorarios = async () => {
    if (selectedDate) {
      const docRef = doc(db, "agendas", format(selectedDate, "yyyy-MM-dd"));
      await setDoc(
        docRef,
        { horarios: horariosDisponiveis, agendamentos: agendamentosDoDia },
        { merge: true }
      );
    }
  };

  const handleEditHorario = (index: number) => {
    setEditIndex(index);
    setEditValue(horariosDisponiveis[index]);
  };

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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, p: 3 }}>
        {/* Top Section: Calendar and Available Times */}
        <Grid container spacing={3}>
          {/* Calendar on the left */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Selecione a data
              </Typography>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  }
                }}
                value={selectedDate}
              />
            </Paper>
          </Grid>

          {/* Available Times on the right */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#ffffff",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Horários disponíveis
              </Typography>
              <Grid container spacing={2}>
                {horariosDisponiveis.length > 0 ? (
                  horariosDisponiveis.map((hora, index) => (
                    <Grid item xs={6} key={index}>
                      {editIndex === index ? (
                        <TextField
                          fullWidth
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          size="small"
                        />
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          endIcon={<EditIcon />}
                          onClick={() => handleEditHorario(index)}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#f9f9f9",
                            "&:hover": {
                              backgroundColor: "#e0e0e0",
                            },
                          }}
                        >
                          <AccessTimeIcon sx={{ mr: 1 }} />
                          {hora}
                        </Button>
                      )}
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Nenhum horário disponível para esta data
                  </Typography>
                )}
              </Grid>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#333",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#555" },
                }}
                onClick={salvarHorarios}
              >
                Salvar horários
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Middle Section: Occupied Calendar */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "left", mb: 2 }}
        >
          Calendário de Agendamentos
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          }}
        >
          {/* Calendar placeholder for occupied dates */}
          <Typography variant="body1" color="textSecondary">
            Implementação futura: Mostrar as datas e horários ocupados neste
            calendário.
          </Typography>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Section: Appointment History */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "left", mb: 2 }}
        >
          Histórico de Agendamentos
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          }}
        >
          {agendamentosDoDia.length > 0 ? (
            agendamentosDoDia.map((agendamento, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Horário: {agendamento.horario}
                </Typography>
                <Typography variant="body2">Cliente: {agendamento.cliente}</Typography>
                <Typography variant="body2">
                  Serviço: {agendamento.servico}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum histórico de agendamentos disponível.
            </Typography>
          )}
        </Paper>
      </Box>
    </SidebarLayout>
  );
};

export default AgendaPage;
