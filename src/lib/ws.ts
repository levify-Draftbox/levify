import useListState from "@/store/listState";

const WsUrl = window.location.hostname !== "localhost"
    ? "ws://localhost:5057"
    : "wss://ws.dev.rellitel.ink"

let ws: WebSocket | undefined = undefined

export function connectWS() {
    if (ws) return
    try {
        const token = localStorage.getItem("token") as string;
        const { setAllUnreadCount } = useListState.getState()

        ws = new WebSocket(WsUrl, token)
        ws.onopen = () => {

        }
        ws.onclose = (e) => {
            console.log("close", e.code);
        }
        ws.onmessage = (m) => {
            const e = JSON.parse(m.data)
            switch (e.event) {
                case "unread":
                    unReadFunc(e.data)
                    break
                case "notify":
                    notifyFunc(e.data)
                    break
                case "unread_count":
                    setAllUnreadCount(e.data);
                    break
                default:
                    break
            }
        }
    } catch (e) {
        console.log("error on ws", e);
    }
}

let unReadFunc: (_: any) => void = () => console.log("unread event");
export function setUnReadFunc(func: (_: any) => void) {
    unReadFunc = func
}

let notifyFunc: (_: any) => void = () => console.log("notify");
export function setNotifyFunc(func: (_: any) => void) {
    notifyFunc = func
}

export function sendToWs(data: string) {
    ws?.send(data)
}