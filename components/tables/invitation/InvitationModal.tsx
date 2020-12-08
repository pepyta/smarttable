import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useState } from "react";
import invite from "../../../lib/client/tables/invitations/invite";

export default function InvitationModal({ open, onClose, tableid }: { open: boolean; onClose: () => void; tableid: number; }) {
    const [email, setEmail] = useState("");
    const [disabled, setDisabled] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleInvitation = async () => {
        setDisabled(true);

        try {
            await invite(tableid, email);
            enqueueSnackbar("Sikeres meghívás!", {
                variant: "success"
            });
            onClose();
        } catch (e) {
            enqueueSnackbar(e.message, {
                variant: "error"
            });
        }

        setDisabled(false);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Tanuló meghívása
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email cím"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value + "")}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Mégse</Button>
                <Button onClick={handleInvitation} disabled={disabled} color="primary">Meghív</Button>
            </DialogActions>
        </Dialog>
    );
}