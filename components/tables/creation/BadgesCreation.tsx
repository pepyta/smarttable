import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Card, CardContent, Grid, TextField, Typography, makeStyles } from "@material-ui/core";
import { Dispatch, SetStateAction, useState } from "react";
import { BadgeRow, TaskRow } from "../../../pages/tables/create";
import SingleBadgeCreation from './singles/SingleBadgeCreation';

const useStyles = makeStyles((theme) => ({
    noVerticalMargin: {
        marginTop: 0,
        marginBottom: 0
    }
}));

export default function BadgeCreation({ badges, updateBadges }: { badges: BadgeRow[], updateBadges: (badge: BadgeRow, index: number) => void }) {
    const classes = useStyles();
    const [currState, setCurrState] = useState(badges);

    return (
        <Grid container spacing={2}>
            {currState.map((badge, index) => {
                return (
                    <SingleBadgeCreation badge={badge} index={index} update={updateBadges} />
                );
            })}
        </Grid>
    );
}