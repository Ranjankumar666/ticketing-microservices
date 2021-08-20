import Router from "next/router";
import serverAxios from "../../helpers/serverAxios";
import useRequest from "../../hooks/useRequest";

export default function Ticket({ ticket }) {
    const { errors, sendRequest } = useRequest({
        url: "/api/orders",
        data: {
            ticketId: ticket.id,
        },
        method: "POST",
        onSuccess(data) {
            Router.push("/orders/[orderId]", `/orders/${data.id}`);
        },
    });
    const buyTicket = async () => {
        sendRequest();
    };
    return (
        <>
            <div className="container">
                <h2>Ticket Details</h2>
                <div className="">
                    <h1>{ticket.title}</h1>
                    <h3>{ticket.price}</h3>

                    <button className="btn btn-primary" onClick={buyTicket}>
                        Buy Now
                    </button>
                </div>
                {errors}
            </div>
        </>
    );
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req }) {
    const axios = serverAxios(req);
    try {
        const { data } = await axios.get(`/api/tickets/${params.ticketId}`);
        return {
            props: {
                ticket: data,
            },
        };
    } catch (error) {
        return {
            props: {},
            redirect: {
                destination: "/404",
            },
        };
    }
}
