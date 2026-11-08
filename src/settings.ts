import fs from "fs";

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let setting: any;

export async function loadSetting() {
    const jsonStr = fs.readFileSync(path.join(__dirname, '../', 'config.json'), 'utf-8');
    setting = JSON.parse(jsonStr);

    console.log("設定をロードしました。")

    return setting;
}