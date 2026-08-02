import { useEffect } from "react";
import api from "../services/api";

function Test() {

    useEffect(() => {

        console.log(api);

    }, []);

    return <h1>Testing Axios</h1>;
}

export default Test;