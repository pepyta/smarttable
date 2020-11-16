import { GetInvitationsResponseBody } from "../../../pages/api/tables/invitations/get";

export const API_ENDPOINT = "http://localhost:3000/api";

export default async function invite(id: number, email: string): Promise<{ error: boolean, message: string }> {
	const resp = await fetch(`${API_ENDPOINT}/tables/invitations/create`, {
        method: "POST",
        body: JSON.stringify({
            email,
            id
        })
    });

    const json = await resp.json();

    if(json.error) throw new Error(json.message);

	return json;
}