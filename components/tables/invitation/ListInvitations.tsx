import { Card, CardContent, Grid, IconButton, Typography } from "@material-ui/core";
import { CheckRounded, CloseRounded } from "@material-ui/icons";
import { Invitations, Table, User } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import acceptInvitation from "../../../lib/client/tables/invitations/accept";
import getInvitations from "../../../lib/client/tables/invitations/get";
import refuseInvitations from "../../../lib/client/tables/invitations/refuse";

type InvitationType = Invitations & {
    table: Table & {
        teacher: User;
    };
};

export default function ListInvitations() {
    const [loading, setLoading] = useState(true);
    const [invitations, setInvitations]: [InvitationType[], Dispatch<SetStateAction<InvitationType[]>>] = useState([]);

    const load = async () => {
        setInvitations((await getInvitations()).data.invitations);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) return <Fragment />;
    if (invitations.length === 0) return <Fragment />;

    const removeFromList = (id: number) => {
        const newInvitations = [...invitations].filter((el) => el.id !== id);
        setInvitations(newInvitations);
    };

    return (
        <Grid item xs={12}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Meghívók
                    </Typography>
                        
                    <Grid container spacing={2}>
                        {invitations.map((el) => (
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={8}>
                                        <Grid container alignItems="center" style={{ height: "100%"}}>
                                            <Grid item>
                                                <Typography>
                                                    {el.table.name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4} style={{ textAlign: "right" }}>
                                        <IconButton onClick={async () => {
                                            removeFromList(el.id);
                                            await acceptInvitation(el.id);
                                        }}>
                                            <CheckRounded />
                                        </IconButton>
                                        <IconButton onClick={async () => {
                                            removeFromList(el.id);
                                            await refuseInvitations(el.id);
                                        }}>
                                            <CloseRounded />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}