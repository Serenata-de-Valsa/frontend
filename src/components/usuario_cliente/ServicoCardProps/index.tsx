"use client";

import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ServicoCardProps {
  idPrestador: string;
  foto: string;
  nomeServico: string;
  preco: string;
  localizacao: string;
  nomePrestador: string;
  onClick: () => void;
}

const ServicoCard: React.FC<ServicoCardProps> = ({ idPrestador, foto, nomeServico, preco, localizacao, nomePrestador, onClick }) => {
  const router = useRouter();

  const handleClickPrestador = (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique no nome propague para o card

    // Salvando no localStorage
    const prestadorData = {
      idPrestador,
      nomePrestador,
      foto,
      localizacao,
    };
    localStorage.setItem('prestadorData', JSON.stringify(prestadorData));

    // Redireciona para a página de perfil do prestador
    router.push(`/profissional`);
  };

  return (
    <Card sx={{ cursor: 'pointer' }} onClick={onClick}>
      <CardMedia component="img" height="250" image={foto} alt={nomeServico} />
      <CardContent>
        <Typography variant="h6">{nomeServico} - R$ {preco}</Typography>
        <Typography variant="body2" color="textSecondary">{localizacao}</Typography>
        {/* O nome do prestador é clicável e redireciona para o perfil */}
        <Typography
          variant="body2"
          color="textSecondary"
          onClick={handleClickPrestador}
          sx={{ fontWeight: 'bold', cursor: 'pointer', mt: 1 }}
        >
          {nomePrestador}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ServicoCard;
