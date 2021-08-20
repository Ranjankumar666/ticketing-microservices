import Router from "next/router";
import { useState, useEffect } from "react";
import serverAxios from "../../helpers/serverAxios";
import useRequest from "../../hooks/useRequest";
import StripeCheckout from "react-stripe-checkout";
const PUB_KEY =
    "pk_test_51HdAgvHBydmXHswIhlce7xesful7zX8cesHWOFtoklp3AaSTVhoDc7a88v4eA8HBXMxBosx709ZtTSCwygxEDxQE00crw6Szv2";

const useTimer = (start) => {
    const [timeLeft, setTimeLeft] = useState(new Date(start) - new Date());

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (timeLeft <= 0) {
                clearInterval(timerId);
                return;
            }

            setTimeLeft(new Date(start) - new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [timeLeft]);

    return [Math.round(timeLeft / 1000)];
};

export default function Order({ order, currentUser }) {
    const [timeLeft] = useTimer(order.expiresAt);
    const { errors, sendRequest } = useRequest({
        url: "/api/payments",
        method: "POST",
        data: {
            orderId: order.id,
        },
        onSuccess() {
            Router.replace("/orders");
        },
    });

    const onToken = async (token) => {
        await sendRequest({
            token: token.id,
        });
    };

    return (
        <>
            <div className="container">
                <h2 className="m-2">Order Details</h2>
                <div className="">
                    <h1>{order.id}</h1>
                    <h3>
                        {timeLeft <= 0
                            ? "Sorry! Order has expired"
                            : `You have ${timeLeft}s left`}
                    </h3>

                    {timeLeft > 0 && (
                        <StripeCheckout
                            token={onToken}
                            stripeKey={PUB_KEY}
                            amount={order.ticket.price * 100}
                            email={currentUser.email}
                            currency="INR"
                        >
                            <button className="btn btn-primary">
                                Purchase
                            </button>
                        </StripeCheckout>
                    )}
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
        const { data } = await axios.get(`/api/orders/${params.orderId}`);
        return {
            props: {
                order: data,
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
