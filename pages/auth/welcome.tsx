import { Card, CardContent, Container, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@material-ui/core";
import { getSession, Session } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WelcomeBack({ session }: { session: Session }) {
	const router = useRouter();
	const [role, setRole] = useState("student"); 

	useEffect(() => {
		if (session === null && typeof window !== 'undefined') router.push("/auth/signin");
	});

	if (session === null) return (<div />);

	return (
		<Container>
			<Grid container justify="center">
				<Grid item xs={12} md={8} lg={6} xl={4}>
					<Card>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography component="h2" variant="h5">Szia,{" "}
										{session.user.name}!
									</Typography>
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
											<MenuItem value="student">Tanuló</MenuItem>
											<MenuItem value="teacher">Tanár</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Button variant="contained" color="primary" fullWidth>Tovább</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

WelcomeBack.getInitialProps = async () => {
	return {
		session: await getSession()
	};
}