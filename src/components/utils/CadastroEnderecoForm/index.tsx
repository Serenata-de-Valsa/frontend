import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';

interface EnderecoData {
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;  // Complemento é opcional
}

interface CadastroEnderecoFormProps {
  onNext: (dadosEndereco: EnderecoData) => void;  // Função para passar os dados para o componente pai
}

const CadastroEnderecoForm: React.FC<CadastroEnderecoFormProps> = ({ onNext }) => {
  const [form, setForm] = useState<EnderecoData>({
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',  // Valor padrão para complemento
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Endereço
      </Typography>
      <Typography variant="body1" paragraph>
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
            required  // Indica que é um campo obrigatório
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cidade"
            name="cidade"
            value={form.cidade}
            onChange={handleInputChange}
            required  // Indica que é um campo obrigatório
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estado"
            name="estado"
            value={form.estado}
            onChange={handleInputChange}
            required  // Indica que é um campo obrigatório
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bairro"
            name="bairro"
            value={form.bairro}
            onChange={handleInputChange}
            required  // Indica que é um campo obrigatório
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Rua"
            name="rua"
            value={form.rua}
            onChange={handleInputChange}
            required  // Indica que é um campo obrigatório
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número"
            name="numero"
            value={form.numero}
            onChange={handleInputChange}
            required  // Indica que é um campo obrigatório
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Complemento"
            name="complemento"
            value={form.complemento}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Cadastrar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CadastroEnderecoForm;
