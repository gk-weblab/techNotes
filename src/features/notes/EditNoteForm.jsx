import {useState, useEffect} from "react";
import {useUpdateNoteMutation, useDeleteNoteMutation} from "./notesApiSlice";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({note, users}) => {
	const {isAdmin, isManager} = useAuth();
	console.log("USERs", users);
	const [updateNote, {isLoading, isSuccess, isError, error}] =
		useUpdateNoteMutation();

	const [
		deleteNote,
		{isSuccess: isDelSuccess, isError: isDelError, error: delerror},
	] = useDeleteNoteMutation();

	const navigate = useNavigate();

	const [title, setTitle] = useState(note.title);
	const [text, setText] = useState(note.text);
	const [user, setUser] = useState(note.user);
	const [completed, setCompleted] = useState(note.completed);

	useEffect(() => {
		console.log(isSuccess);
		if (isSuccess || isDelSuccess) {
			setTitle("");
			setText("");
			setUser("");
			navigate("/dash/notes");
		}
	}, [isSuccess, isDelSuccess, navigate]);

	const onTitleChanged = (e) => setTitle(e.target.value);
	const onTextChanged = (e) => setText(e.target.value);
	const onUserChanged = (e) => setUser(e.target.value);
	const onCompletedChanged = () => setCompleted((prev) => !prev);

	let canSave = [user, text, title].every(Boolean) && !isLoading;
	const onSaveNoteClicked = async (e) => {
		if (canSave) {
			await updateNote({id: note.id, title, text, user, completed});
		}
	};

	const onDeleteNoteClicked = async () => {
		await deleteNote({id: note.id});
	};

	const created = new Date(note.createdAt).toLocaleString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
	const updated = new Date(note.updatedAt).toLocaleString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});

	const options = users.map((usr) => {
		return (
			<option key={usr.id} value={usr.id}>
				{usr.username}
			</option>
		);
	});
	const errClass = isError || isDelError ? "errmsg" : "offscreen";
	const validTitleClass = !title ? "form__input--incomplete" : "";
	const validTextClass = !text ? "form__input--incomplete" : "";

	const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

	const content = (
		<>
			<p className={errClass}>{errContent}</p>

			<form className="form" onSubmit={(e) => e.preventDefault()}>
				<div className="form__title-row">
					<h2>Edit Note</h2>
					<div className="form__action-buttons">
						<button
							className="icon-button"
							title="Save"
							onClick={onSaveNoteClicked}
							disabled={!canSave}
						>
							<FontAwesomeIcon icon={faSave} />
						</button>
						{(isAdmin || isManager) && (
							<button
								className="icon-button"
								title="Delete"
								onClick={onDeleteNoteClicked}
							>
								<FontAwesomeIcon icon={faTrashCan} />
							</button>
						)}
					</div>
				</div>
				<label className="form__label" htmlFor="title">
					Title:
				</label>
				<input
					className={`form__input ${validTitleClass}`}
					id="title"
					name="title"
					type="text"
					autoComplete="off"
					value={title}
					onChange={onTitleChanged}
				/>

				<label className="form__label" htmlFor="text">
					Text:
				</label>
				<input
					className={`form__input ${validTextClass}`}
					id="text"
					name="text"
					type="text"
					value={text}
					onChange={onTextChanged}
				/>

				<label
					className="form__label form__checkbox-container"
					htmlFor="note-completed"
				>
					WORK COMPLETE:
					<input
						className="form__checkbox"
						id="note-completed"
						name="note-completed"
						type="checkbox"
						checked={completed}
						onChange={onCompletedChanged}
					/>
				</label>

				<label className="form__label" htmlFor="user">
					ASSIGNED USER:
				</label>
				<select
					id="user"
					name="user"
					className={`form__select `}
					value={user}
					onChange={onUserChanged}
				>
					{options}
				</select>
				<div className="form__divider">
					<p className="form__created">
						Created:
						<br />
						{created}
					</p>
					<p className="form__updated">
						Updated:
						<br />
						{updated}
					</p>
				</div>
			</form>
		</>
	);

	return content;
};
export default EditNoteForm;
