import { Card, CardContent, Checkbox, Grid, Typography } from "@material-ui/core";
import { Badge, BadgeCompletion, Image, User } from "@prisma/client";
import { Session } from "next-auth/client";
import { AvailableRoles } from "../../../../pages/api/role/get";
import StudentBadge from "./TeacherBadge";
import { BadgesWithCompletion } from "./StudentBadgeCategory";
import { useState } from "react";
import setCompletion from "../../../../lib/client/tables/badges/complete";

const getCompletionList = (badges: BadgesWithCompletion) => {
    const resp = {};
    badges.forEach((badge) => {
        badge.BadgeCompletion.forEach((completion) => {
            if(!resp[badge.id]) resp[badge.id] = {}; 
            resp[badge.id][completion.userid] = true;
        });
    });

    return resp;
}

export default function TeacherBadgeCategory({ role, show, allUser, badges, session }: { role: AvailableRoles, show: boolean, badges: BadgesWithCompletion, allUser: User[], session: Session }){
    const [disabled, setDisabled] = useState(false);
    const [completion, setLocalCompletion] = useState(getCompletionList(badges));
    
    const handleChange = async (userid: number, id: number, completed: boolean) => {
        setDisabled(true);
        await setCompletion(id, userid, completed);
        const newCompletion = {...completion};
        if(!newCompletion[id]) newCompletion[id] = {};
        newCompletion[id][userid] = completed;
        setLocalCompletion(newCompletion);
        setDisabled(false);
    };

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
                                                    <Checkbox
                                                        checked={completion[badge.id] ? completion[badge.id][user.id] : false}
                                                        disabled={disabled}
                                                        onChange={() => {
                                                            handleChange(user.id, badge.id, completion[badge.id] ? !completion[badge.id][user.id] : true);
                                                        }}
                                                    />
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