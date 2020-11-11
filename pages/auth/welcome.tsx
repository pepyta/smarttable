import { Card, CardContent, Container, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Button, makeStyles, createStyles, CircularProgress } from "@material-ui/core";
import { getSession, Session } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getRole from "../../lib/client/role/get";
import Image from 'next/image';
import updateRole from "../../lib/client/role/set";
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() =>
	createStyles({
		iconContainer: {
			width: 54,
			height: 54,
			marginRight: 12
		},
		icon: {
			borderRadius: "50%"
		},
		verticalCenter: {
			marginTop: "auto",
			marginBottom: "auto"
		},
		fullHeight: {
			minHeight: "100vh"
		}
	}),
);


export default function WelcomeBack({ session }: { session: Session }) {
	const router = useRouter();
	const classes = useStyles();
	const [role, setRole]: ["STUDENT" | "TEACHER", any] = useState("STUDENT");
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	
	async function updateRoleButton() {
		setLoading(true);

		const resp = await updateRole(role);
		enqueueSnackbar(resp.message, { variant: resp.error ? "error" : "success" });

		if(!resp.error){
			router.push("/");
		} else {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (session === null && typeof window !== 'undefined') {
			router.push("/auth/signin")
		} else {
			getRole().then((res) => {
				if (res.data.role !== "NOT_CHOOSEN") router.push("/");
				else setLoaded(true);
			});
		}
	});

	if (!session || !loaded) return (
		<Container>
			<Grid container className={classes.fullHeight} justify="center">
				<Grid className={classes.verticalCenter} style={{ textAlign: "center" }} item xs={12} md={8} lg={6} xl={4}>
					<CircularProgress size={65} style={{ marginLeft: "auto", marginRight: "auto" }} />
				</Grid>
			</Grid>
		</Container>
	);

	return (
		<Container>
			<Grid className={classes.fullHeight} container justify="center">
				<Grid className={classes.verticalCenter} item xs={12} md={8} lg={6} xl={4}>
					<Card>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography component="h2" variant="h5">Üdvözöllek a SmartTableben!</Typography>
								</Grid>
								<Grid item xs={12}>
									<Grid container>
										<Grid item className={classes.iconContainer}>
											<Image className={classes.icon} width={54} height={54} quality={100} src={session.user.image} />
										</Grid>
										<Grid item className={classes.verticalCenter}>
											<Typography noWrap>
												{session.user.name}
											</Typography>
											<Typography noWrap variant="body2">
												{session.user.email}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12}>
									<Typography>
										Hogy tudd használni a Smarttablet először válaszd ki, hogy tanárként vagy diákként szeretnél bejelentkezni!
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<FormControl variant="filled" fullWidth>
										<InputLabel>Szerepkör kiválasztása</InputLabel>
										<Select
											label="Szerepkör kiválasztása"
											value={role}
											onChange={(e) => {
												// @ts-ignore
												setRole(e.target.value)
											}}
										>
											<MenuItem value="STUDENT">Tanuló</MenuItem>
											<MenuItem value="TEACHER">Tanár</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Button variant="contained" disabled={loading} color="primary" fullWidth onClick={updateRoleButton}>Tovább</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

WelcomeBack.getInitialProps = async (context) => {
	const session = await getSession(context);
	if(!session && context.res !== undefined) {
        context.res.writeHead(301, { Location: '/auth/signin' }); 
        context.res.end();
    }

	return {
		session,
	};
}