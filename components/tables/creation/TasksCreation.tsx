import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Card, CardContent, Grid, TextField, Typography, makeStyles } from "@material-ui/core";
import { Dispatch, SetStateAction, useState } from "react";
import { TaskRow } from "../../../pages/tables/create";
import SingleTaskCreation from './singles/SingleTaskCreation';

const useStyles = makeStyles((theme) => ({
    noVerticalMargin: {
        marginTop: 0,
        marginBottom: 0
    }
}));

export default function TasksCreation({ tasks, updateTasks }: { tasks: TaskRow[], updateTasks: (task: TaskRow, index: number) => void }) {
    const classes = useStyles();
    const [currState, setCurrState] = useState(tasks);

    return (
        <Grid container spacing={2}>
            {currState.map((task, index) => {
                return (
                    <SingleTaskCreation task={task} index={index} update={updateTasks} />
                );
            })}
        </Grid>
    );
}