import { useState, useEffect } from "react";
import axios from "axios";
// import Router from "next/router";
import Link from "next/link";

export default function Home({ currentUser }) {
    const [tickets, setTickets] = useState([]);
    // console.log(currentUser);
    // const response = await axios.get("/api/users/currentuser");
    useEffect(() => {
        const getTickets = async () => {
            const { data } = await axios.get("/api/tickets");
            setTickets(data);
        };

        getTickets();
    }, [currentUser]);

    const ticketList =
        tickets.length > 0 &&
        tickets.map((ticket) => (
            <Link href={`/tickets/${ticket.id}`} key={ticket.id}>
                <tr>
                    <td>{ticket.title}</td>
                    <td>{ticket.price}</td>
                    <td>
                        <Link
                            href="/tickets/[ticketId]"
                            as={`/tickets/${ticket.id}`}
                        >
                            <a className="link-primary">Visit</a>
                        </Link>
                    </td>
                </tr>
            </Link>
        ));

    return (
        <div className="container center">
            <h1 className="m-2">Tickets Available</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price in Rs</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </table>
        </div>
    );
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req }) {
    return {
        props: {},
    };
}
