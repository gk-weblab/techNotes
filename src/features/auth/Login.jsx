import {useRef, useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";

import {useDispatch} from "react-redux";
import {setCredentials} from "./authSlice";
import {useLoginMutation} from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import {PulseLoader} from "react-spinners";
import useTitle from "../../hooks/useTitle";

const Login = () => {
	useTitle("techNotes - Login");
	const userRef = useRef();
	const errRef = useRef();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [persist, setPersist] = usePersist();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, {isLoading}] = useLoginMutation();

	useEffect(() => {
		userRef.current.focus();
	}, []);
	useEffect(() => {
		setErrMsg("");
	}, [username, password]);

	const handlePwdInput = (e) => setPassword(e.target.value);
	const handleUserInput = (e) => setUsername(e.target.value);
	const handleToggle = (e) => setPersist((prev) => !prev);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const {accessToken} = await login({username, password}).unwrap();
			dispatch(setCredentials({accessToken}));
			setUsername("");
			setPassword("");
			navigate("/dash");
		} catch (err) {
			if (!err.status) {
				setErrMsg("No server Response");
			} else if (err.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg(err.data?.message);
			}
			errRef.current.focus();
		}
	};

	const errClass = errMsg ? "errMsg" : "offscreen";

	if (isLoading) return <PulseLoader color={"#FFF"} />;

	const content = (
		<section className="public">
			<header>
				<h1>Employee Login</h1>
			</header>
			<main className="login">
				<p ref={errRef} className={errClass} aria-live="assertive">
					{errMsg}
				</p>
				<form onSubmit={handleSubmit} className="form">
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						className="form__input"
						id="username"
						ref={userRef}
						value={username}
						onChange={handleUserInput}
						autoComplete="off"
						required
					/>

					<label htmlFor="password">Password:</label>
					<input
						type="text"
						className="form__input"
						id="password"
						value={password}
						onChange={handlePwdInput}
						autoComplete="off"
						required
					/>
					<button className="form__submit-button">Sign In</button>
					<label htmlFor="persist" className="form_persist">
						<input
							type="checkbox"
							className="form__checkbox"
							id="persist"
							onChange={handleToggle}
							checked={persist}
						/>
						Trust This Device
					</label>
				</form>
			</main>
			<footer>
				<Link to="/">Back To Home</Link>
			</footer>
		</section>
	);
	return content;
};

export default Login;
