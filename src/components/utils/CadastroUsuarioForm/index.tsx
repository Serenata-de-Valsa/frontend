import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface CadastroUsuarioFormProps {
  onNext: (dadosUsuario: UserData, dadosUsuarioPrestador: PrestadorData) => void;  // Função para passar os dados para o componente pai
  tipoUsuario: string; // Adicione tipoUsuario como uma prop
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
  ramo: string; // Campo para ramo de atuação
  sobre: string; // Campo para descrição pessoal
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
    tipoUsuario: tipoUsuario, // Inicializa com tipoUsuario recebido
    fotoPerfil: null, // Inicializa como null
  });

  const [formPrestador, setFormPrestador] = useState<PrestadorData>({
    cnpj: '',
    tipo_negocio: 'MEI', // Valor inicial para o tipo de negócio
    nome_fantasia: '',
    especialidade: '',
    ramo: '',
    sobre: ''
  });

  // Funções de manipulação de entrada

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
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

  const handleInputChangePrestador = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPrestador({ ...formPrestador, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm({ ...form, genero: e.target.value });
  };

  const handleNext = () => {
    if (!isCPFValid(form.cpf)) {
      alert('CPF inválido. Por favor, insira um CPF válido.');
      return;
    }
    // Passa os dados para o componente pai
    onNext(form, formPrestador);
  };

  // Função para validar CPF
  const isCPFValid = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove todos os caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica se tem 11 dígitos e se não são todos iguais

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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro do Usuário
      </Typography>
      <Typography variant="body1" paragraph>
        Preencha as informações básicas para o cadastro.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Gênero</InputLabel>
            <Select
              value={form.genero}
              onChange={handleSelectChange}
              name="genero"
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Feminino">Feminino</MenuItem>
              <MenuItem value="Não Binário">Não Binário</MenuItem>
              <MenuItem value="Outro">Outro</MenuItem>
              <MenuItem value="Prefiro não dizer">Prefiro não dizer</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {tipoUsuario === '1' && (
          <>
            <Typography variant="body1" paragraph>
              Preencha as informações abaixo para concluir seu cadastro como prestador de serviço.
            </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CNPJ"
                name="cnpj"
                value={formPrestador.cnpj}
                onChange={handleInputChangePrestador}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Tipo de Negócio
              </Typography>
              <RadioGroup
                name="tipo_negocio"
                value={formPrestador.tipo_negocio}
                onChange={handleInputChangePrestador}
                row
              >
                <FormControlLabel
                  value="MEI"
                  control={<Radio />}
                  label="MEI (Microempreendedor Individual)"
                />
                <FormControlLabel
                  value="ME"
                  control={<Radio />}
                  label="ME (Microempresa) e outros"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Fantasia"
                name="nome_fantasia"
                value={formPrestador.nome_fantasia}
                onChange={handleInputChangePrestador}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Especialidade"
                name="especialidade"
                value={formPrestador.especialidade}
                onChange={handleInputChangePrestador}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ramo"
                name="ramo"
                value={formPrestador.ramo}
                onChange={handleInputChangePrestador}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sobre"
                name="sobre"
                value={formPrestador.sobre}
                onChange={handleInputChangePrestador}
                required
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Continuar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CadastroUsuarioForm;
