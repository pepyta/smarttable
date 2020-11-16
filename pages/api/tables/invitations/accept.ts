import { Invitations, PrismaClient, Table, Teacher, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function acceptInvitation(req: NextApiRequest, res: NextApiResponse) {
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

        await prisma.table.update({
            where: {
                id: invitation.tableid
            },
            data: {
                students: {
                    create: [{
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }]
                }
            }
        });

        await prisma.invitations.delete({
            where: {
                id: invitation.id
            }
        });

        res.json({
            error: false,
            message: "Sikeresen csatlakoztál!"
        });
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }

}