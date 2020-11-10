import React, { useEffect } from 'react';
import { providers, signIn, SessionProvider, getSession } from 'next-auth/client';
import { Button, Grid, Container, Card, CardContent, Typography, createStyles, makeStyles, Icon, NoSsr } from '@material-ui/core';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import GoogleIcon from '../../components/icons/GoogleIcon';
import { Router } from '@material-ui/icons';

interface GetProvidersResponse {
    [provider: string]: SessionProvider;
}

const useStyles = makeStyles(() =>
	createStyles({
		verticalCenter: {
			marginTop: "auto",
			marginBottom: "auto"
		},
		fullHeight: {
			minHeight: "100vh"
        },
        google: {
            backgroundColor: "#fff"
        }
	}),
);

export default function SignIn({ providers, session }: { providers: GetProvidersResponse, session: Session }) {
    const router = useRouter();
    const classes = useStyles();

    return (
        <NoSsr>    
            <Container>
                <Grid className={classes.fullHeight} container justify="center">
                    <Grid className={classes.verticalCenter} item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" component="h2">
                                            Bejelentkezés
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            A bejelentkezéseddel beleegyezel, hogy megosztod velünk a teljes nevedet, email címedet és a profilképedet.
                                        </Typography>
                                    </Grid>

                                    {Object.values(providers).map(provider => {
                                        if(provider.name === "Google"){
                                            return (
                                                <Grid item xs={12} key={provider.name}>
                                                    <Button className={classes.google} startIcon={<GoogleIcon />} variant="contained" size="large" fullWidth onClick={() => signIn(provider.id)}>Bejelentkezés ezzel: {provider.name}</Button>
                                                </Grid>
                                            );
                                        } else {
                                            return (
                                                <Grid item xs={12} key={provider.name}>
                                                    <Button variant="contained" color="primary" size="large" fullWidth onClick={() => signIn(provider.id)}>Bejelentkezés ezzel: {provider.name}</Button>
                                                </Grid>
                                            );
                                        }
                                    })}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </NoSsr>
    );
}

SignIn.getInitialProps = async (context) => {
    const session = await getSession(context);
    if(session) {
        context.res.writeHead(301, { Location: '/auth/welcome' }); 
        context.res.end();
    }

    return {
        providers: await providers(),
        session
    }
}