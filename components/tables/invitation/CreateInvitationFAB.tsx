import { Fab, makeStyles, Zoom } from "@material-ui/core";
import { AddRounded } from "@material-ui/icons";
import { Fragment, useState } from "react"
import InvitationModal from "./InvitationModal";

const useStyles = makeStyles((theme) => ({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));

export default function CreateInvitationFAB({ show, tableid }: { show: boolean; tableid: number }){
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    return (
        <Fragment>
            <Zoom in={show}>
                <Fab onClick={() => setOpen(true)} className={classes.fab}>
                    <AddRounded />
                </Fab>
            </Zoom>
            <InvitationModal open={open} onClose={() => setOpen(false)} tableid={tableid} />
        </Fragment>
    );
}