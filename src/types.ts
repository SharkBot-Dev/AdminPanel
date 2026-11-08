import type { Response, Request } from "express"

export type SidebarItem = {
    title: string // 追加するアイテムのリンク名
    link: string // 追加するアイテムのリンクURL
}

export type Widget = {
    title: string // ウィジェットの名前
    htmlPath: string // ウィジェットの表示するHTML名
}

export type APIPathFunc = (req: Request, res: Response<any, Record<string, any>>) => void;

export type APIPath = {
    path: string // APIのパス
    method: string // GETやPOSTなど
    func: APIPathFunc // APIアクセス時に実行される関数
}