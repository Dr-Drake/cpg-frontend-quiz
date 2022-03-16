import { createContext } from "react";

const LoadingContext = createContext({
    loading: false,
    setLoading: (isLoading: boolean) => {}
});

export default LoadingContext;