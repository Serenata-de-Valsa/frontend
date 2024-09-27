"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Grid, CardMedia, Button } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Footer from '@/components/usuario_cliente/Footer';
import Navbar from '@/components/usuario_cliente/Navbar';
import { db } from '@/firebase/firebaseConfig'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import ServicoCard from '@/components/usuario_cliente/ServicoCardProps'; // Componente para exibir o card do serviço
import { onAuthStateChanged } from 'firebase/auth'; // Exemplo com Firebase
import { auth } from '@/firebase/firebaseConfig'; // Exemplo com Firebase

interface Servico {
  id: string;
  descricao: string;
  categoria: string;
  preco: string; // Corrigido para string, já que o dado é uma string
  prestadorId: string;
}

interface Prestador {
  nome_fantasia: string;
  especialidade: string;
  userId: string; // Referência ao usuário associado ao prestador
  foto: string;
}

interface Endereco {
  bairro: string;
  cidade: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [servicos, setServicos] = useState<(Servico & Prestador & Endereco)[]>([]);
  const [logado, setLogado] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    // Monitorar o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLogado(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setCarregando(true); // Inicia carregamento

      // Fetch serviços e dados dos prestadores e endereços
      const servicosSnapshot = await getDocs(collection(db, 'servicos'));
      console.log('Serviços Snapshot:', servicosSnapshot.docs);  // Verificação inicial dos documentos

      const servicosData = await Promise.all(
        servicosSnapshot.docs.map(async (docServico) => {
          const dataServico = docServico.data();
          console.log('Dados do Serviço:', dataServico);  // Logando os dados de cada serviço
 
          if (!dataServico.prestadorId) {
            console.error('Serviço sem prestadorId:', docServico.id);
            return null;
          }

          // Usar prestadorId para buscar o prestador
          const prestadorRef = doc(db, 'prestadores_servico', dataServico.prestadorId);
          const prestadorDoc = await getDoc(prestadorRef);
          
          if (!prestadorDoc.exists()) {
            console.error('Prestador não encontrado:', dataServico.prestadorId);
            return null;
          }

          const dataPrestador = prestadorDoc.data() as Prestador;
          console.log('Dados do Prestador:', dataPrestador);  // Verificando dados do prestador

          let bairro = 'Bairro não disponível';
          let cidade = 'Cidade não disponível';
          if (dataPrestador && dataPrestador.userId) {
            const usuarioRef = doc(db, 'usuarios', dataPrestador.userId);
            const usuarioDoc = await getDoc(usuarioRef);
            const enderecoId = usuarioDoc.data()?.enderecoId;

            if (enderecoId) {
              const enderecoRef = doc(db, 'enderecos', enderecoId);
              const enderecoDoc = await getDoc(enderecoRef);
              const dataEndereco = enderecoDoc.data() as Endereco;
              bairro = dataEndereco?.bairro || 'Bairro não disponível';
              cidade = dataEndereco?.cidade || 'Cidade não disponível';
            }
          }

          return {
            id: docServico.id,
            descricao: dataServico.descricao,
            preco: dataServico.preco,
            categoria: dataServico.categoria,
            prestadorId: dataServico.prestadorId,
            nome_fantasia: dataPrestador.nome_fantasia || 'Nome não disponível',
            especialidade: dataPrestador.especialidade || 'Especialidade não disponível',
            foto: dataServico.imagemUrl || '/images/default-avatar.png',  // Usar URL correta da imagem
            bairro,
            cidade,
          };
        })
      );

      const validServicos = servicosData.filter((servico) => servico !== null);
      console.log('Serviços Validados:', validServicos);  // Verifique se os dados estão corretos
      setServicos(validServicos as (Servico & Prestador & Endereco)[]);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setCarregando(false); // Finaliza carregamento
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {/* Carrossel de Destaques */}
        <Box sx={{ mb: 4 }}>
          <Carousel sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image="/images/banners.png"
              alt="Destaque 1"
            />
          </Carousel>
        </Box>

        {/* Serviços */}
        {carregando ? (
          <Typography variant="h6">Carregando serviços...</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: '#000' }}>
              Serviços Disponíveis
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {servicos.map((servico) => (
                <Grid item xs={12} sm={6} md={4} key={servico.id}>
                  <ServicoCard
                    idPrestador={servico.prestadorId}
                    foto={servico.foto}
                    nomeServico={servico.descricao}
                    localizacao={`${servico.bairro}, ${servico.cidade}`}
                    nomePrestador={servico.nome_fantasia}
                    onClick={() => handleNavigation(`/servico?servicoId=${servico.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Trabalhe Conosco */}
        {!logado && (
          <>
            <Typography variant="h5" gutterBottom sx={{ color: '#000' }}>
              Trabalhe Conosco
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="body1" paragraph>
                Junte-se à nossa equipe e faça parte de uma empresa que valoriza os profissionais de beleza. Estamos sempre em busca de talentos para oferecer os melhores serviços aos nossos clientes.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#D5A37E',
                  color: '#FFF',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#8A513D',
                  }}
                }
                onClick={() => handleNavigation('/cadastrar?tipoUsuario=1')}
              >
                Saiba Mais
              </Button>
            </Box>
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;
