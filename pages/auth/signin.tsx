import React from 'react';
import { providers, signIn, SessionProvider } from 'next-auth/client';
import { Button, Grid, Container, Card, CardContent, Typography } from '@material-ui/core';

interface GetProvidersResponse {
    [provider: string]: SessionProvider;
}

export default function SignIn({ providers }: { providers: GetProvidersResponse }) {
  return (
      <Container>  
        <Grid container justify="center">
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Bejelentkezés
                                </Typography>
                            </Grid>
                                            
                            {Object.values(providers).map(provider => (
                                <Grid item xs={12} key={provider.name}>
                                    <Button variant="contained" color="primary" onClick={() => signIn(provider.id)}>Bejelentkezés ezzel: {provider.name}</Button>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
      </Container>
  );
}

SignIn.getInitialProps = async () => {
  return {
    providers: await providers()
  }
}