"use client";

import React, { useState } from 'react';
import { Box, Typography, TextField, Grid, RadioGroup, FormControlLabel, Radio, Button, InputAdornment } from '@mui/material';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SidebarLayout from '@/components/usuario_parceiro/SidebarLayout';

const CadastrarServicoPage: React.FC = () => {
  const router = useRouter();

  // Estado para armazenar os valores dos campos
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [servicoAtivo, setServicoAtivo] = useState('sim');
  const [servicoDisponivel, setServicoDisponivel] = useState('sim');
  const [temVariacoes, setTemVariacoes] = useState('nao');
  const [variacao, setVariacao] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImagem(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (imagem) {
        const imageRef = ref(storage, `servicos/${imagem.name}-${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, imagem);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'servicos'), {
        descricao,
        categoria,
        preco,
        servicoAtivo: servicoAtivo === 'sim',
        servicoDisponivel: servicoDisponivel === 'sim',
        temVariacoes: temVariacoes === 'sim',
        variacao: temVariacoes === 'sim' ? variacao : '',
        imagemUrl: imageUrl,
        dataCriacao: serverTimestamp(),
        prestadorId: localStorage.getItem('userId'),
      });

      router.push('/profile_provider');
    } catch (error) {
      console.error("Erro ao cadastrar serviço: ", error);
    }
  };

  return (
    <SidebarLayout>
      <Box
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mt: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          p: 4,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#3A1F18', mb: 4 }}>
          Cadastrar Serviços
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição do serviço"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                sx={{ borderRadius: 2, backgroundColor: '#fff', mb: 3 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Categoria Principal"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                helperText="Adicionar categoria"
                sx={{ borderRadius: 2, backgroundColor: '#fff', mb: 3 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                sx={{ borderRadius: 2, backgroundColor: '#fff', mb: 3 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>Serviço ativo (visível no perfil)?</Typography>
              <RadioGroup row value={servicoAtivo} onChange={(e) => setServicoAtivo(e.target.value)}>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="nao" control={<Radio />} label="Não" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>Serviço disponível para ser realizado?</Typography>
              <RadioGroup row value={servicoDisponivel} onChange={(e) => setServicoDisponivel(e.target.value)}>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="nao" control={<Radio />} label="Não" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>Serviço com variações?</Typography>
              <RadioGroup row value={temVariacoes} onChange={(e) => setTemVariacoes(e.target.value)}>
                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                <FormControlLabel value="nao" control={<Radio />} label="Não" />
              </RadioGroup>
            </Grid>

            {temVariacoes === 'sim' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Definir variação"
                  value={variacao}
                  onChange={(e) => setVariacao(e.target.value)}
                  sx={{ borderRadius: 2, backgroundColor: '#fff', mb: 3 }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ backgroundColor: '#8A513D', '&:hover': { backgroundColor: '#6D3F2E' }, mb: 2 }}
              >
                Adicionar imagem do serviço
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {imagem && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {imagem.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ backgroundColor: '#8A513D', '&:hover': { backgroundColor: '#6D3F2E' }, mr: 2 }}
              >
                Confirmar
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/profile_provider')}
                sx={{ borderColor: '#8A513D', color: '#8A513D', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </SidebarLayout>
  );
};

export default CadastrarServicoPage;
