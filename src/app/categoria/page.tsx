"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import Footer from '@/components/usuario_cliente/Footer';
import Navbar from '@/components/usuario_cliente/Navbar';
import { db, storage } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  foto: string;
  id_prestador: string;
  localizacao: string;
  avaliacao: number;
  numero_avaliacoes: number;
}

const CategoriaPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categoriaNome, setCategoriaNome] = useState<string>('');

  // Pegando o id da categoria a partir dos parâmetros da URL
  useEffect(() => {
    const categoriaId = searchParams.get('categoriaId');
    if (categoriaId) {
      fetchCategoria(categoriaId);
      fetchServicosPorCategoria(categoriaId);
    }
  }, [searchParams]);

  // Função para buscar o nome da categoria baseado no id da categoria
  const fetchCategoria = async (categoriaId: string) => {
    try {
      const categoriaDoc = await getDoc(doc(db, 'categorias', categoriaId));
      if (categoriaDoc.exists()) {
        setCategoriaNome(categoriaDoc.data().nome);
      } else {
        setCategoriaNome('Categoria não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
    }
  };

  // Função para buscar os serviços filtrados pelo id da categoria
  const fetchServicosPorCategoria = async (categoriaId: string) => {
    try {
      const servicosSnapshot = await getDocs(
        query(collection(db, 'servicos'), where('categoriaId', '==', categoriaId))
      );
      const servicosData: Servico[] = await Promise.all(
        servicosSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          
          // Se houver uma imagem, obtenha a URL correta do Storage
          let imageUrl = '';
          if (data.foto) {
            const storageRef = ref(storage, data.foto);
            imageUrl = await getDownloadURL(storageRef);
          }

          return {
            id: doc.id,
            nome: data.nome,
            descricao: data.descricao,
            preco: data.preco,
            foto: imageUrl,
            id_prestador: data.id_prestador,
            localizacao: data.localizacao,
            avaliacao: data.avaliacao,
            numero_avaliacoes: data.numero_avaliacoes,
          };
        })
      );

      setServicos(servicosData);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {/* Título da página com o nome da categoria */}
        <Typography variant="h4" gutterBottom sx={{ color: '#000' }}>
          {categoriaNome}
        </Typography>

        {/* Botões de Ordenação */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#000', mb: 2 }}>
            Ordenar por:
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" sx={buttonStyle}>Distância</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={buttonStyle}>Melhor Avaliado</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={buttonStyle}>Ordem Alfabética</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={buttonStyle}>Serviço</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={buttonStyle}>Preço</Button>
            </Grid>
          </Grid>
        </Box>

        {/* Serviços da Categoria */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {servicos.map((servico) => (
            <Grid item xs={12} sm={6} md={4} key={servico.id}>
              <Card sx={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={servico.foto}
                  alt={servico.nome}
                />
                <CardContent>
                  <Typography variant="h6">{servico.nome}</Typography>
                  <Typography variant="body2" color="textSecondary">{servico.localizacao}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    R$ {servico.preco.toFixed(2)} · {servico.avaliacao} ({servico.numero_avaliacoes})
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

// Estilo dos botões de ordenação
const buttonStyle = {
  backgroundColor: '#D5A37E',
  color: '#FFF',
  borderRadius: '20px',
  padding: '10px 20px',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#8A513D',
  },
};

export default CategoriaPage;
