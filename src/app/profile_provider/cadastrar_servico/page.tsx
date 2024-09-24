"use client";

import React, { useState } from 'react';
import { Box, Typography, TextField, Grid, RadioGroup, FormControlLabel, Radio, Button, InputAdornment } from '@mui/material';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/firebase/firebaseConfig'; // Certifique-se de que este caminho está correto
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Para salvar no Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Para lidar com o upload de imagens
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

  // Manipuladores de evento
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImagem(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = '';
      
      // Upload da imagem se houver
      if (imagem) {
        const imageRef = ref(storage, `servicos/${imagem.name}-${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, imagem);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Salvar o serviço no Firestore
      const docRef = await addDoc(collection(db, 'servicos'), {
        descricao,
        categoria,
        preco,
        servicoAtivo: servicoAtivo === 'sim',
        servicoDisponivel: servicoDisponivel === 'sim',
        temVariacoes: temVariacoes === 'sim',
        variacao: temVariacoes === 'sim' ? variacao : '',
        imagemUrl: imageUrl, // Salva o link da imagem no Firestore
        dataCriacao: serverTimestamp(),
        prestadorId: localStorage.getItem('userId'), // Associa o serviço ao prestador logado
      });

      console.log("Serviço cadastrado com ID: ", docRef.id);
      // Redirecionar após o cadastro
      router.push('/profile_provider');

    } catch (error) {
      console.error("Erro ao cadastrar serviço: ", error);
    }
  };

  return (
    <SidebarLayout>
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
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
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Serviço ativo (visível no perfil)?</Typography>
            <RadioGroup row value={servicoAtivo} onChange={(e) => setServicoAtivo(e.target.value)}>
              <FormControlLabel value="sim" control={<Radio />} label="Sim" />
              <FormControlLabel value="nao" control={<Radio />} label="Não" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Serviço disponível para ser realizado?</Typography>
            <RadioGroup row value={servicoDisponivel} onChange={(e) => setServicoDisponivel(e.target.value)}>
              <FormControlLabel value="sim" control={<Radio />} label="Sim" />
              <FormControlLabel value="nao" control={<Radio />} label="Não" />
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">Serviço com variações?</Typography>
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
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
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
            <Button variant="contained" color="primary" type="submit" sx={{ mr: 2 }}>
              Confirmar
            </Button>
            <Button variant="outlined" onClick={() => router.push('/profile_provider')}>
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
