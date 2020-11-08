import React, { useEffect } from "react";
import { getSession, Session, signout } from "next-auth/client";
import { makeStyles, Grid, Typography, Toolbar, ListItemText, ListItemIcon, ListItem, List, IconButton, Hidden, Drawer, Divider, Dialog, AppBar, Paper, NoSsr, DialogTitle, DialogContentText, DialogActions, Button, DialogContent } from '@material-ui/core';
import { MenuRounded } from "@material-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { ExitToAppRounded as LogoutIcon, HomeRounded as HomeIcon } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';

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
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		marginTop: 56,
		[theme.breakpoints.up('sm')]: {
			maxWidth: "calc(100vw - "+drawerWidth+"px)",
			marginTop: 0
		},
		maxWidth: "100vw"
	},
	branding: {
		padding: 16
	}
}));

export default function Base({ children, session }: { children?: any, session: Session }){
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [modalOpen, setModalOpen] = React.useState(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	useEffect(() => {
		if(!session) router.push("/auth/signin");
	});

	if(!session) return <div />;

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
				<main className={classes.content}>
					{children}
				</main>
			</div>
		</NoSsr>
	);
}

Base.getInitialProps = async (context) => {
	return {
		session: await getSession(context)
	};
};