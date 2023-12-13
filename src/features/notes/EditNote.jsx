import {useParams} from "react-router-dom";
import {useGetNotesQuery} from "./notesApiSlice";
import EditNoteForm from "./EditNoteForm";
import {PulseLoader} from "react-spinners";
import useTitle from "../../hooks/useTitle";
import {useGetUsersQuery} from "../users/usersApiSlice";

const EditNote = () => {
	useTitle("techNotes - EditNote");
	const {id} = useParams();

	const {username, isManager, isAdmin} = useAuth();

	const {note} = useGetNotesQuery("noteList", {
		selectFromResult: ({data}) => ({
			note: data.entities[id],
		}),
	});

	const {users} = useGetUsersQuery("userList", {
		selectFromResult: ({data}) => ({
			users: data?.ids.map((id) => data?.entities[id]),
		}),
	});

	if (!note || !users?.length) return <PulseLoader color={"#FFF"} />;

	if (!isManager && !isAdmin) {
		if (note.username !== username) {
			return <p className="errmsg">No accesss</p>;
		}
	}
	const content = <EditNoteForm note={note} users={users} />;

	return content;
};

export default EditNote;
