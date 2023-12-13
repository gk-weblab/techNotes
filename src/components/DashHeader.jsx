import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
	faRightFromBracket,
	faFileCirclePlus,
	faFilePen,
	faUserGear,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {useSendLogoutMutation} from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
	const {isManager, isAdmin} = useAuth();

	const navigate = useNavigate();
	const {pathname} = useLocation();

	const [sendLogout, {isLoading, isSuccess, isError, error}] =
		useSendLogoutMutation();

	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess, navigate]);

	const onLogoutClicked = () => sendLogout();

	const onNewNoteClicked = () => navigate("/dash/notes/new");
	const onNotesClicked = () => navigate("/dash/notes");
	const onNewUserClicked = () => navigate("/dash/users/new");
	const onUsersClicked = () => navigate("/dash/users");

	let dashClass = null;
	if (
		!DASH_REGEX.test(pathname) &&
		!NOTES_REGEX.test(pathname) &&
		!USERS_REGEX.test(pathname)
	) {
		dashClass = "dash-header__container--small";
	}
	let newNoteButton = null;
	if (NOTES_REGEX.test(pathname)) {
		newNoteButton = (
			<button
				className="icon-button"
				title="New Note"
				onClick={onNewNoteClicked}
			>
				<FontAwesomeIcon icon={faFileCirclePlus} />
			</button>
		);
	}
	let notesButton = null;
	if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
		notesButton = (
			<button className="icon-button" title="Notes" onClick={onNotesClicked}>
				<FontAwesomeIcon icon={faFilePen} />
			</button>
		);
	}
	let newUserButton = null;
	if (USERS_REGEX.test(pathname)) {
		newUserButton = (
			<button
				className="icon-button"
				title="New User"
				onClick={onNewUserClicked}
			>
				<FontAwesomeIcon icon={faUserPlus} />
			</button>
		);
	}
	let usersButton = null;
	if (isAdmin || isManager) {
		if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
			usersButton = (
				<button className="icon-button" title="Users" onClick={onUsersClicked}>
					<FontAwesomeIcon icon={faUserGear} />
				</button>
			);
		}
	}
	const logoutButton = (
		<button className="icon-buttom" title="Logout" onClick={onLogoutClicked}>
			<FontAwesomeIcon icon={faRightFromBracket} />
		</button>
	);
	const errClass = isError ? "errmsg" : "offscreen";

	let buttonContent;
	if (isLoading) {
		buttonContent = <p>Loading..</p>;
	} else {
		buttonContent = (
			<>
				{newNoteButton}
				{newUserButton}
				{notesButton}
				{usersButton}
			</>
		);
	}
	const content = (
		<>
			<p className={errClass}>{isError ? error?.data?.message : ""}</p>
			<header className="dash-header">
				<div className={`dash-header__container  ${dashClass}`}>
					<Link to="/dash">
						<h1 className="dash-header__title">techNotes</h1>
					</Link>
					<nav className="dash-header__nav">
						{buttonContent}
						{logoutButton}
					</nav>
				</div>
			</header>
		</>
	);

	return content;
};
export default DashHeader;
