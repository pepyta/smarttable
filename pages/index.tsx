import { Card, CardActionArea, CardContent, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { getSession, Session } from "next-auth/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Base from "../components/Base";
import LoaderComponent from "../components/dashboard/Loader";
import TableCreation from "../components/dashboard/TableCreation";
import getTables, { GetTablesResponse } from "../lib/client/tables/get";
import Image from "next/image";


const useStyles = makeStyles((theme) => {
	return {
		verticalCenter: {
			display: "block",
			marginTop: "auto",
			marginBottom: "auto"
		},
		rounded: {
			borderRadius: theme.shape.borderRadius,
		}
	}
});

export default function DashboardMain({ session }: { session: Session }) {
	const [loading, setLoading] = useState(true);
	const classes = useStyles();
	let [tables, setTables]: [GetTablesResponse, Dispatch<SetStateAction<GetTablesResponse>>] = useState([]);

	useEffect(() => {
		getTables().then((res) => {
			setTables(res);
			setLoading(false);
		}).catch((e) => console.error);
	}, []);

	return (
		<Base session={session}>
			<TableCreation session={session} />
			{loading ? <LoaderComponent /> : (
				<Container>
					<Grid container spacing={2}>
						{tables.map((table) => (
							<Grid item xs={12} md={6}>
								<Card>
									<CardActionArea>
										<CardContent>
											<Grid container spacing={2}>
												<Grid alignItems="center" alignContent="center" item xs={table.icon === null ? 12 : 8}>
													<Grid
														container
														spacing={0}
														direction="column"
														justify="center" style={{
															minHeight: "100%"
														}}>
														<Grid item xs={12}>
															<Typography component="h2" variant="h5" noWrap gutterBottom>
																{table.name}
															</Typography>
															<Typography component="h3" variant="body2" noWrap>
																Létrehozva: {new Date(table.createdAt).toLocaleDateString()}
															</Typography>
															<Typography component="h3" variant="body2" noWrap>
																Kitűzők száma: {table.badges.length}
															</Typography>
															<Typography component="h3" variant="body2" noWrap>
																Feladatok száma: {table.tasks.length}
															</Typography>
														</Grid>
													</Grid>
												</Grid>
												{table.icon !== null ?
													<Grid item xs={4}>
														<Grid
														container
														spacing={0}
														direction="column"
														justify="center" style={{
															minHeight: "100%"
														}}>
															<Grid item xs={12}>
																<Image className={`${classes.verticalCenter} ${classes.rounded}`} src={`${table.icon.path.replace("public", "").replaceAll("\\", "/")}`} height={table.icon.height} width={table.icon.width} />	
															</Grid>
														</Grid>
													</Grid> : ""}
											</Grid>
										</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			)}
		</Base>
	);
}

DashboardMain.getInitialProps = async (context) => {
	return {
		session: await getSession(context)
	};
};