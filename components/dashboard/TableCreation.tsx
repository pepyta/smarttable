import 'date-fns';
import React, { useEffect, useState } from "react";
import { Session } from "next-auth/client";
import { Fab, makeStyles, Zoom } from "@material-ui/core";
import { AddRounded } from "@material-ui/icons";
import { useRouter } from "next/router";
import getRole from '../../lib/client/role/get';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}));


export default function TableCreation({ session }: { session: Session }) {
    const classes = useStyles();
    const router = useRouter();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const check = async () => {
            if((await getRole()).data.role === "TEACHER") setShow(true);
        };

        check();
    });

    return (
        <React.Fragment>
            <Zoom in={show}>
                <Fab onClick={() => router.push("/tables/create")} color="primary" className={classes.fab}>
                    <AddRounded />
                </Fab>
            </Zoom>
        </React.Fragment>
    );
}