import { GetInvitationsResponseBody } from "../../../pages/api/tables/invitations/get";

export const API_ENDPOINT = "http://localhost:3000/api";

export default async function getRole(): Promise<GetInvitationsResponseBody> {
	const resp = await fetch(`${API_ENDPOINT}/tables/invitations/get`);

	return await (resp.json());
}