import { sidebars } from "./sidebar.js";
import { widgets } from "./widget.js";

import type { Express } from "express";

export async function loadPlugin(plugin: any, express: Express) {
    for (const sidebar of plugin.addSidebarItems) {
        sidebars.push(sidebar as any)
    }
    for (const widget of plugin.addWidget) {
        widgets.push(widget)
    }
    for (const APIPath of plugin.addAPIPath) {
        if ((APIPath.method as string).toUpperCase() == "GET") {
            express.get(APIPath.path, APIPath.func)
        }
    }
}