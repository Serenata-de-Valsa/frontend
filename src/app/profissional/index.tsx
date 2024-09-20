"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Avatar, Rating } from '@mui/material';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router'; // Hook para capturar a URL
import SidebarLayout from '@/components/usuario_parceiro/SidebarLayout';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  preco: number;
}

interface Avaliacao {
  nome: string;
  data: string;
  comentario: string;
  nota: number;
}

interface UserData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  genero: string;
  tipoUsuario: string; // Cliente ou prestador
  fotoPerfil: string;  // URL da foto de perfil (ou File se necessário)
  enderecoId?: string; // O ID do endereço será opcional, pois será adicionado após o cadastro do endereço
}

interface PrestadorData {
  cnpj: string;
  tipo_negocio: string;
  nome_fantasia: string;
  especialidade: string;
  ramo: string;
  sobre: string;
}

interface EnderecoData {
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}

const PerfilProfissionalPage: React.FC = () => {
  const [profissional, setProfissional] = useState<UserData | null>(null);
  const [prestador, setPrestador] = useState<PrestadorData | null>(null);
  const [endereco, setEndereco] = useState<EnderecoData | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState<number>(0);
  
  // Hook para acessar a rota e capturar o parâmetro
  const router = useRouter();
  const { id_profissional } = router.query;  // Captura o parâmetro id_profissional da URL

  useEffect(() => {
    if (!id_profissional) return; // Verifica se o ID já está disponível

    const fetchProfissionalData = async () => {
      try {
        // Buscar dados do profissional
        const profissionalRef = doc(db, 'usuarios', String(id_profissional));
        const profissionalDoc = await getDoc(profissionalRef);

        if (profissionalDoc.exists()) {
          const profissionalData = profissionalDoc.data() as UserData;
          setProfissional(profissionalData);

          const prestadorRef = doc(db, 'prestadores_servico', String(id_profissional));
          const prestadorDoc = await getDoc(prestadorRef);
          if (prestadorDoc.exists()) {
            const prestadorData = prestadorDoc.data() as PrestadorData;
            setPrestador(prestadorData);
          }

          // Dentro do useEffect que busca os dados do profissional:
          if (profissionalData.enderecoId) {
            const enderecoRef = doc(db, 'enderecos', profissionalData.enderecoId);
            const enderecoDoc = await getDoc(enderecoRef);
            if (enderecoDoc.exists()) {
              const enderecoData = enderecoDoc.data() as EnderecoData;
              setEndereco(enderecoData);
            }
          }

          // Buscar serviços do profissional
          const servicosSnapshot = await getDocs(collection(db, 'servicos'));
          const servicosData = servicosSnapshot.docs.map((doc) => ({
            id: doc.id,
            nome: doc.data().nome,
            descricao: doc.data().descricao,
            foto: doc.data().foto,
            preco: doc.data().preco,
          }));
          setServicos(servicosData);

          // Buscar avaliações do profissional
          const avaliacoesSnapshot = await getDocs(collection(db, 'avaliacoes'));
          const avaliacoesData = avaliacoesSnapshot.docs.map((doc) => ({
            nome: doc.data().nome,
            data: doc.data().data,
            comentario: doc.data().comentario,
            nota: doc.data().nota,
          }));
          setAvaliacoes(avaliacoesData);

          // Calcular a média das avaliações
          const media =
            avaliacoesData.reduce((acc, curr) => acc + curr.nota, 0) /
            avaliacoesData.length;
          setMediaAvaliacao(media);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do profissional:', error);
      }
    };

    fetchProfissionalData();
  }, [id_profissional]);  // Reexecuta o hook quando id_profissional mudar

  return (
    <SidebarLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Container sx={{ mt: 4 }}>
          {/* Perfil do Profissional */}
          {profissional && prestador && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={profissional.fotoPerfil}
                  alt={profissional.nome}
                  sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                  <Typography variant="h4">{profissional.nome}</Typography>
                  <Typography variant="subtitle1">{prestador.especialidade}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {servicos.map((servico, index) => (
                      <Button key={index} variant="contained" sx={buttonStyle}>
                        {servico.nome}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>{prestador.sobre}</Typography>
              <Typography variant="subtitle2">Ramo: {prestador.ramo}</Typography>

              {endereco && (
                <Typography variant="subtitle2">
                  Endereço: {endereco.rua}, {endereco.numero}, {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary">Mensagem</Button>
                <Button variant="outlined" color="primary">Agenda</Button>
              </Box>
            </Box>
          )}

          {/* Serviços Ofertados */}
          <Typography variant="h5" gutterBottom>Serviços ofertados</Typography>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {servicos.map((servico) => (
              <Grid item xs={12} sm={6} md={4} key={servico.id}>
                <Card>
                  <CardMedia component="img" height="140" image={servico.foto} alt={servico.nome} />
                  <CardContent>
                    <Typography variant="h6">{servico.nome}</Typography>
                    <Typography variant="body2" color="textSecondary">{servico.descricao}</Typography>
                    <Typography variant="body2" color="textSecondary">R$ {servico.preco.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Avaliações */}
          <Typography variant="h5" gutterBottom>Avaliações</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={profissional ? profissional.fotoPerfil : ''}
              alt="Profissional"
              sx={{ width: 100, height: 100, mr: 3 }}
            />
            <Box>
              <Typography variant="h6">{mediaAvaliacao.toFixed(1)} Fantástico</Typography>
              <Rating value={mediaAvaliacao} precision={0.1} readOnly />
              <Typography variant="body2" color="textSecondary">{avaliacoes.length} opiniões</Typography>
            </Box>
          </Box>

          {/* Lista de Avaliações */}
          <Grid container spacing={2}>
            {avaliacoes.map((avaliacao, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src="/images/default-avatar.png" alt={avaliacao.nome} sx={{ width: 50, height: 50 }} />
                  <Box>
                    <Typography variant="subtitle1">{avaliacao.nome}</Typography>
                    <Typography variant="body2" color="textSecondary">Enviado {avaliacao.data}</Typography>
                    <Rating value={avaliacao.nota} readOnly precision={0.1} />
                    <Typography variant="body2" paragraph>{avaliacao.comentario}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </SidebarLayout>
  );
};

// Estilo dos botões
const buttonStyle = {
  backgroundColor: '#D5A37E',
  color: '#FFF',
  borderRadius: '20px',
  padding: '5px 15px',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#8A513D',
  },
};

export default PerfilProfissionalPage;
