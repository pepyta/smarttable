import { GetInvitationsResponseBody } from "../../../../pages/api/tables/invitations/get";
import { API_ENDPOINT } from "../../invitations/get";

export default async function getInvitations(): Promise<GetInvitationsResponseBody> {
	const resp = await fetch(`${API_ENDPOINT}/tables/invitations/get`);
    const json = await resp.json();

    if(json.error) throw new Error(json.message);

    return json;
}