import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Footer from '@/components/usuario_cliente/Footer';
import Link from 'next/link';
import Image from 'next/image';
import logo from '/public/images/Logo.png';

interface CadastroUsuarioFormProps {
  onNext: (dadosUsuario: UserData, dadosUsuarioPrestador: PrestadorData) => void;
  tipoUsuario: string;
}

interface UserData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  genero: string;
  tipoUsuario: string;
  fotoPerfil: File | null;
}

interface PrestadorData {
  cnpj: string;
  tipo_negocio: string;
  nome_fantasia: string;
  especialidade: string;
  ramo: string;
  sobre: string;
}

const CadastroUsuarioForm: React.FC<CadastroUsuarioFormProps> = ({ onNext, tipoUsuario }) => {
  const [form, setForm] = useState<UserData>({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    genero: '',
    tipoUsuario: tipoUsuario,
    fotoPerfil: null,
  });

  const [formPrestador, setFormPrestador] = useState<PrestadorData>({
    cnpj: '',
    tipo_negocio: 'MEI',
    nome_fantasia: '',
    especialidade: '',
    ramo: '',
    sobre: ''
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
    }
    setForm({ ...form, telefone: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, fotoPerfil: e.target.files[0] });
    }
  };

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 9) {
      value = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9, 11)}`;
    }
    setForm({ ...form, cpf: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm({ ...form, genero: e.target.value });
  };

  const handleNext = () => {
    if (!isCPFValid(form.cpf)) {
      alert('CPF inválido. Por favor, insira um CPF válido.');
      return;
    }
    onNext(form, formPrestador);
  };

  const isCPFValid = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
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

      {/* Formulário de Cadastro */}
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, mb: 6, p: 3, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Cadastro de Usuário
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" sx={{ width: '100%', textTransform: 'none', borderColor: '#61392B', color: '#61392B' }}>
              Upload Foto de Perfil
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {form.fotoPerfil && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {form.fotoPerfil.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome Completo"
              name="nome"
              value={form.nome}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CPF"
              name="cpf"
              value={form.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data de Nascimento"
              name="data_nascimento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.data_nascimento}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={form.telefone}
              onChange={handlePhoneChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Gênero</InputLabel>
              <Select
                value={form.genero}
                onChange={handleSelectChange}
                label="Gênero"
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Feminino">Feminino</MenuItem>
                <MenuItem value="Não Binário">Não Binário</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
                <MenuItem value="Prefiro não dizer">Prefiro não dizer</MenuItem>
              </Select>
            </FormControl>
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
              Continuar
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Footer fora do formulário, ocupando toda a largura da tela */}
      <Footer />
    </Box>
  );
};

export default CadastroUsuarioForm;
