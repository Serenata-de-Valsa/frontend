"use client";

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

interface ServicoCardProps {
    foto: string;
    nomeServico: string;
    localizacao: string;
    nomePrestador: string;
    onClick: () => void;
  }
  
  const ServicoCard: React.FC<ServicoCardProps> = ({ foto, nomeServico, localizacao, nomePrestador, onClick }) => {
    return (
      <Card sx={{ cursor: 'pointer' }} onClick={onClick}>
        <CardMedia component="img" height="140" image={foto} alt={nomeServico} />
        <CardContent>
          <Typography variant="h6">{nomeServico}</Typography>
          <Typography variant="body2" color="textSecondary">{localizacao}</Typography>
          <Typography variant="body2" color="textSecondary">{nomePrestador}</Typography>
        </CardContent>
      </Card>
    );
  };
  
  export default ServicoCard;
  