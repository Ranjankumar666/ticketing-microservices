import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default function SignUp() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { errors, sendRequest } = useRequest({
		method: 'POST',
		url: '/api/users/signup',
		data: {
			email,
			password,
		},
		onSuccess() {
			Router.push('/');
		},
	});
	const emailHandler = (e) => {
		const { value } = e.target;
		setEmail(value);
	};

	const passwordHandler = (e) => {
		const { value } = e.target;
		setPassword(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		await sendRequest();
	};

	return (
		<div className="d-flex align-items-center justify-content-center w-100 p-3 flex-column">
			<form onSubmit={onSubmit} className="w-50">
				<h4 className="text-center">Sign Up</h4>
				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						name="email"
						className="form-control"
						placeholder="Enter Email"
						onChange={emailHandler}
						value={email}
					/>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						name="password"
						className="form-control"
						placeholder="Enter Password"
						onChange={passwordHandler}
						value={password}
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
