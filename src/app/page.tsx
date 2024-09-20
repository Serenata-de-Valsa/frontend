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

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  categoriaId: string;
  preco: number;
  id_prestador: string;
}

interface Prestador {
  nomePrestador: string;
  especialidade: string;
  userId: string; // Referência ao usuário associado ao prestador
  foto: string;
}

interface Endereco {
  bairro: string;
  cidade: string;
}

interface Categoria {
  id: string;
  nome: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [servicos, setServicos] = useState<(Servico & Prestador & Endereco)[]>([]); // Mistura de dados do serviço, prestador e endereço

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categorias do Firestore
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData: Categoria[] = categoriasSnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCategorias(categoriasData);

        // Fetch serviços e dados dos prestadores e endereços
        const servicosSnapshot = await getDocs(collection(db, 'servicos'));
        const servicosData: (Servico & Prestador & Endereco)[] = await Promise.all(
          servicosSnapshot.docs.map(async (docServico) => {
            const dataServico = docServico.data();

            try {
              // Verifica se o serviço tem um id_prestador válido
              if (!dataServico.id_prestador) {
                console.error("Serviço sem prestador:", docServico.id);
                return null; // Ignora este serviço se não houver prestador
              }

              // Buscar informações do prestador
              const prestadorRef = doc(db, 'prestadores_servico', dataServico.id_prestador);
              const prestadorDoc = await getDoc(prestadorRef);
              if (!prestadorDoc.exists()) {
                console.error("Prestador não encontrado:", dataServico.id_prestador);
                return null; // Ignora este prestador se não for encontrado
              }
              const dataPrestador = prestadorDoc.data() as Prestador;

              // Buscar informações do endereço associado ao prestador
              let bairro = "Bairro não disponível";
              let cidade = "Cidade não disponível";
              if (dataPrestador && dataPrestador.userId) {
                const usuarioRef = doc(db, 'usuarios', dataPrestador.userId);
                const usuarioDoc = await getDoc(usuarioRef);
                const enderecoId = usuarioDoc.data()?.enderecoId;
                
                if (enderecoId) {
                  const enderecoRef = doc(db, 'enderecos', enderecoId);
                  const enderecoDoc = await getDoc(enderecoRef);
                  if (enderecoDoc.exists()) {
                    const dataEndereco = enderecoDoc.data() as Endereco;
                    bairro = dataEndereco.bairro;
                    cidade = dataEndereco.cidade;
                  }
                }
              }

              // Retorna um objeto combinando dados do serviço, prestador e endereço
              return {
                id: docServico.id,
                nome: dataServico.nome,
                descricao: dataServico.descricao,
                categoriaId: dataServico.categoriaId,
                preco: dataServico.preco,
                id_prestador: dataServico.id_prestador,
                nomePrestador: dataPrestador.nomePrestador || "Nome não disponível", // Nome do prestador
                especialidade: dataPrestador.especialidade || "Especialidade não disponível",
                foto: dataPrestador.foto || "/images/default-avatar.png", // Se não houver foto, usa uma padrão
                bairro,
                cidade,
              };
            } catch (innerError) {
              console.error("Erro ao processar serviço:", docServico.id, innerError);
              return null; // Ignora este serviço em caso de erro
            }
          })
        );

        // Filtra serviços válidos (removendo os null)
        const validServicos = servicosData.filter((servico) => servico !== null) as (Servico & Prestador & Endereco)[];
        setServicos(validServicos);
      } catch (error) {
        console.error('Erro ao buscar serviços, prestadores e endereços:', error);
      }
    };

    fetchData();
  }, []);

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
            <CardMedia
              component="img"
              height="300"
              image="/images/banners.png"
              alt="Destaque 2"
            />
            <CardMedia
              component="img"
              height="300"
              image="/images/banners.png"
              alt="Destaque 3"
            />
          </Carousel>
        </Box>

        {/* Categorias */}
        <Typography variant="h5" gutterBottom sx={{ color: '#000' }}>
          Categorias
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {categorias.map((categoria) => (
            <Grid item xs={12} sm={6} md={3} key={categoria.id}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#D5A37E',
                  color: '#FFF',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#8A513D',
                  },
                }}
                onClick={() => handleNavigation(`/categoria?categoriaId=${categoria.id}`)}
              >
                {categoria.nome}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Serviços */}
        <Typography variant="h5" gutterBottom sx={{ color: '#000' }}>
          Serviços Disponíveis
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {servicos.map((servico) => (
            <Grid item xs={12} sm={6} md={4} key={servico.id}>
              <ServicoCard
                foto={servico.foto}
                nomeServico={servico.especialidade} 
                localizacao={`${servico.bairro}, ${servico.cidade}`} 
                nomePrestador={servico.nomePrestador} 
                onClick={() => handleNavigation(`/servicos/${servico.id}`)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Trabalhe Conosco */}
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
              },
            }}
            onClick={() => handleNavigation('/cadastrar?tipoUsuario=1')}
          >
            Saiba Mais
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default HomePage;
