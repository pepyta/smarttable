import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { Badge, BadgeCompletion, Image, User } from "@prisma/client";
import { Session } from "next-auth/client";
import { AvailableRoles } from "../../../../pages/api/role/get";
import StudentBadge from "./SingleBadge";

export type BadgesWithCompletion = (Badge & {
    image: Image;
    BadgeCompletion: (BadgeCompletion & {
        user: User;
    })[];
})[];

export default function StudentBadgeCategory({ role, show, allUser, badges, session }: { role: AvailableRoles, show: boolean, badges: BadgesWithCompletion, allUser: User[], session: Session }){
    const earned = badges.filter((badge) => badge.BadgeCompletion.filter((completion) => completion.user.email === session.user.email).length > 0);
    const notEarned = badges.filter((badge) => earned.filter((tmp) => tmp.id === badge.id).length === 0);
    
    console.log(notEarned);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Elért kitűzők
                        </Typography>

                        <Grid container spacing={2}>
                            {earned.map((badge) => (
                                <StudentBadge alt={badge.name} earned={true} image={badge.image} />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Még nem elért kitűzők
                        </Typography>

                        <Grid container spacing={2}>
                            {notEarned.map((badge) => (
                                <StudentBadge alt={badge.name} earned={false} image={badge.image} />
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}