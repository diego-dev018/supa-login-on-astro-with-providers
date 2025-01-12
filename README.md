# Inicio de sesion para Astro con Supabase y Providers

Aprende a crear un sistema de inicio de sesión con Astro, Supabase y Providers. En este repositorio encontrarás el código fuente de la aplicación de ejemplo.

**Se usara:**
- Astro
- Supabase

## Crear un nuevo proyecto en Astro

```bash
npm create astro@latest
cd [nombre-del-proyecto]
```

## Instalar dependencias

```bash
npm install @supabase/supabase-js
```

## Configurar Supabase

1. Crear una cuenta en [Supabase](https://supabase.io/).
2. Crear un nuevo proyecto.
3. Copiar las credenciales de tu proyecto.

## Crear un archivo `.env` en la raíz del proyecto

```env
SUPABASE_URL=[URL]
SUPABASE_ANON_KEY=[KEY]
```

## Crear un archivo `env.d.ts` en src

```ts
interface ImportMetaEnv {
    readonly SUPABASE_URL: string
    readonly SUPABASE_ANON_KEY: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
```

## Crear un archivo `supabase.ts` en src

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
        auth: {
            flowType: "pkce",
        },
    },
);
```

## Crear un archivo `signin.ts` en src/pages/api/auth

```ts
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
```

## Crear un archivo `callback.ts` en src/pages/api/auth

```ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const authCode = url.searchParams.get("code");

    if (!authCode) {
        return new Response("No code provided", { status: 400 });
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    const { access_token, refresh_token } = data.session;

    cookies.set("sb-access-token", access_token, {
        path: "/",
    });
    cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
    });

    return redirect("/dashboard");
};
```

## Crea el boton de inicio de sesion de tu proyecto

```astro
<form action="/api/auth/signin" method="post">
    <button value="github" name="provider" type="submit">Sign in with GitHub</button>
</form>
```

## En tu proyecto de Supabase, agrega la URL de redireccionamiento

1. Ve a tu proyecto de Supabase.
2. Ve a la sección de autenticación.
3. Agrega la URL de redireccionamiento: `http://localhost:4321/` para local o el del dominio.
