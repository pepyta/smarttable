import { Avatar, Grid, makeStyles, Tooltip, Zoom } from "@material-ui/core";
import { Image as PrismaImage } from "@prisma/client";
import Image from "next/image";

const useStyles = makeStyles((theme) => {
    return {
        greyscale: {
            filter: "grayscale(1)"
        },
        icon: {
            minHeight: 64,
            width: 64
        },
        earnedLetter: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main)
        },
        vcenter: {
            marginTop: "auto",
            marginBottom: "auto"
        }
    };
})

export default function SingleBadge({ image, alt, earned }: { image?: PrismaImage, alt: string, earned: boolean }) {
    const classes = useStyles();

    return (
        <Grid item>
            <Tooltip title={alt}>
                <div className={classes.icon}>
                    {image ? (
                        <Image width={(64 * image.width) / image.height} height={64} className={`${!earned ? classes.greyscale : ""} ${classes.vcenter}`} src={`http://localhost:3000${image.path.replaceAll("\\", "/").replace("public", "")}`} />

                    ) : (
                        <Avatar className={`${(earned ? classes.earnedLetter : "")} ${classes.icon}`}>{alt[0].toLocaleUpperCase()}</Avatar>
                    )}
                </div>
            </Tooltip>
        </Grid>
    );
}