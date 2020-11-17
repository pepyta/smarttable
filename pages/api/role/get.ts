import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession, Session } from "next-auth/client";

const prisma = new PrismaClient();

export type AvailableRoles = "TEACHER" | "STUDENT" | "NOT_CHOOSEN";

export type GetRoleResponse = {
	error: boolean;
	data: {
		role: AvailableRoles;
	};
};

export default async function(req: NextApiRequest, res: NextApiResponse){
	const session = await getSession({ req });
	
	if(!session) throw new Error("No active login");

	res.json({
		error: false,
		data: {
			role: await getRole(session)
		}
	});
}

export async function getRole(session: Session): Promise<AvailableRoles>{
	const user = await prisma.user.findOne({
		where: {
			email: session.user.email
		}
	});

	return user.role;
}