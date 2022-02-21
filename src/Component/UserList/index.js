import React from "react";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import "./index.css";

function UserList(props) {
	const {
		userDetails,
		onClickEditUserDetails,
		onClickDeleteUserDetails,
		handleCheckInput,
		isChecked,
	} = props;
	return (
		<tr htmlFor={userDetails.id}>
			<td>
				<input
					type='checkbox'
					id={userDetails.id}
					value={userDetails.id}
					checked={isChecked}
					onChange={(e) => {
						handleCheckInput(userDetails.id, e);
					}}
				/>
			</td>
			<td>{userDetails.name}</td>
			<td>{userDetails.email}</td>
			<td>{userDetails.role}</td>
			<td>
				<div>
					<button
						type='button'
						onClick={() => {
							onClickEditUserDetails(userDetails);
						}}
					>
						<FiEdit />
					</button>
					<button
						type='button'
						onClick={() => {
							onClickDeleteUserDetails(userDetails.id);
						}}
					>
						<AiOutlineDelete style={{ color: "red" }} />
					</button>
				</div>
			</td>
		</tr>
	);
}

export default UserList;
