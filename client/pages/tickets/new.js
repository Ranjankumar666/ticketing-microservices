import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

export default function NewTicket() {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const onBlur = () => {
        const value = parseFloat(price).toFixed(2);
        if (isNaN(value)) return;
        setPrice(value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            title,
            price,
        };

        console.log(data);
        sendRequest();
    };
    const { sendRequest, errors } = useRequest({
        url: "/api/tickets",
        method: "POST",
        onSuccess() {
            Router.push("/");
        },
        data: {
            title,
            price,
        },
    });
    return (
        <div className="d-flex align-items-center justify-content-center w-100 p-3 flex-column">
            <form className="w-50" onSubmit={onSubmit}>
                <h4 className="text-center">Create A New Ticket</h4>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        name="title"
                        className="form-control"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        className="form-control"
                        placeholder="Enter Price"
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        min="0"
                    />
                </div>
                <div className="mt-4">
                    <button className="btn btn-primary">Submit</button>
                </div>
                {errors}
            </form>
        </div>
    );
}
