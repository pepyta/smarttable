import { Accordion, AccordionSummary, Card, FormControlLabel, Grid, Checkbox, Typography, makeStyles, createStyles, Theme, AccordionDetails, Tooltip, Avatar } from "@material-ui/core";
import { ExpandMoreRounded } from "@material-ui/icons";
import { Student, Task, TaskCompletion, User } from "@prisma/client";
import { Session } from "next-auth/client";
import { useState } from "react";
import { AvailableRoles } from "../../../../pages/api/role/get";
import { AvatarGroup } from '@material-ui/lab';
import TaskListUserGroup from "./UserGroup";
import setCompletion from "../../../../lib/client/tables/tasks/complete";

type TaskData = (Task & {
    TaskCompletion: (TaskCompletion & {
        user: User
    })[];
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    }),
);

export default function SingleTask({ task, role, session, allUser }: { task: TaskData, role: AvailableRoles, session: Session, allUser: User[] }) {
    const [completed, setCompleted] = useState(task.TaskCompletion.filter((el) => el.user.email === session.user.email).length !== 0);
    const classes = useStyles();
    const [disabled, setDisabled] = useState(false);

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Grid container alignItems="center">
                    {role === "STUDENT" ? (
                        <Checkbox onClick={(event) => event.stopPropagation()} onFocus={(event) => event.stopPropagation()} disabled={disabled || new Date(task.endsAt) < new Date()} checked={completed} onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                            setDisabled(true);
                            setCompleted(event.target.checked);
                            await setCompletion(task.id, event.target.checked);
                            setDisabled(false);
                        }} />
                    ) : ""}
                    <Typography noWrap className={classes.heading}>{task.name}</Typography>
                    <Typography noWrap className={classes.secondaryHeading}>Határidő: {new Date(task.endsAt).toLocaleDateString()}</Typography>
                </Grid>   
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>
                            Ezért a feladatért <b>{task.points}</b> pont kapható.
                        </Typography>
                    </Grid>
                    {task.description !== null && task.description !== undefined && task.description !== "" ? (
                        
                        <Grid item xs={12}>
                            <Typography>
                                {task.description}
                            </Typography>
                        </Grid>
                    ) : ""}
                    {allUser.length > 0 ? (
                        <>
                            <Grid item xs={12}>
                                <TaskListUserGroup allUser={allUser} shouldBeCompleted={true} completed={task.TaskCompletion} />
                            </Grid>
                            <Grid item xs={12}>
                                <TaskListUserGroup allUser={allUser} shouldBeCompleted={false} completed={task.TaskCompletion} />
                            </Grid>
                        </>
                    ) : ""}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}