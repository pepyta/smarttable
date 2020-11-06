import { GetRoleResponse } from "../../../pages/api/role/get";

export const API_ENDPOINT = "http://localhost:3000/api";

export default async function getRole(): Promise<GetRoleResponse> {
	const resp = await fetch(`${API_ENDPOINT}/role/get`);

	return await (resp.json());
}