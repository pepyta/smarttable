import { Avatar, Grid, Tooltip, Typography } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { TaskCompletion, User } from "@prisma/client";


export default function TaskListUserGroup({ shouldBeCompleted, completed, allUser }: { shouldBeCompleted: boolean, completed: (TaskCompletion & { user: User; })[], allUser: User[]; }) {
    const notCompleted = allUser.filter((el) => !completed.map((tmp) => tmp.userid).includes(el.id));

    if(allUser.length === 0) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography noWrap>
                        Még egy diákod sincs.
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    if (shouldBeCompleted && completed.length === 0) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography noWrap>
                        Még senki sem készült el a feladattal.
                </Typography>
                </Grid>
            </Grid>
        );
    }

    
    if (!shouldBeCompleted && notCompleted.length === 0) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography noWrap>
                        Már mindenki elkészült a feladattal.
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container>
            <Grid item xs={4}>
                <Typography noWrap>
                    Eddig ő(k) {!shouldBeCompleted ? "nem" : ""} készültek el:
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <AvatarGroup max={5}>
                    {shouldBeCompleted ? completed.map((el) => (
                        <Tooltip title={el.user.name}>
                            <Avatar alt={el.user.name} src={el.user.image} />
                        </Tooltip>
                    )) : notCompleted.map((el) => (
                        <Tooltip title={el.name}>
                            <Avatar alt={el.name} src={el.image} />
                        </Tooltip>
                    ))}
                </AvatarGroup>
            </Grid>
        </Grid>
    );
}