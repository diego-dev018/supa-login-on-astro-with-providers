import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import type { Provider } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github' as Provider,
        options: {
            redirectTo: "http://localhost:4321/api/auth/callback"
        },
    });

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    return redirect(data.url);
};