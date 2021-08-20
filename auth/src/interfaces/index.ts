export interface ErrorResponse {
	message: string;
	field?: string;
}

export interface CurrentUser {
	[key: string]: string;
	email: string;
	id: string;
}
