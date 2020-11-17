import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { AvailableRoles, getRole } from "./get";

const prisma = new PrismaClient();

export type SetRoleResponse = {
	error: boolean;
	message: string;
};

export default async function setRole(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });
	const { role }: { role: AvailableRoles } = JSON.parse(req.body)

	if (!session) throw new Error("No active login found!");
	if (await getRole(session) !== "NOT_CHOOSEN") throw new Error("Already choosen role!")

	await prisma.user.update({
		where: {
			email: session.user.email
		},
		data: {
			role
		}
	});

	res.json({
		error: false,
		message: "Sikeresen beállítottad a szerepkörödet!"
	});
}