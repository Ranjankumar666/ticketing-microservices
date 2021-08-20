import useRequest from "../../hooks/useRequest";
import { useEffect, useState } from "react";

export default function Orders({}) {
    const [orders, setOrders] = useState([]);

    const { errors, sendRequest } = useRequest({
        url: "/api/orders/",
        method: "GET",
        onSuccess(orders) {
            console.log(orders);
            setOrders(orders);
        },
    });

    useEffect(() => {
        sendRequest();
    }, []);
    const body =
        orders.length > 0 &&
        orders.map((order) => (
            <tbody key={order.id}>
                <tr>
                    <td>{order.id}</td>
                    <td>{order.ticket.title}</td>
                    <td>{order.status}</td>
                    <td>{order.ticket.price}</td>
                </tr>
            </tbody>
        ));
    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Ticket</th>
                        <th>Status</th>
                        <th>Price in Rs</th>
                    </tr>
                </thead>
                {body}
            </table>
        </div>
    );
}
