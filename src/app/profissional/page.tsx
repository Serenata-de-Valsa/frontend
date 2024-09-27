'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Grid, Avatar, Button } from '@mui/material';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Footer from '@/components/usuario_cliente/Footer';
import Navbar from '@/components/usuario_cliente/Navbar';

interface Avaliacao {
  nomeCliente: string;
  comentario: string;
  data: string;
  nota: number;
}

interface Prestador {
  nome_fantasia: string;
  especialidade: string | string[];
  ramo: string;
  endereco: string;
  sobre: string;
  foto: string;
  avaliacoes: Avaliacao[];
}

interface Servico {
  id: string;
  categoria: string;
  descricao: string;
  imagemUrl: string;
  preco: string;
}

const PerfilProfissionalPage: React.FC = () => {
  const router = useRouter();
  const [prestadorId, setPrestadorId] = useState<string | null>(null);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState<number>(0);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('prestadorData');
    if (storedData) {
      const prestadorData = JSON.parse(storedData);
      setPrestadorId(prestadorData.idPrestador);
    } else {
      setErro('Dados do prestador não encontrados no localStorage.');
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const fetchPrestadorData = async () => {
      if (!prestadorId) return;

      try {
        setCarregando(true);

        const prestadorRef = doc(db, 'prestadores_servico', prestadorId);
        const prestadorDoc = await getDoc(prestadorRef);

        if (!prestadorDoc.exists()) {
          setErro('Prestador não encontrado.');
          return;
        }

        const dataPrestador = prestadorDoc.data() as Prestador;
        setPrestador(dataPrestador);

        if (dataPrestador.avaliacoes && dataPrestador.avaliacoes.length > 0) {
          const totalNotas = dataPrestador.avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
          const media = totalNotas / dataPrestador.avaliacoes.length;
          setMediaAvaliacao(media);
        } else {
          setMediaAvaliacao(0);
        }

        const servicosQuery = query(collection(db, 'servicos'), where('prestadorId', '==', prestadorId));
        const servicosSnapshot = await getDocs(servicosQuery);

        if (servicosSnapshot.empty) {
          setErro('Nenhum serviço encontrado para este prestador.');
          return;
        }

        const servicosData: Servico[] = servicosSnapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: doc.data().categoria,
          descricao: doc.data().descricao,
          imagemUrl: doc.data().imagemUrl,
          preco: doc.data().preco,
        }));

        setServicos(servicosData);
      } catch (error) {
        console.error('Erro ao buscar dados do prestador e serviços:', error);
        setErro('Erro ao buscar dados do prestador e serviços.');
      } finally {
        setCarregando(false);
      }
    };

    if (prestadorId) fetchPrestadorData();
  }, [prestadorId]);

  if (carregando) return <Typography>Carregando...</Typography>;
  if (erro) return <Typography>{erro}</Typography>;
  if (!prestador) return <Typography>Prestador não encontrado.</Typography>;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, p: 4, backgroundColor: '#F8F5F3', borderRadius: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Avatar
                src={prestador.foto || '/images/default-avatar.png'}
                alt={prestador.nome_fantasia}
                sx={{ width: 180, height: 180, border: '5px solid #8A513D' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                {prestador.nome_fantasia}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {Array.isArray(prestador.especialidade) ? (
                  prestador.especialidade.map((especialidade, index) => (
                    <Button key={index} variant="outlined" sx={{ borderColor: '#8A513D', color: '#8A513D' }}>
                      {especialidade}
                    </Button>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#777' }}>
                    {prestador.especialidade || "Especialidade não disponível"}
                  </Typography>
                )}
              </Box>

              <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
                {prestador.ramo}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: '#777' }}>
                {prestador.endereco}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color: '#777' }}>
                {prestador.sobre}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Serviços */}
        <Typography variant="h5" gutterBottom sx={{ color: '#3A1F18', fontWeight: 'bold' }}>
          Serviços ofertados
        </Typography>
        <Grid container spacing={4}>
          {servicos.length > 0 ? (
            servicos.map((servico) => (
              <Grid item xs={12} sm={6} md={4} key={servico.id}>
                <Box sx={{ 
                    borderRadius: 4, 
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
                    cursor: 'pointer', 
                  }} 
                  onClick={() => handleNavigation(`/servico?servicoId=${servico.id}`)}>
                  <img
                    src={servico.imagemUrl || '/images/default-service.png'}
                    alt={servico.categoria}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                  <Box sx={{p: 2}}>
                    <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                      {servico.categoria} - R$ {servico.preco}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign:'justify', color: '#555', mt: 2 }}>
                      {servico.descricao}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Nenhum serviço disponível para este prestador.
            </Typography>
          )}
        </Grid>

        {/* Avaliações */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#3A1F18', fontWeight: 'bold' }}>
          Avaliações
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={prestador.foto || '/images/default-avatar.png'} alt="Avaliação média" sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h6">
            {mediaAvaliacao > 0 ? mediaAvaliacao.toFixed(1) : "Sem avaliações ainda"} {mediaAvaliacao > 0 && "Fantástico"}
          </Typography>
          {mediaAvaliacao > 0 && (
            <>
              <Box sx={{ display: 'flex', ml: 2 }}>
                {Array.from({ length: 5 }).map((_, index) =>
                  index < Math.round(mediaAvaliacao) ? <StarIcon key={index} /> : <StarBorderIcon key={index} />
                )}
              </Box>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {prestador.avaliacoes.length} opiniões
              </Typography>
            </>
          )}
        </Box>

        <Grid container spacing={2}>
          {prestador.avaliacoes && prestador.avaliacoes.length > 0 ? (
            prestador.avaliacoes.map((avaliacao, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{avaliacao.nomeCliente}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#777' }}>{avaliacao.comentario}</Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Ainda não há avaliações para este prestador.
            </Typography>
          )}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default PerfilProfissionalPage;
