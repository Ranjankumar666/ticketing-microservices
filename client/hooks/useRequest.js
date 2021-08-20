import axios from "axios";
import { useState } from "react";

export default function useRequest({ url, method, data = {}, onSuccess }) {
    const [errors, setErrors] = useState(null);

    const sendRequest = async (extraData = {}) => {
        try {
            setErrors(null);
            const res = await axios({
                method,
                url,
                data: {
                    ...data,
                    ...extraData,
                },
            });

            onSuccess && onSuccess(res.data);
            return res.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger mt-5">
                    <h4>Ooops....</h4>
                    <ul className="my=0">
                        {err.response.data.errors.map((err) => (
                            <li key={err.field}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
            throw err;
        }
    };

    return { sendRequest, errors };
}
