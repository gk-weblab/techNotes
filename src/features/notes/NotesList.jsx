import {useGetNotesQuery} from "./notesApiSlice";
import Note from "./Note";
import {selectCurrentToken} from "../auth/authSlice";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import useAuth from "../../hooks/useAuth";
import {PulseLoader} from "react-spinners";
import useTitle from "../../hooks/useTitle";

const NotesList = () => {
	useTitle("techNotes - NoteList");
	const {username, isAdmin, isManager} = useAuth();
	const token = useSelector(selectCurrentToken);
	const [pollingInterval, setPollingInterval] = useState(15000);
	const {
		data: notes,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetNotesQuery("noteList", {
		pollingInterval,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	//User has logged out but component is still mounted
	useEffect(() => {
		if (!token) setPollingInterval(0);
	}, [token]);

	let content;
	if (isLoading) {
		content = <PulseLoader color={"#FFF"} />;
	}

	if (isError) {
		content = <p className="errmsg">{error?.data?.message}</p>;
	}
	if (isSuccess) {
		const {ids, entities} = notes;
		let filteredIds;
		if (isManager || isAdmin) {
			filteredIds = [...ids];
		} else {
			filteredIds = ids.filter(
				(noteId) => entities[noteId].username === username
			);
		}
		console.log(filteredIds, username);
		const tableContent =
			ids?.length &&
			filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

		content = (
			<table className="table table--notes">
				<thead className="table__thead">
					<tr>
						<th scope="col" className="table__thnote__status">
							UserName
						</th>
						<th scope="col" className="table__thnote__created">
							Created
						</th>
						<th scope="col" className="table__thnote__updated">
							Update
						</th>
						<th scope="col" className="table__thnote__title">
							Title
						</th>
						<th scope="col" className="table__thnote__username">
							Owner
						</th>
						<th scope="col" className="table__thnote__edit">
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

export default NotesList;
