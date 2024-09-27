"use client";

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
  especialidade: string[];
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
  const [prestadorId, setPrestadorId] = useState<string | null>(null); // Estado para armazenar o ID do prestador
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState<number>(0);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Recuperando o ID do localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('prestadorData'); // Recupera o JSON
    if (storedData) {
      const prestadorData = JSON.parse(storedData); // Converte para objeto
      setPrestadorId(prestadorData.idPrestador); // Define o idPrestador a partir do objeto
    } else {
      setErro('Dados do prestador não encontrados no localStorage.');
      setCarregando(false);
    }
  }, []);

  // Fazendo a busca dos dados no Firestore após recuperar o ID do localStorage
  useEffect(() => {
    const fetchPrestadorData = async () => {
      if (!prestadorId) return;

      try {
        setCarregando(true);

        // Busca os dados do prestador no Firestore usando o ID do localStorage
        const prestadorRef = doc(db, 'prestadores_servico', prestadorId);
        const prestadorDoc = await getDoc(prestadorRef);

        if (!prestadorDoc.exists()) {
          setErro('Prestador não encontrado.');
          return;
        }

        const dataPrestador = prestadorDoc.data() as Prestador;
        setPrestador(dataPrestador);

        // Calcula a média de avaliações, se houver
        if (dataPrestador.avaliacoes && dataPrestador.avaliacoes.length > 0) {
          const totalNotas = dataPrestador.avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
          const media = totalNotas / dataPrestador.avaliacoes.length;
          setMediaAvaliacao(media);
        } else {
          setMediaAvaliacao(0); // Caso não tenha avaliações
        }

        // Busca os serviços relacionados ao prestador
        console.log(`Buscando serviços para o prestador com ID: ${prestadorId}`);
        const servicosQuery = query(collection(db, 'servicos'), where('prestadorId', '==', prestadorId));
        const servicosSnapshot = await getDocs(servicosQuery);

        if (servicosSnapshot.empty) {
          console.log('Nenhum serviço encontrado para este prestador.');
          setErro('Nenhum serviço encontrado para este prestador.');
          return;
        }

        const servicosData: Servico[] = servicosSnapshot.docs.map((doc) => {
          console.log('Serviço encontrado:', doc.data());
          return {
            id: doc.id,
            categoria: doc.data().categoria,      // Acessa o campo categoria
            descricao: doc.data().descricao,      // Acessa o campo descrição
            imagemUrl: doc.data().imagemUrl,      // Acessa a URL da imagem
            preco: doc.data().preco               // Acessa o preço
          };
        });

        setServicos(servicosData); // Atualiza o estado com os serviços encontrados
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

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <Navbar/>
      <Container sx={{ mt: 4 }}>
        {/* Informações do Prestador */}
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#FFF0E5', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Avatar src={prestador.foto} alt={prestador.nome_fantasia} sx={{ width: 150, height: 150 }} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5">{prestador.nome_fantasia}</Typography>
              <Box sx={{ mt: 2 }}>
                 <Button variant="outlined" sx={{ mr: 1, mb: 1 }}>
                    {prestador.especialidade}
                  </Button>
              </Box>
              <Typography variant="body1">{prestador.ramo}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{prestador.endereco}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>{prestador.sobre}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Serviços do Prestador */}
        <Typography variant="h5" gutterBottom>
          Serviços ofertados
        </Typography>
        <Grid container spacing={2}>
          {servicos.length > 0 ? (
            servicos.map((servico) => (
              <Grid item xs={12} sm={6} md={4} key={servico.id}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={servico.imagemUrl || '/images/default-service.png'} alt={servico.categoria} style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {servico.categoria} - R$ {servico.preco}
                  </Typography>
                  <Typography variant="body2">{servico.descricao}</Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>Nenhum serviço disponível para este prestador.</Typography>
          )}
        </Grid>

        {/* Avaliações */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Avaliações
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar src={prestador.foto} alt="Avaliação média" sx={{ width: 50, height: 50, mr: 2 }} />
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
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="body1">{avaliacao.nomeCliente}</Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>{avaliacao.comentario}</Typography>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>Ainda não há avaliações para este prestador.</Typography>
          )}
        </Grid>
      </Container>
      <Footer/>
    </Box>
  );
};

export default PerfilProfissionalPage;
