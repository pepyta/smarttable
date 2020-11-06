import { Card, CardContent, Container, Grid, makeStyles, Typography, createStyles } from "@material-ui/core";
import { WarningRounded } from "@material-ui/icons";


const useStyles = makeStyles((theme) =>
	createStyles({
		verticalCenter: {
			marginTop: "auto",
			marginBottom: "auto"
		},
		verticalAndHorizontalCenter: {
			marginTop: "auto",
			textAlign: "center",
			marginBottom: "auto"
		},
		fullHeight: {
			minHeight: "100vh"
        },
        google: {
            backgroundColor: "#fff"
		},
		largeIcon: {
			fontSize: "6rem"
		},
		errorCard: {
			backgroundColor: theme.palette.error.main
		}
	}),
);

export default function ErrorPage(){
	const classes = useStyles();

	return (
		<Container>
			<Grid container className={classes.fullHeight} justify="center">
				<Grid className={classes.verticalCenter} item xs={12} md={5}>
					<Card className={classes.errorCard}>
						<CardContent>
							<Grid container spacing={2}>
								<Grid item xs={4} className={classes.verticalAndHorizontalCenter}>
									<WarningRounded className={classes.largeIcon} />
								</Grid>
								<Grid item xs={8} className={classes.verticalCenter}>
									<Typography variant="h5" component="h2" gutterBottom>
										Hiba történt!
									</Typography>
									<Typography>
										A bejelentkezés során valami hiba történt. Kérlek próbálkozz újra később!
									</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}