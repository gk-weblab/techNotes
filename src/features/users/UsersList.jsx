import {useGetUsersQuery} from "./usersApiSlice";
import User from "./User";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../auth/authSlice";
import {PulseLoader} from "react-spinners";

const UsersList = () => {
	useTitle("techNotes - UsersList");
	const token = useSelector(selectCurrentToken);
	const [pollingInterval, setPollingInterval] = useState(60000);
	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUsersQuery(undefined, {
		pollingInterval,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});
	useEffect(() => {
		if (!token) setPollingInterval(0);
	}, [token]);

	let content;

	if (isLoading) content = <PulseLoader color={"#FFF"} />;

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	}

	if (isSuccess) {
		const {ids} = users;

		const tableContent =
			ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

		content = (
			<table className="table table--users">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__th user__username">
							Username
						</th>
						<th scope="col" className="table__th user__roles">
							Roles
						</th>
						<th scope="col" className="table__th user__edit">
							Edit
						</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}

	return content;
};
export default UsersList;
