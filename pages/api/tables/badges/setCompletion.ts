import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function(req: NextApiRequest, res: NextApiResponse) {
    
    const session = await getSession({ req });
    if (!session) throw new Error("No active login found!");
    const { id, completed, userid }: { id: number, completed: boolean, userid: number } = JSON.parse(req.body);

    
    const user = await prisma.user.findOne({
        where: {
            email: session.user.email
        }
    });

    if(user === null) throw new Error("Nincs ilyen felhasználó!");

    const badge = await prisma.badge.findOne({
        where: {
            id
        },
        include: {
            Table: true
        }
    });

    if(badge.Table.teacherId !== user.id) throw new Error("Forbidden");

    const check = await prisma.badgeCompletion.findOne({
        where: {
            userid_badgeid: {
                userid,
                badgeid: id
            }
        }
    });

    await prisma.badgeCompletion.create({
        data: {
            badge: {
                connect: {
                    id
                }
            },
            user: {
                connect: {
                    id: userid
                }
            }
        }
    });

    res.json({
        error: false,
        message: "Sikeresen hozzáadva!"
    });
}