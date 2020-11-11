import { getSession, Session } from "next-auth/client";
import Base from "../components/Base";
import TableCreation from "../components/dashboard/TableCreation";

export default function DashboardMain({ session }: { session: Session }) {
	return (
		<Base session={session}>
			<TableCreation session={session} />
			<div>asd</div>
		</Base>
	);
}

DashboardMain.getInitialProps = async (context) => {
	return {
		session: await getSession(context)
	};
};