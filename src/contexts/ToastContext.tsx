import { createContext } from "react";

export interface ToastContextProps{
    openSuccess: (message: string) => void;
    openError: (message: string) => void;
}
const ToastContext = createContext<ToastContextProps>({
    openSuccess: (message)=> console.log(message),
    openError: (message)=> console.log(message)
})

export default ToastContext;