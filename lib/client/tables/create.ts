import { SetRoleResponse } from "../../../pages/api/role/set";
import { CreateTableApiRequestBody } from "../../../pages/api/tables/create";
import { API_ENDPOINT } from "../role/get";
import axios from "axios";

export default async function createTable(data: CreateTableApiRequestBody): Promise<SetRoleResponse> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    
    if(data.name === "" || data.name === null) throw new Error("A táblázat nevének megadása kötelező!");
    if(data.tasks.filter((task) => task.name === null || task.name === "").length !== 0) throw new Error("A feladatok nevének megadása kötelező!");
    if(data.badges.filter((badge) => badge.name === null || badge.name === "").length !== 0) throw new Error("A kitűzők nevének megadása kötelező!");

    for(let id in data.badges){
        if(data.badges[id].icon !== null){    
            const badge = data.badges[id];

            formData.append(`badge-${id}`, badge.icon);
        }
    }

    const resp = await axios.post(`${API_ENDPOINT}/tables/create`, formData);

    if(resp.data.error){
        throw new Error(resp.data.message);
    } else {
        const tablesRaw = localStorage.getItem("tables");
        const tables = [];
        if(tablesRaw !== undefined && tablesRaw !== null) tables.push(...JSON.parse(tablesRaw));
        
        tables.push({ name: resp.data.data.table.name, id: resp.data.data.table.id });
        localStorage.setItem("tables", JSON.stringify(tables));

        return resp.data;
    }
}