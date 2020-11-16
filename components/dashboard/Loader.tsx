import { CircularProgress, Container, createStyles, Grid, makeStyles } from "@material-ui/core";

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
			minHeight: "calc(100vh - 54px)"
		}
	}),
);

export default function LoaderComponent() {
    const classes = useStyles();
    return (
		<Container>
            <Grid container className={classes.fullHeight} justify="center">
                <Grid className={classes.verticalCenter} style={{ textAlign: "center" }} item xs={12} md={8} lg={6} xl={4}>
                    <CircularProgress size={65} style={{ marginLeft: "auto", marginRight: "auto" }} />
                </Grid>
            </Grid>
        </Container>
    );
}