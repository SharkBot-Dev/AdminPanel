import express from "express"
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import cookieParser from "cookie-parser";
import { getSession, getSessionNoLog, logoutSession, setSession } from "./sessions.js";
import { loadSetting, setting } from "./settings.js";
import { loadPlugin } from "./plugins.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

loadSetting();

const app = express();
const port = Number(process.env.PORT);

app.use(express.json());
app.use(cookieParser());

fs.readdirSync(path.join(__dirname, 'plugins')).forEach(async (file) => {
    if (path.extname(file) === '.js') {
        const filePath = path.join(path.join(__dirname, 'plugins'), file);
        const module = await import(filePath);

        await loadPlugin(module, app);
        
        console.log(`${file} プラグインを読み込みました。`, module);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

app.get('/panel', async (req, res) => {
    if (!req.ip || !req.get('User-Agent')) {
        res.json({
            status: "error",
            error: "不明なIP。"
        })
        return;
    }

    const session = await getSession(req.cookies.session, req.ip, req.get('User-Agent') as string)

    if (!session) {
        res.redirect("/");
        return;
    }

    res.sendFile(path.join(__dirname, '../views', 'panel.html'));
})

app.get('/api/user/profile', async (req, res) => {
    if (!req.ip || !req.get('User-Agent')) {
        res.json({
            status: "error",
            error: "不明なIP。"
        })
        return;
    }

    const session = await getSessionNoLog(req.cookies.session, req.ip, req.get('User-Agent') as string)
    if (!session) {
        res.json({
            status: "error",
            error: "セッションが無効です。"
        })
        return;
    }

    res.json({
        username: session.username
    })
});

app.get('/api/panel/setting', async (req, res) => {
    if (!req.ip || !req.get('User-Agent')) {
        res.json({
            status: "error",
            error: "不明なIP。"
        })
        return;
    }

    const session = await getSessionNoLog(req.cookies.session, req.ip, req.get('User-Agent') as string)
    if (!session) {
        res.json({
            status: "error",
            error: "セッションが無効です。"
        })
        return;
    }

    res.json({
        title: setting.title,
        sidebar: setting.sidebar
    })
});

app.get('/api/auth/logout', async (req, res) => {
    if (!req.ip || !req.get('User-Agent')) {
        res.json({
            status: "error",
            error: "不明なIP。"
        })
        return;
    }

    const session = await getSession(req.cookies.session, req.ip, req.get('User-Agent') as string)
    if (!session) {
        res.json({
            status: "error",
            error: "セッションが無効です。"
        })
        return;
    }

    const logoutedSession = await logoutSession(req.cookies.session, req.ip, req.get('User-Agent') as string);
    if (!logoutedSession) {
        res.json({
            status: "error",
            error: "ログアウトに失敗しました。"
        })
        return;
    }

    res.redirect("/");
    return;
});

app.post('/api/auth/login', async (req, res) => {
    const receivedData = req.body;
    if (receivedData.username != process.env.ADMIN_USERNAME) {
        res.json({
            status: "error",
            error: "ユーザー名またはパスワードが違います。"
        })
        return;
    }
    if (receivedData.password != process.env.ADMIN_PASSWORD) {
        res.json({
            status: "error",
            error: "ユーザー名またはパスワードが違います。"
        })
        return;
    }
    if (!req.ip || !req.get('User-Agent')) {
        res.json({
            status: "error",
            error: "不明なIP。"
        })
        return;
    }

    console.log(`[${req.ip}] ログインが行われました。`)
    console.log(`[${req.ip}] ${req.get('User-Agent')}`)

    const session = await setSession(req.ip, req.get('User-Agent') as string, receivedData.username);

    res.cookie('session', session, {
        maxAge: 3600000, 
        httpOnly: true
    });

    res.json({
        status: "ok"
    })
});

app.listen(port, () => {
    console.log(`AdminPanel listening on port ${port}!`);
});