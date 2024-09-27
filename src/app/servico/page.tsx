'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importe o useRouter para redirecionar
import { Box, Container, Typography, Grid, Button, Avatar } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import Footer from '@/components/usuario_cliente/Footer';
import Navbar from '@/components/usuario_cliente/Navbar';

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
  const searchParams = useSearchParams();
  const servicoId = searchParams.get('servicoId');
  const router = useRouter(); // Inicialize o useRouter
  const [servico, setServico] = useState<Servico | null>(null);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!servicoId) return;

      try {
        const servicoRef = doc(db, 'servicos', servicoId as string);
        const servicoDoc = await getDoc(servicoRef);

        if (servicoDoc.exists()) {
          const dataServico = servicoDoc.data() as Servico;
          setServico(dataServico);

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

  const handleAgendarServico = () => {
    // Redireciona para a página de agendamento
    router.push('/agendamento'); // Substitua pelo caminho da página de agendamento
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!servico) {
    return <Typography>Serviço não encontrado.</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {/* Informações do Prestador */}
        {prestador && (
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <Avatar src={prestador.foto} alt={prestador.nome_fantasia} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8A513D' }}>{prestador.nome_fantasia}</Typography>
              <Typography variant="body2" sx={{ color: '#555' }}>{prestador.especialidade}</Typography>
            </Box>
          </Box>
        )}

        <Grid container spacing={4}>
          {/* Imagem do serviço */}
          <Grid item xs={12} md={6}>
            <img src={servico.imagemUrl} alt={servico.descricao} style={{ width: '100%', borderRadius: 8 }} />
          </Grid>

          {/* Detalhes do serviço  */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#8A513D' }}>
              {servico.categoria}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: '#555' }}>
              {servico.descricao}
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#8A513D' }}>
              R$ {servico.preco}
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#8A513D',
                color: '#fff',
                '&:hover': { backgroundColor: '#713F33' },
                width: '100%',
                marginBottom: '16px',
              }}
              onClick={handleAgendarServico} // Função que redireciona para a página de agendamento
            >
              Agendar serviço
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: '#8A513D',
                borderColor: '#8A513D',
                '&:hover': { backgroundColor: '#F5F5F5' },
                width: '100%',
                marginBottom: '16px',
              }}
            >
              Enviar mensagem para o profissional
            </Button>
          </Grid>
        </Grid>

        {/* Denunciar serviço */}
        <Box mt={4} sx={{ textAlign: 'center' }}>
          <Button variant="text" sx={{ color: '#d32f2f' }}>
            Denunciar serviço
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default DetalheServico;
