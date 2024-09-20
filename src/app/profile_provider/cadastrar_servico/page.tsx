"use client";

import React, { useEffect, useState } from 'react';
import SidebarLayout from '@/components/usuario_parceiro/SidebarLayout';
import { Box, Typography, Chip, Avatar, Divider } from '@mui/material';
import { db } from '@/firebase/firebaseConfig'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';

interface PrestadorData {
  nome: string;
  especialidades: string[];
  fotoPerfil: string;
  ramo: string;
  endereco: string;
  sobre: string;
}

const PerfilPrestadorPage: React.FC = () => {
  const [prestadorData, setPrestadorData] = useState<PrestadorData | null>(null);

  // Função para buscar os dados do prestador no Firestore
  const fetchPrestadorData = async (userId: string) => {
    try {
      const docRef = doc(db, 'prestadores_servico', userId); // Substitua por seu caminho no Firestore
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPrestadorData(docSnap.data() as PrestadorData);
      } else {
        console.error('Documento não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do prestador:', error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Obtém o ID do usuário logado
    if (userId) {
      fetchPrestadorData(userId); // Chama a função para buscar os dados do prestador
    }
  }, []);

  if (!prestadorData) {
    return <Typography>Carregando dados...</Typography>;
  }

  return (
    <SidebarLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" gutterBottom>
          Perfil
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            backgroundColor: '#ffe9e6',
            padding: '24px',
            borderRadius: '8px',
          }}
        >
          {/* Foto do perfil */}
          <Avatar
            src={prestadorData.fotoPerfil}
            alt={prestadorData.nome}
            sx={{ width: 120, height: 120 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {/* Nome do prestador */}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {prestadorData.nome}
            </Typography>
            {/* Especialidades com chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {prestadorData.especialidades.map((especialidade, index) => (
                <Chip
                  key={index}
                  label={especialidade}
                  sx={{
                    backgroundColor: '#D5A37E',
                    color: '#FFF',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Ramo: {prestadorData.ramo}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Endereço: {prestadorData.endereco}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {prestadorData.sobre}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Certificações e cursos
          </Typography>
          {/* Seção para certificações e cursos, você pode preencher essa área conforme necessário */}
        </Box>
      </Box>
    </SidebarLayout>
  );
};

export default PerfilPrestadorPage;
