import React, { useEffect } from 'react';
import { providers, signIn, SessionProvider, getSession } from 'next-auth/client';
import { Button, Grid, Container, Card, CardContent, Typography } from '@material-ui/core';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface GetProvidersResponse {
    [provider: string]: SessionProvider;
}

export default function SignIn({ providers, session }: { providers: GetProvidersResponse, session: Session }) {
    const router = useRouter();

    useEffect(() => {
        if (session) router.push("/auth/welcome");
    });

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
                                        <Button variant="contained" color="primary" size="large" fullWidth onClick={() => signIn(provider.id)}>Bejelentkezés ezzel: {provider.name}</Button>
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

SignIn.getInitialProps = async (context) => {
    return {
        providers: await providers(),
        session: await getSession(context)
    }
}