import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { Badge, BadgeCompletion, Image, User } from "@prisma/client";
import { Session } from "next-auth/client";
import { AvailableRoles } from "../../../../pages/api/role/get";
import StudentBadge from "./TeacherBadge";
import { BadgesWithCompletion } from "./StudentBadgeCategory";

export default function TeacherBadgeCategory({ role, show, allUser, badges, session }: { role: AvailableRoles, show: boolean, badges: BadgesWithCompletion, allUser: User[], session: Session }){
    return (
        <Grid container spacing={2}>
            {badges.map((badge) => {
                return (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {badge.name}
                                </Typography>

                                <Grid container spacing={2}>
                                    {allUser.map((user) => (
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item xs={2}>
                                                    <StudentBadge name={user.name} icon={user.image} />
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography noWrap variant="h6" component="h2">
                                                        {user.name}
                                                    </Typography>
                                                    <Typography noWrap variant="body2" component="p">
                                                        {user.email}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}