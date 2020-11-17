import { Badge, BadgeCompletion, Image, User } from "@prisma/client";
import { Session } from "next-auth/client";
import { AvailableRoles } from "../../../../pages/api/role/get";
import StudentBadgeCategory, { BadgesWithCompletion } from "./StudentBadgeCategory";
import TeacherBadgeCategory from "./TeacherBadgeCategory";

export default function BadgesList({ role, show, allUser, badges, session }: { role: AvailableRoles, show: boolean, badges: BadgesWithCompletion, allUser: User[], session: Session }){
    if(!show) return (<div />);
    
    if(role === "TEACHER"){
        return (
            <TeacherBadgeCategory role={role} show={show} allUser={allUser} badges={badges} session={session} />
        );
    }

    return (
        <StudentBadgeCategory role={role} show={show} allUser={allUser} badges={badges} session={session} />
    );
}