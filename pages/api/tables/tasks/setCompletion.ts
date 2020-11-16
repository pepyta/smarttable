
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function setTaskCompletion(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });
        if (!session) throw new Error("No active login found!");
        const { id, completed }: { id: number, completed: boolean } = JSON.parse(req.body);

        const user = await prisma.user.findOne({
            where: {
                email: session.user.email
            }
        });

        if(user === null) throw new Error("Nincs ilyen felhasználó!");

        const check = await prisma.task.findOne({
            where: {
                id
            },
            include: {
                Table: {
                    include: {
                        students: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        if(check === null) throw new Error("Ezt a táblát törölték.");

        if(check.Table.students.filter((el) => el.user.id !== user.id)) throw new Error("Nincs hozzáférésed ehhez a táblához.");
        if(new Date(check.endsAt) < new Date()) throw new Error("Már lejárt a határidő.");

        if(completed){
            await prisma.taskCompletion.create({
                data: {
                    task: {
                        connect: {
                            id
                        }
                    },
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            });
        } else {
            await prisma.taskCompletion.delete({
                where: {
                    userid_taskid: {
                        userid: user.id,
                        taskid: id
                    }
                }
            });
        }

        res.json({
            error: false,
        });
    } catch(e) {
        res.json({
            error: true,
            message: e.message
        });
    }
}