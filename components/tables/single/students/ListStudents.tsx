import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { User } from "@prisma/client";
import { Session } from "next-auth/client";
import { Fragment } from "react";
import { AvailableRoles } from "../../../../pages/api/role/get";

export default function ListStudents({ role, show, allUser, session }: { role: AvailableRoles, show: boolean, allUser: User[], session: Session }){
    if(!show) return <Fragment />;

    return (
        <Grid container spacing={2}>
            {allUser.map((user) => (
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant={"h5"} component="h2">
                                {user.name}
                            </Typography>
                            <Typography gutterBottom variant={"h6"} component="h3">
                                {user.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}