"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig'; 
import CadastroUsuarioForm from '@/components/utils/CadastroUsuarioForm';
import CadastroEnderecoForm from '@/components/utils/CadastroEnderecoForm';
import { useSearchParams } from 'next/navigation';

interface UserData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  genero: string;
  tipoUsuario: string; // Cliente ou prestador
  fotoPerfil: File | null;
  enderecoId?: string;
}

interface UserPrestadorData {
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
  complemento?: string; // Torne o complemento opcional
}

const CadastroUsuario: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPrestadorData, setUserPrestadorData] = useState<UserPrestadorData | null>(null);
  const [enderecoData, setEnderecoData] = useState<EnderecoData | null>(null);

  const [step, setStep] = useState(1);

  const searchParams = useSearchParams();
  const tipoUsuario = searchParams.get('tipoUsuario') || '0';

  const handleUsuarioNext = (dadosUsuario: UserData, dadosUsuarioPrestador: UserPrestadorData) => {
    setUserData({ ...dadosUsuario, tipoUsuario });
    if (tipoUsuario === '2') {
      setUserPrestadorData(dadosUsuarioPrestador);
    }
    setStep(2);
  };

  const handleEnderecoNext = async (dadosEndereco: EnderecoData) => {
    setEnderecoData(dadosEndereco);

    try {
      if (!userData) return;

      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.senha);
      const user = userCredential.user;

      const enderecoRef = await addDoc(collection(db, 'enderecos'), {
        ...dadosEndereco,
        dataCriacao: serverTimestamp(),
      });

      const enderecoId = enderecoRef.id;

      await setDoc(doc(db, 'usuarios', user.uid), {
        ...userData,
        enderecoId: enderecoId, // Adiciona o ID do endereço ao `userData`
        dataCriacao: serverTimestamp(),
        userId: user.uid,
      });

      if (userData.tipoUsuario === '2' && userPrestadorData) {
        await setDoc(doc(db, 'prestadores_servico', user.uid), {
          ...userPrestadorData,
          userId: user.uid,
          dataCriacao: serverTimestamp(),
        });
      }

      alert('Usuário e endereço cadastrados com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar o usuário e endereço:', error);
      alert('Ocorreu um erro ao cadastrar o usuário e endereço.');
    }
  };

  return (
    <Box>
      {step === 1 && <CadastroUsuarioForm onNext={handleUsuarioNext} tipoUsuario={tipoUsuario} />}
      {step === 2 && <CadastroEnderecoForm onNext={handleEnderecoNext} />} 
    </Box>
  );
};

export default CadastroUsuario;
