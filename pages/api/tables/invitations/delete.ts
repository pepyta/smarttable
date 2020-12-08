import { Invitations, PrismaClient, Table, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function deleteInvitation(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id }: { id: number } = JSON.parse(req.body);
        const session = await getSession({ req });

        const user = await prisma.user.findOne({
            where: {
                email: session.user.email
            }
        });

        const invitation = await prisma.invitations.findOne({
            where: {
                id
            }
        });

        if(invitation === null) throw new Error("Ezt a meghívást már elfogadtad!");

        await prisma.invitations.findFirst({
            where: {
                id: invitation.id
            }
        });

        res.json({
            error: false,
            message: "Sikeresen elutasítottad a meghívást!"
        });
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }

}