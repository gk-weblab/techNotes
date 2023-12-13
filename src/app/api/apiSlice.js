import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {setCredentials} from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:3500",
	credentials: "include",
	prepareHeaders: (headers, {getState}) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
	},
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status === 403) {
		console.log("sending refresh token");

		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			api.dispatch(setCredentials({...refreshResult.data}));
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403)
				result.error.data.message = "Your login expired!";
		}
	}
	return result;
};
export const apiSlice = createApi({
	baseQuery: baseQueryWithReAuth,
	tagTypes: ["Notes", "User"],
	endpoints: (builder) => ({}),
});
