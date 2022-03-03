import React from "react";
import EditUserDetails from "../EditUserDetails";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import "./index.css";

function UserList(props) {
	const {
		editUserDataId,
		editedUserDetails,
		userDetails,
		onClickEditUserDetails,
		onClickDeleteUserDetails,
		handleCheckInput,
		onChangeUserFormDetails,
		cancelEditUserDetails,
	} = props;
	return (
		<>
			{editUserDataId === userDetails.id ? (
				<EditUserDetails
					key={userDetails.id}
					editedUserDetails={editedUserDetails}
					onChangeUserFormDetails={onChangeUserFormDetails}
					cancelEditUserDetails={cancelEditUserDetails}
				/>
			) : (
				<>
					<tr htmlFor={userDetails.id}>
						<td className='check-box-input-field'>
							<input
								type='checkbox'
								id={userDetails.id}
								value={userDetails.id}
								checked={userDetails.checked}
								onChange={(e) => {
									handleCheckInput(e);
								}}
								className=''
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
				</>
			)}
		</>
	);
}

export default UserList;
