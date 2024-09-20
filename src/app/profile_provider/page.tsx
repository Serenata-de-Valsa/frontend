"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Divider, Button, Chip } from '@mui/material';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import SidebarLayout from '@/components/usuario_parceiro/SidebarLayout';

// Interface para Endereço
interface EnderecoData {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

// Interface para Usuário
interface UserData {
  nome: string;
  email: string;
  telefone: string;
  genero: string;
  tipoUsuario: string;
  fotoPerfil: string;
  enderecoId: string;
}

// Interface para Prestador de Serviços (Opcional)
interface UserPrestadorData {
  cnpj: string;
  tipo_negocio: string;
  nome_fantasia: string;
  especialidade: string;
  ramo: string;
  sobre: string;
}

const PerfilPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [enderecoData, setEnderecoData] = useState<EnderecoData | null>(null);
  const [prestadorData, setPrestadorData] = useState<UserPrestadorData | null>(null);

  // Função para buscar os dados do usuário
  const fetchUserData = async (userId: string) => {
    try {
      // Buscar dados do usuário
      const userDocRef = doc(db, 'usuarios', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const user = userDocSnap.data() as UserData;
        setUserData(user);
        
        // Buscar os dados de endereço usando enderecoId
        const enderecoDocRef = doc(db, 'enderecos', user.enderecoId);
        const enderecoDocSnap = await getDoc(enderecoDocRef);
        if (enderecoDocSnap.exists()) {
          const endereco = enderecoDocSnap.data() as EnderecoData;
          setEnderecoData(endereco);
        }
        
        // Se o usuário for prestador, buscar dados do prestador
        if (user.tipoUsuario === '2') {
          const prestadorDocRef = doc(db, 'prestadores_servico', userId);
          const prestadorDocSnap = await getDoc(prestadorDocRef);
          if (prestadorDocSnap.exists()) {
            const prestador = prestadorDocSnap.data() as UserPrestadorData;
            setPrestadorData(prestador);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assumindo que o ID do usuário está armazenado no localStorage
    if (userId) {
      fetchUserData(userId); // Busca os dados do usuário
    }
  }, []);

  if (!userData || !enderecoData) {
    return <Typography>Carregando dados...</Typography>;
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        {/* Dados do Usuário */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={userData.fotoPerfil}
            alt={userData.nome}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4">{userData.nome}</Typography>
            <Typography variant="subtitle1">{userData.email}</Typography>
            <Typography variant="subtitle2">Telefone: {userData.telefone}</Typography>
            <Typography variant="subtitle2">Gênero: {userData.genero}</Typography>
          </Box>
        </Box>

        {/* Dados de Endereço */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Endereço:
          </Typography>
          <Typography>
            {`${enderecoData.rua}, ${enderecoData.numero} - ${enderecoData.bairro}, ${enderecoData.cidade} - ${enderecoData.estado}, ${enderecoData.cep}`}
            {enderecoData.complemento && ` (Complemento: ${enderecoData.complemento})`}
          </Typography>
        </Box>

        {/* Se o usuário for prestador, exibir dados adicionais */}
        {userData.tipoUsuario === '2' && prestadorData && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Dados do Prestador de Serviços
              </Typography>
              <Typography variant="subtitle1">CNPJ: {prestadorData.cnpj}</Typography>
              <Typography variant="subtitle1">Tipo de Negócio: {prestadorData.tipo_negocio}</Typography>
              <Typography variant="subtitle1">Nome Fantasia: {prestadorData.nome_fantasia}</Typography>
              <Typography variant="subtitle1">Especialidade: {prestadorData.especialidade}</Typography>
              <Typography variant="subtitle1">Ramo: {prestadorData.ramo}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {prestadorData.sobre}
              </Typography>

              {/* Botões de ação (mensagem/agenda) */}
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary">
                  Mensagem
                </Button>
                <Button variant="outlined" color="primary">
                  Agenda
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default PerfilPage;
