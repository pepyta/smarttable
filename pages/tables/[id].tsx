import { Grid, makeStyles, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import { getSession, Session } from "next-auth/client"
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Base from "../../components/Base";
import LoaderComponent from "../../components/dashboard/Loader";
import getRole from "../../lib/client/role/get";
import getSingleTable, { GetSingleTableResponse } from "../../lib/client/tables/getOne";
import { AvailableRoles } from "../api/role/get";

type TabState = "TASKS" | "STUDENTS" | "BADGES";

const useStyles = makeStyles((theme) => {
    return {
        header: {
            padding: theme.spacing(0, 3)
        }
    };
});

export default function SingleTable({ session }: { session: Session }) {
    const router = useRouter();
    const [role, setRole]: [AvailableRoles, Dispatch<SetStateAction<AvailableRoles>>] = useState("NOT_CHOOSEN");
    const [data, setData]: [GetSingleTableResponse, Dispatch<SetStateAction<GetSingleTableResponse>>] = useState(null);
    const {enqueueSnackbar} = useSnackbar();
    const [tab, setTab]: [TabState, Dispatch<SetStateAction<TabState>>] = useState("TASKS");
    const classes = useStyles();

    useEffect(() => {
        const startup = async () => {
            try {
                setRole(await (await getRole()).data.role);
                setData(await getSingleTable(parseInt(router.query.id+"")));
            } catch(e) {
                enqueueSnackbar(e.message, { variant: "error" });
                router.push("/");
            }
        };

        startup();
    }, []);

    if(!data){
        return (
            <Base session={session}>
                <LoaderComponent />
            </Base>
        );
    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Base session={session} padding={false}>
            <Paper>
                <Grid container justify="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" component="h2" noWrap gutterBottom>
                            {data.name}
                        </Typography>
                        <Typography variant="h6" component="h3" noWrap gutterBottom>
                            {data.teacher.user.name}
                        </Typography>
                        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
                            <Tab value="TASKS" label="Feladatok" />
                            <Tab value="BADGES" label="Kitűzők" />
                            <Tab value="STUDENTS" label="Tanulók" />
                        </Tabs>
                    </Grid>
                </Grid>
            </Paper>
        </Base>
    );
}

SingleTable.getInitialProps = async (context) => {
    return {
        session: await getSession(context)
    }
}