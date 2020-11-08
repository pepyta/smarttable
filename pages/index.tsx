import { getSession, Session } from "next-auth/client";
import Base from "../components/Base";

export default function DashboardMain({ session }: { session: Session }) {
	return (
		<Base session={session}>
			<div>asd</div>
		</Base>
	);
}

DashboardMain.getInitialProps = async (context) => {
	return {
		session: await getSession(context)
	};
};