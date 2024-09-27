"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams para capturar query params
import { Box, Container, Typography, Grid, Button, Avatar } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Firebase config
import Footer from '@/components/usuario_cliente/Footer'; // Import your Footer component
import Navbar from '@/components/usuario_cliente/Navbar'; // Import your Navbar component

interface Servico {
  descricao: string;
  categoria: string;
  preco: string;
  imagemUrl: string;
  prestadorId: string;
}

interface Prestador {
  nome_fantasia: string;
  especialidade: string;
  foto: string;
}

const DetalheServico: React.FC = () => {
  const searchParams = useSearchParams(); // Usado para capturar query params
  const servicoId = searchParams.get('servicoId'); // Captura o ID do serviço via query string
  const [servico, setServico] = useState<Servico | null>(null);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!servicoId) return; // Não faz a busca se não houver ID

      try {
        // Busca os dados do serviço
        const servicoRef = doc(db, 'servicos', servicoId as string);
        const servicoDoc = await getDoc(servicoRef);

        if (servicoDoc.exists()) {
          const dataServico = servicoDoc.data() as Servico;
          setServico(dataServico);

          // Buscar também os dados do prestador
          const prestadorRef = doc(db, 'prestadores_servico', dataServico.prestadorId);
          const prestadorDoc = await getDoc(prestadorRef);

          if (prestadorDoc.exists()) {
            setPrestador(prestadorDoc.data() as Prestador);
          }
        } else {
          console.log('Serviço não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [servicoId]);

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!servico) {
    return <Typography>Serviço não encontrado.</Typography>;
  }

  return (
    <Box>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {/* Informações do Prestador */}
        {prestador && (
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <Avatar src={prestador.foto} alt={prestador.nome_fantasia} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box>
              <Typography variant="h5">{prestador.nome_fantasia}</Typography>
              <Typography variant="body2">{prestador.especialidade}</Typography>
            </Box>
          </Box>
        )}

        <Grid container spacing={2}>
          {/* Imagens do serviço */}
          <Grid item xs={12} md={6}>
            <img src={servico.imagemUrl} alt={servico.descricao} style={{ width: '100%', borderRadius: 8 }} />
          </Grid>

          {/* Detalhes do serviço */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>{servico.descricao}</Typography>
            <Typography variant="body1" gutterBottom>{servico.categoria}</Typography>
            <Typography variant="h5" gutterBottom>R$ {servico.preco}</Typography>
            <Button variant="contained" color="primary">Agendar serviço</Button>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button variant="outlined" color="secondary">Denunciar serviço</Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default DetalheServico;
