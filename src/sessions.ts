import { randomBytes } from "crypto";

type Session = {
    ip: string,
    userAgents: string,
    username: string
}
export var sessions: Record<string, Session> = {}

function generateSessionKey(byteLength = 32) {
    return randomBytes(byteLength).toString('hex');
}

export async function setSession(ipAddr: string, userAgents: string, username: string) {
    const key = generateSessionKey(32);

    sessions[key] = {
        ip: ipAddr,
        userAgents: userAgents,
        username: username
    }

    return key;
}

export async function getSession(sessionKey: string, ipAddr: string, userAgents: string) {
    if (!(sessionKey in sessions)) {
        return null
    };

    const session = sessions[sessionKey];
    if (!session) return null;

    if (session.ip != ipAddr) {
        console.log(`[${ipAddr}] 違うIPからのアクセスが試みられました。`);
        return null;
    }

    if (session.userAgents != userAgents) {
        console.log(`[${ipAddr}] 違うブラウザからのアクセスが試みられました。`);
        return null;
    }

    return session
}

export async function getSessionNoLog(sessionKey: string, ipAddr: string, userAgents: string) {
    if (!(sessionKey in sessions)) {
        return null
    };

    const session = sessions[sessionKey];
    if (!session) return null;

    if (session.ip != ipAddr) {
        return null;
    }

    if (session.userAgents != userAgents) {
        return null;
    }

    return session
}

export async function logoutSession(sessionKey: string, ipAddr: string, userAgents: string) {
    if (!(sessionKey in sessions)) {
        return null
    };

    const session = sessions[sessionKey];
    if (!session) return false;

    if (session.ip != ipAddr) {
        console.log(`[${ipAddr}] 違うIPからのアクセスが試みられました。`);
        return false;
    }

    if (session.userAgents != userAgents) {
        console.log(`[${ipAddr}] 違うブラウザからのアクセスが試みられました。`);
        return false;
    }

    delete sessions[sessionKey]
    return true; 
}