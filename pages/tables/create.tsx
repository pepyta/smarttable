import { Card, CardContent, Grid, TextField, Typography, makeStyles, Stepper, Step, StepLabel, Hidden, Button } from "@material-ui/core";
import { getSession, Session } from "next-auth/client";
import { useState } from "react";
import Base from "../../components/Base";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import TasksCreation from "../../components/tables/creation/TasksCreation";
import BasicTableInformation from "../../components/tables/creation/BasicInformation";
import { BookSharp } from "@material-ui/icons";
import BadgeCreation from "../../components/tables/creation/BadgesCreation";
import createTable from "../../lib/client/tables/create";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

export type TaskRow = {
    name: string;
    description?: string;
    date: Date;
    point: number;
}

export type BadgeRow = {
    name: string;
    icon: File;
}

export type BasicInformation = {
    name: string;
    numOfBadges: number;
    numOfTasks: number;
}

function createArrayWithNum(num: number, current: any[], value: any) {
    if (current.length > num) {
        const resp = [...current].filter((el, index) => index < num);
        return resp;
    } else if (current.length === num) {
        return [...current];
    } else if (current.length < num) {
        const tmp = [];
        for (let i = 0; i < (num - current.length); i++) {
            tmp.push(value);
        }

        return [...current, ...tmp];
    }
}

let tasks: TaskRow[] = createArrayWithNum(3, [], { name: null, description: null, point: 0, date: new Date() });
let badges: BadgeRow[] = createArrayWithNum(3, [], { name: null, icon: null });

const basic: BasicInformation = {
    name: null,
    numOfBadges: 3,
    numOfTasks: 3
};

const updateTasks = (task: TaskRow, index: number) => {
    tasks[index] = task;
};

const updateBadges = (badge: BadgeRow, index: number) => {
    badges[index] = badge;
};


export default function TableCreation({ session }: { session: Session }) {
    const [stateTasks, setStateTasks] = useState(tasks);
    const [stateBadges, setStateBadges] = useState(badges);
    const [activeStep, setActiveStep] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const router = useRouter();

    const updateNumberOfTasks = (num: number) => {
        tasks = createArrayWithNum(num, tasks, { name: "", description: "", point: 0, date: new Date() });
        setStateTasks(tasks);
    };
    
    const updateNumberOfBadges = (num: number) => {
        badges = createArrayWithNum(num, badges, { name: null, icon: null });
        setStateBadges(badges);
    };

    const handleSubmit = async () => {
        setDisabled(true);

        try {
            const resp = await createTable({
                name: basic.name,
                tasks,
                badges
            });
    
            enqueueSnackbar(resp.message, { variant: "success" });
            router.push("/");
        } catch(e){
            enqueueSnackbar(e.message, { variant: "error" });
            setDisabled(false);
        }
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Base session={session}>
                <Grid container justify="center">
                    <Grid item xs={12} md={8} lg={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <Stepper>
                                        <Step active={activeStep === 0} completed={activeStep > 0}>
                                            <StepLabel>
                                                Alapvető információk
                                            </StepLabel>
                                        </Step>
                                        <Step active={activeStep === 1} completed={activeStep > 1}>
                                            <StepLabel>
                                                Feladatok megadása
                                            </StepLabel>
                                        </Step>
                                        <Step active={activeStep === 2} completed={activeStep > 2}>
                                            <StepLabel>
                                                Kitűzők megadása
                                            </StepLabel>
                                        </Step>
                                        <Step active={activeStep === 3}>
                                            <StepLabel>
                                                Befejezés
                                            </StepLabel>
                                        </Step>
                                    </Stepper>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                {activeStep === 0 ?
                                    <BasicTableInformation basic={basic} updateNumberOfTasks={updateNumberOfTasks} updateNumberOfBadges={updateNumberOfBadges} /> :
                                    activeStep === 1 ?
                                        <TasksCreation tasks={stateTasks} updateTasks={updateTasks} key={"tasks-" + stateTasks.length} /> :
                                        activeStep === 2 ? <BadgeCreation badges={badges} updateBadges={updateBadges} key={"badges-" + stateBadges.length} /> : <div />}
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" fullWidth color="primary" onClick={activeStep === 3 ? handleSubmit : () => {
                                    setActiveStep(activeStep === 0 && basic.numOfTasks === 0 && basic.numOfBadges === 0 ? 3 : activeStep === 0 && basic.numOfTasks === 0 ? 2 : activeStep === 1 && basic.numOfBadges === 0 ? 3 : activeStep + 1)
                                }} disabled={disabled}>{activeStep === 3 ? "Befejezés" : "Tovább"}</Button>
                            </Grid>
                            {activeStep !== 0 ? 
                            <Grid item xs={12}>
                                <Button variant="outlined" fullWidth color="primary" onClick={() => setActiveStep(activeStep === 3 && basic.numOfBadges === 0 && basic.numOfTasks === 0 ? 0 : activeStep === 3 && basic.numOfBadges === 0 ? 1 : activeStep === 2 && basic.numOfTasks === 0 ? 0 : activeStep - 1)} disabled={disabled}>Vissza</Button>
                            </Grid> : ""}
                        </Grid>
                    </Grid>
                </Grid>
            </Base>
        </MuiPickersUtilsProvider>
    );
}

TableCreation.getInitialProps = async (context) => {
    return {
        session: await getSession(context)
    }
}