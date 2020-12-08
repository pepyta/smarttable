import { Container, Grid, makeStyles, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import { getSession, Session } from "next-auth/client"
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Base from "../../components/Base";
import LoaderComponent from "../../components/dashboard/Loader";
import CreateInvitationFAB from "../../components/tables/invitation/CreateInvitationFAB";
import BadgesList from "../../components/tables/single/badges/BadgesList";
import ListStudents from "../../components/tables/single/students/ListStudents";
import ListTasks from "../../components/tables/single/tasks/ListTasks";
import getRole from "../../lib/client/role/get";
import getSingleTable, { GetSingleTableResponse } from "../../lib/client/tables/getOne";
import { AvailableRoles } from "../api/role/get";

type TabState = ("TASKS" | "STUDENTS" | "BADGES");

const useStyles = makeStyles((theme) => {
    return {
        header: {
            padding: theme.spacing(8, 0, 5)
        },
        padTop: {
            paddingTop: theme.spacing(2)
        },

    };
});

const countBadges = (data: GetSingleTableResponse, email: string) => {
    const userid = data.students.find((student) => student.user.email === email).user.id;
    
    let point = 0;
    data.tasks.forEach((task) => {
        const completed = task.TaskCompletion.filter((completion) => completion.userid).length > 0;

        if(completed){
            point += task.points;
        }
    });

    let countBadge = 0;
    data.badges.forEach((badge) => {
        const completed = badge.BadgeCompletion.filter((completion) => completion.userid === userid).length > 0;
        
        if(completed){
            countBadge++;
        }
    });

    if(countBadge === data.badges.length){
        point *= 1.5;
    }

    return point;
};

export default function SingleTable({ session }: { session: Session }) {
    const router = useRouter();
    const [role, setRole]: [AvailableRoles, Dispatch<SetStateAction<AvailableRoles>>] = useState("NOT_CHOOSEN");
    const [data, setData]: [GetSingleTableResponse, Dispatch<SetStateAction<GetSingleTableResponse>>] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [tab, setTab]: [TabState, Dispatch<SetStateAction<TabState>>] = useState("TASKS");
    const classes = useStyles();

    useEffect(() => {
        const startup = async () => {
            try {
                setRole(await (await getRole()).data.role);
                setData(await getSingleTable(parseInt(router.query.id + "")));
            } catch (e) {
                enqueueSnackbar(e.message, { variant: "error" });
                router.push("/");
            }
        };

        startup();
    }, []);

    if (!data) {
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
            <Paper square>
                <Container>
                    <Grid container justify="center">
                        <Grid item xs={12} md={8}>
                            <div className={classes.header}>
                                <Typography variant="h4" component="h2" noWrap gutterBottom>
                                    {data.name}
                                </Typography>
                                <Typography variant="h6" component="h3" noWrap gutterBottom>
                                    {data.teacher.name}
                                </Typography>
                                {/* @ts-ignore */}
                                {role === "STUDENT" ? (
                                    <Typography variant="h6" component="h3" noWrap gutterBottom>
                                        Pontjaim:{" "} 
                                        <b>{countBadges(data, session.user.email)}</b>
                                    </Typography>
                                ) : ""}
                            </div>
                            <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
                                <Tab value="TASKS" label="Feladatok" />
                                <Tab value="BADGES" label="Kitűzők" />
                                <Tab value="STUDENTS" label="Tanulók" />
                            </Tabs>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
            <Container>   
                {/* @ts-ignore */}
                <CreateInvitationFAB show={tab === "STUDENTS"} tableid={data.id} /> 
                <Grid container justify="center">
                    <Grid item xs={12} md={8} className={classes.padTop}>
                        <ListTasks allUser={data.students.map((el) => el.user)} session={session} show={tab === "TASKS"} role={role} tasks={data.tasks} />
                        {/* @ts-ignore */}
                        <BadgesList allUser={data.students.map((el) => el.user)} session={session} show={tab === "BADGES"} role={role} badges={data.badges} />
                        {/* @ts-ignore */}
                        <ListStudents allUser={data.students.map((el) => el.user)} session={session} show={tab === "STUDENTS"} role={role} badges={data.badges} />
                    </Grid>
                </Grid>
            </Container>
        </Base>
    );
}

SingleTable.getInitialProps = async (context) => {
    return {
        session: await getSession(context)
    }
}