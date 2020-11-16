import React, { Dispatch, SetStateAction, useEffect } from "react";
import { getSession, Session, signout } from "next-auth/client";
import { makeStyles, Grid, Typography, Toolbar, ListItemText, ListItemIcon, ListItem, List, IconButton, Hidden, Drawer, Divider, Dialog, AppBar, Paper, NoSsr, DialogTitle, DialogContentText, DialogActions, Button, DialogContent } from '@material-ui/core';
import { AddRounded, ContactsRounded, GroupRounded, MenuRounded } from "@material-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { ExitToAppRounded as LogoutIcon, HomeRounded as HomeIcon } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';
import getRole from "../lib/client/role/get";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	icon: {
		borderRadius: "50%"
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		display: 'block',
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
			display: 'none'
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	// necessary for content to be below app bar
	toolbar: {
		...theme.mixins.toolbar
	},
	drawerPaper: {
		width: drawerWidth,
	},
	padding: {
		padding: theme.spacing(3),
	},
	content: {
		flexGrow: 1,
		marginTop: 56,
		[theme.breakpoints.up('sm')]: {
			maxWidth: "calc(100vw - " + drawerWidth + "px)",
			marginTop: 0
		},
		maxWidth: "100vw"
	},
	branding: {
		padding: 16
	}
}));

export default function Base({ children, session, padding = true }: { children?: any, session: Session, padding?: boolean }) {
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [tables, setTables]: [BaseTableComponentType[], Dispatch<SetStateAction<BaseTableComponentType[]>>] = React.useState([]);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	useEffect(() => {
		const check = async () => {
			try {
				const role = await getRole();
				if (role.data.role === "NOT_CHOOSEN") router.push("/auth/welcome");
			} catch {
				router.push("/auth/welcome");
			}
		};

		check();
	}, []);

	useEffect(() => {
		const tableRaw = localStorage.getItem("tables");
		if (tableRaw !== undefined && tableRaw !== null) setTables(JSON.parse(tableRaw));
	}, []);

	if (!session) return <div />;

	const drawer = (
		<div>
			<div className={classes.toolbar}>
				<Grid container className={classes.branding} spacing={3} style={{ maxWidth: '100%' }}>
					<Grid item xs={4} style={{
						alignSelf: "center"
					}}>
						<Image id="preview" className={classes.icon} src={session.user.image} width={512} height={512} alt="Profilkép" />
					</Grid>
					<Grid item xs={8} style={{
						alignSelf: "center"
					}}>
						<Typography variant="body1">
							{session.user.name}
						</Typography>
						<Typography variant="body2">{session.user.email}</Typography>
					</Grid>
				</Grid>
			</div>
			<Divider />
			<List>
				<Link href="/">
					<ListItem button key={"home-button"}>
						<ListItemIcon><HomeIcon /></ListItemIcon>
						<ListItemText primary={"Főoldal"} />
					</ListItem>
				</Link>
			</List>
			<Divider />
			<List>
				{tables.map((table) => {
					return (
						<Link href={"/tables/" + table.id}>
							<ListItem button key={"table-" + table.id}>
								<ListItemIcon><GroupRounded /></ListItemIcon>
								<ListItemText primary={table.name} />
							</ListItem>
						</Link>
					);
				})}
				<Link href="/tables/create">
					<ListItem button key={"new-table-button"}>
						<ListItemIcon><AddRounded /></ListItemIcon>
						<ListItemText primary={"Új táblázat"} />
					</ListItem>
				</Link>
			</List>
			<Divider />
			<List>
				<a onClick={() => { setModalOpen(true) }}>
					<ListItem button key={"logout-button"}>
						<ListItemIcon><LogoutIcon /></ListItemIcon>
						<ListItemText primary={"Kijelentkezés"} />
					</ListItem>
				</a>
			</List>
		</div>
	);

	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<NoSsr>
			<div className={classes.root}>
				<Dialog open={modalOpen} onClose={setModalOpen}>
					<DialogTitle>Kijelentkezés</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Biztosan ki szeretnél jelentkezni? Amíg nem jelentkezel vissza, addig nem tudod használni a SmartTablet újra.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>
							Mégse
						</Button>
						<Button onClick={async () => {
							await signout();

							router.push({
								pathname: "/auth/signin"
							});

							enqueueSnackbar("Sikeres kijelentkezés!", {
								variant: "success"
							});
						}} color="primary">
							Kijelentkezés
						</Button>
					</DialogActions>
				</Dialog>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							className={classes.menuButton}
						>
							<MenuRounded />
						</IconButton>
						<Typography variant="h6" noWrap>
							SmartTable
						</Typography>
					</Toolbar>
				</AppBar>
				<nav className={classes.drawer} aria-label="mailbox folders">
					<Hidden smUp implementation="css">
						<Drawer
							variant="temporary"
							open={mobileOpen}
							onClose={handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper,
							}}
							ModalProps={{
								keepMounted: true,
							}}
						>
							{drawer}
						</Drawer>
					</Hidden>
					<Hidden xsDown implementation="css">
						<Drawer
							classes={{
								paper: classes.drawerPaper,
							}}
							variant="permanent"
							open
						>
							{drawer}
						</Drawer>
					</Hidden>
				</nav>
				<main className={`${classes.content} ${classes.padding}`}>
					{children}
				</main>
			</div>
		</NoSsr>
	);
}

export type BaseTableComponentType = {
	id: number;
	name: string;
};

Base.getInitialProps = async (context) => {
	const session = await getSession(context);

	if (!session && context.res !== undefined) {
		context.res.writeHead(301, { Location: '/auth/signin' });
		context.res.end();
	}

	return {
		session
	};
};