import {useState, useEffect} from "react";
import {useAddNewNoteMutation} from "./notesApiSlice";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";

const EditNoteForm = ({users}) => {
	const [addNewNote, {isLoading, isSuccess, isError, error}] =
		useAddNewNoteMutation();

	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [user, setUser] = useState(users[0].id);

	useEffect(() => {
		console.log(isSuccess);
		if (isSuccess) {
			setTitle("");
			setText("");
			setUser("");
			navigate("/dash/notes");
		}
	}, [isSuccess, navigate]);

	const onTitleChanged = (e) => setTitle(e.target.value);
	const onTextChanged = (e) => setText(e.target.value);
	const onUserChanged = (e) => setUser(e.target.value);

	let canSave = [title, text, user].every(Boolean) && !isLoading;

	const onSaveNoteClicked = async (e) => {
		e.preventDefault();
		if (canSave) {
			await addNewNote({title, text, user});
		}
	};

	const options = users.map((usr) => {
		return (
			<option key={usr.id} value={usr.id}>
				{usr.username}
			</option>
		);
	});

	const errClass = isError ? "errmsg" : "offscreen";

	const errContent = error?.data?.message ?? "";
	const validTitleClass = !title ? "form__input--incomplete" : "";
	const validTextClass = !text ? "form__input--incomplete" : "";

	const content = (
		<>
			<p className={errClass}>{errContent}</p>

			<form className="form" onSubmit={(e) => e.preventDefault()}>
				<div className="form__title-row">
					<h2>Add New Note</h2>
					<div className="form__action-buttons">
						<button
							className="icon-button"
							title="Save"
							onClick={onSaveNoteClicked}
							disabled={!canSave}
						>
							<FontAwesomeIcon icon={faSave} />
						</button>
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
			</form>
		</>
	);

	return content;
};
export default EditNoteForm;
