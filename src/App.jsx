import "./App.css";
import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import {ROLES} from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
	useTitle("Dan D. Repairs");
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				<Route element={<PersistLogin />}>
					<Route
						element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
					>
						<Route element={<Prefetch />}>
							<Route path="dash" element={<DashLayout />}>
								<Route index element={<Welcome />} />

								<Route path="notes">
									<Route index element={<NotesList />} />
									<Route path="new" element={<NewNote />} />
									<Route path=":id" element={<EditNote />} />
								</Route>
								<Route
									element={
										<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
									}
								>
									<Route path="users">
										<Route index element={<UsersList />} />
										<Route path="new" element={<NewUserForm />} />
										<Route path=":id" element={<EditUser />} />
									</Route>
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
