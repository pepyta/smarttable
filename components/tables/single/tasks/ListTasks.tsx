import { Grid } from "@material-ui/core";
import { Task, TaskCompletion, User } from "@prisma/client";
import { tasks_v1 } from "googleapis";
import { Session } from "next-auth/client";
import { AvailableRoles } from "../../../../pages/api/role/get";
import SingleTask from "./SingleTask";

type TaskList = (Task & {
    TaskCompletion: (TaskCompletion & {
        user: User
    })[];
})[];

export default function ListTasks({ show, tasks, role, session, allUser }: { show: boolean, tasks: TaskList, role: AvailableRoles, session: Session, allUser: User[] }){
    if(!show) return <div />;
    
    if(tasks.length === 0){
        return (
            <Grid container>
                <Grid item xs={12}>
                    Nincs egyetlen feladat sem...
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {tasks.map((task) => (<SingleTask task={task} allUser={allUser} role={role} session={session} />))}
            </Grid>
        </Grid>
    );
}