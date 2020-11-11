import { Card, CardContent, Grid, TextField, Typography, makeStyles } from "@material-ui/core";
import { useState } from "react";
import { BasicInformation, TaskRow } from "../../../pages/tables/create";

export default function BasicTableInformation({ basic, updateNumberOfTasks, updateNumberOfBadges }: { basic: BasicInformation, updateNumberOfTasks: (num: number) => void, updateNumberOfBadges: (num: number) => void }){
    const [name, setName] = useState(basic.name);
    const [numOfBadge, setNumOfBadges] = useState(basic.numOfBadges);
    const [numOfTasks, setNumOfTasks] = useState(basic.numOfTasks);

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth required autoFocus value={name} onChange={(e) => {
                            basic.name = e.target.value;
                            setName(e.target.value)
                        }} label="Táblázat neve" variant="filled" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth required type="number" value={numOfBadge} onChange={(e) => {
                            
                            try {
                                let num = parseInt(e.target.value + "");
                                if(isNaN(num)) throw new Error();
                                if(num < 0) num = 0;
                                basic.numOfBadges = num;
                                
                                setNumOfBadges(num);
                                updateNumberOfBadges(num);
                            } catch {
                                let num = 0;
                                
                                setNumOfBadges(num);
                                updateNumberOfBadges(num);

                            }
                        }} label="Kitűzők száma" variant="filled" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth required type="number" value={numOfTasks} onChange={(e) => {
                            try {
                                let num = parseInt(e.target.value + "");
                                if(isNaN(num)) throw new Error();
                                if(num < 0) num = 0;
                                basic.numOfTasks = num;
                                
                                setNumOfTasks(num);
                                updateNumberOfTasks(num);
                            } catch {
                                let num = 0;
                                
                                setNumOfTasks(num);
                                updateNumberOfTasks(num);

                            }
                        }} label="Feladatok száma" variant="filled" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}