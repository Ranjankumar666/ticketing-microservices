import axios from "axios";

/**
 *
 * @param {import('next').NextApiRequest} req
 * @returns {import('axios').AxiosInstance}
 */
const serverAxios = (req) => {
    if (typeof window === "undefined") {
        return axios.create({
            baseURL:
                "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers || undefined,
        });
    }

    return axios.create();
};

export default serverAxios;
