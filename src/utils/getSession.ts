import { supabase } from "../lib/supabase";

export default async function getSession(refreshToken: { value: string }, accessToken: { value: string }) {
    let session;
    try {
        session = await supabase.auth.setSession({
            refresh_token: refreshToken.value,
            access_token: accessToken.value,
        });
        if (session.error) {
            return null;
        }
        return session;
    } catch (error) {
        return null;
    }
}