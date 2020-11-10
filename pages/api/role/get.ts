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

	const teacher = await prisma.teacher.findOne({
		where: {
			userid: user.id
		}
	});

	if(teacher !== null) {
		return "TEACHER";
	}

	const student = await prisma.student.findOne({
		where: {
			userid: user.id
		}
	});

	if(student !== null){
		return "STUDENT";
	}

	return "NOT_CHOOSEN";
}