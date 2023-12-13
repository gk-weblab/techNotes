import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

import {memo} from "react";
import {useGetUsersQuery} from "./usersApiSlice";

const User = ({userId}) => {
	const user = useGetUsersQuery("userList", {
		selectFromResult: ({data}) => ({
			user: data?.entities[userId],
		}),
	});
	const navigate = useNavigate();

	if (user) {
		const handleEdit = () => navigate(`/dash/users/${userId}`);
		const userRolesString = user.roles.toString().replaceAll(",", ", "); //add comma and a space in place of just comma.
		const cellStatus = user.active ? "" : "table_cell--inactive";
		const cellClass = `table__cell ${cellStatus}`;
		return (
			<tr className="table__row user">
				<td className={cellClass}>{user.username}</td>
				<td className={cellClass}>{userRolesString}</td>
				<td className={cellClass}>
					<button className="icon-button table__button" onClick={handleEdit}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</td>
			</tr>
		);
	} else return null;
};
const memoizedUser = memo(User);
export default User;
