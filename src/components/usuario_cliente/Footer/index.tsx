"use client";
import React from 'react';
import { Box, Grid, Typography, Link as MuiLink } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box justifyContent="space-between" sx={{ backgroundColor: '#f5f5f5', padding: 4}}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <img src="/images/Logo.png" alt="Logo" style={{ width: 150, marginBottom: 16 }} />
                    <Typography variant="body2" color="textSecondary">
                    Com a Belezure, encontrar o profissional de beleza ideal é fácil e rápido. Agende online e tenha a experiência de beleza perfeita, onde e quando quiser.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Sobre nós</Typography>
                    <MuiLink href="#" variant="body2" color="textSecondary">Trabalhe conosco</MuiLink><br />
                    <MuiLink href="#" variant="body2" color="textSecondary">Fale conosco</MuiLink><br />
                    <MuiLink href="#" variant="body2" color="textSecondary">Cadastre-se</MuiLink><br />
                    <MuiLink href="#" variant="body2" color="textSecondary">Feedbacks</MuiLink>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Políticas</Typography>
                    <MuiLink href="#" variant="body2" color="textSecondary">Políticas de Privacidade</MuiLink><br />
                    <MuiLink href="#" variant="body2" color="textSecondary">Termos e Condições</MuiLink><br />
                    <MuiLink href="#" variant="body2" color="textSecondary">Perguntas Frequentes</MuiLink>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Typography variant="h6">Parceiros</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {/*<img src="/path-to-partner-logo1" alt="Partner 1" style={{ width: 120 }} />
            <img src="/path-to-partner-logo2" alt="Partner 2" style={{ width: 120 }} />
            <img src="/path-to-partner-logo3" alt="Partner 3" style={{ width: 120 }} />*/}
                        <Typography variant="body2" color="textSecondary">
                            Universidade Federal do Ceará
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;