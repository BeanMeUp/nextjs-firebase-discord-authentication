export const getDiscordAuthUrl = () => {
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENTID!,
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
        response_type: "code",
        scope: "identify",
    });

    return `https://discord.com/api/oauth2/authorize?${params}`;
};

export const exchangeCodeForToken = async (code: string) => {
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENTID!,
        client_secret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
        code,
        scope: "identify",
    });

    let access_token: string = "";

    try {
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const data = await response.json();
        access_token = data.access_token;

        return access_token;
    } catch (error) {
        console.error("Error exchanging code for access token:", error);
    }
};
