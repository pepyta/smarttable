import { TaskRow } from "../../../../pages/tables/create";

import { Card, CardContent, Grid, TextField, Typography, makeStyles } from "@material-ui/core";
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    noVerticalMargin: {
        marginTop: 0,
        marginBottom: 0
    }
}));

export default function SingleTaskCreation({ task, index, update }: { task: TaskRow, index: number, update: (task: TaskRow, index: number) => void }){
    const classes = useStyles();
    const [state, setState] = useState(task);
    const [date, setDate] = useState(task.date);

    const updateTask = (task: TaskRow, index: number) => {
        update(task, index);
        setState(task);
    };

    return (
        <Grid item xs={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="filled" value={state.name} onChange={(e) => {
                                updateTask({ ...state, name: e.target.value }, index);
                            }} label="Feladat neve" required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <KeyboardDatePicker className={classes.noVerticalMargin}
                                disableToolbar
                                variant="inline"
                                format="yyyy. MM. dd."
                                margin="normal"
                                inputVariant="filled"
                                label="Feladat határideje"
                                value={date}
                                fullWidth
                                required
                                onChange={(e) => {
                                    updateTask({ ...state, date: e }, index)
                                    setDate(e);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField required fullWidth type="number" label="Feladat pontszáma" onChange={(e) => updateTask({ ...state, point: parseInt(e.target.value + "") }, index)} value={state.point} variant="filled" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth variant="filled" label="Feladat leírása" onChange={(e) => updateTask({ ...state, description: e.target.value }, index)} value={state.description} multiline rows={4} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}