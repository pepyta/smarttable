import { Avatar, Grid, makeStyles, Tooltip } from "@material-ui/core";
import { Image as PrismaImage } from "@prisma/client";
import Image from "next/image";

const useStyles = makeStyles((theme) => {
    return {
        userLetter: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            height: 64,
            width: 64
        }
    };
});

export default function TeacherBadge({ name, icon }: { name: string, icon?: string }) {
    const classes = useStyles();

    return (
        <Grid item>
            {!icon ? (
                <Avatar className={classes.userLetter}>{nameToIcon(name)}</Avatar>
            ) : (
                <Image width={64} height={64} src={icon} />
            )}
        </Grid>
    );
}

function nameToIcon(name: string) {
    let resp = "";

    const splitted = name.split(" ");
    splitted.forEach((n) => {
        if (n.length > 0) resp += n[0].toLocaleUpperCase();
    });

    return resp;
}