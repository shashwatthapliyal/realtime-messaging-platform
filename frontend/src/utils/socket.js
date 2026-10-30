import { BASE_URL } from "../assets/constants";
import { io } from "socket.io-client";


export const createSocketConnection = () => {

    if (location.hostname === "localhost") {
        return io(BASE_URL, { withCredentials: true });
    }
    else {
        return io("/", {
            path: "/api/socket.io",
            withCredentials: true
        })
    }
}