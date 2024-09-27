import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import Footer from '@/components/usuario_cliente/Footer'; // Mesma estrutura de Footer usada antes
import Link from 'next/link';
import Image from 'next/image';
import logo from '/public/images/Logo.png'; // Caminho do logo

interface EnderecoData {
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string; // Complemento é opcional
}

interface CadastroEnderecoFormProps {
  onNext: (dadosEndereco: EnderecoData) => void; // Função para passar os dados para o componente pai
}

const CadastroEnderecoForm: React.FC<CadastroEnderecoFormProps> = ({ onNext }) => {
  const [form, setForm] = useState<EnderecoData>({
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '', // Valor padrão para complemento
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const { cep, cidade, estado, bairro, rua, numero } = form;

    // Verificação simples para garantir que os campos obrigatórios estejam preenchidos
    if (!cep || !cidade || !estado || !bairro || !rua || !numero) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Passa os dados para o componente pai
    onNext(form);
  };

  return (
    <Box sx={{ backgroundColor: '#8A6D63', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Navbar */}
      <Box component="nav" sx={{ padding: 2, backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
        <Grid container justifyContent="center">
          <Link href="/" passHref>
            <Image src={logo} alt="Belezure logo" width={150} height={50} style={{ cursor: 'pointer' }} />
          </Link>
        </Grid>
      </Box>

      {/* Formulário de Cadastro de Endereço */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, mb: 6, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Cadastro de Endereço
        </Typography>
        <Typography variant="body1" paragraph align="center" sx={{ color: '#333' }}>
          Preencha as informações do endereço.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="CEP"
              name="cep"
              value={form.cep}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cidade"
              name="cidade"
              value={form.cidade}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bairro"
              name="bairro"
              value={form.bairro}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Rua"
              name="rua"
              value={form.rua}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número"
              name="numero"
              value={form.numero}
              onChange={handleInputChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Complemento"
              name="complemento"
              value={form.complemento}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#61392B',
                '&:hover': { backgroundColor: '#502D23' }
              }}
              onClick={handleNext}
            >
              Cadastrar
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Footer fora do formulário, ocupando toda a largura da tela */}
      <Footer />
    </Box>
  );
};

export default CadastroEnderecoForm;
