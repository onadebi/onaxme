export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";
import db from "../../configs/dbConfig";
import { type NewItem, items } from "../../db/schema/schema";

export const GET: APIRoute = async ({ request }) => {
    return new Response(
        JSON.stringify({
            message: "Hello from the server!",
        }),
        { status: 200 }
    );
};

export const POST: APIRoute = async ({ request }) => {
    console.log(JSON.stringify(request.headers));
    console.log(request.method);
    console.log(request.url);
    const { name, description } = await request.json();

    if (!name || !description) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }
    // Do something with the data, then return a success response
    let objResp;
    if (name) {
        const newItem: NewItem = { name, description };
        objResp = await db.insert(items).values(newItem);
    }
    return new Response(
        JSON.stringify({
            message: "Success!",
            name,
            description,
            objResp,
        }),
        { status: 200 }
    );
};