import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";
import serverAxios from "../../helpers/serverAxios";

export default function SignOut() {
    const { sendRequest } = useRequest({
        method: "POST",
        url: "/api/users/signout",
        onSuccess() {
            Router.replace("/");
        },
    });
    useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    return <div className="container center">Signing you out......</div>;
}
