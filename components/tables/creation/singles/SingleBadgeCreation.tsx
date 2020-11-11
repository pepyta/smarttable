import { BadgeRow, TaskRow } from "../../../../pages/tables/create";

import { Card, CardContent, Grid, TextField, Typography, makeStyles, Button } from "@material-ui/core";
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    noVerticalMargin: {
        marginTop: 0,
        marginBottom: 0
    },
    verticalCenter: {
        height: "100%"
    }
}));

export default function SingleBadgeCreation({ badge, index, update }: { badge: BadgeRow, index: number, update: (badge: BadgeRow, index: number) => void }) {
    const classes = useStyles();
    const [state, setState] = useState(badge);

    const updateBadge = (badge: BadgeRow, index: number) => {
        update(badge, index);
        setState(badge);
    };

    return (
        <Grid item xs={12}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <label htmlFor={`badge-file-upload-${index}`} >
                                <input
                                    style={{ display: 'none' }}
                                    id={`badge-file-upload-${index}`}
                                    name={`badge-file-upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        updateBadge({ ...state, icon: e.target.files[0] }, index);
                                    }}
                                />

                                <Button className={classes.verticalCenter} fullWidth color="primary" variant="contained" component="span">
                                    Kép feltöltése
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField fullWidth variant="filled" value={state.name} onChange={(e) => {
                                updateBadge({ ...state, name: e.target.value }, index);
                            }} label="Kitűző neve" required />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}