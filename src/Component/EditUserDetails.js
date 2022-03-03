import React from "react";
import { VscSaveAs } from "react-icons/vsc";
import { FcCancel } from "react-icons/fc";

// editing user details
function EditUserDetails(props) {
	const { editedUserDetails, onChangeUserFormDetails, cancelEditUserDetails } =
		props;
	return (
		<tr>
			<td>
				<input type='checkbox' />
			</td>
			<td>
				{/* read user edit details */}
				<input
					type='text'
					required='*required'
					placeholder='Enter a name...'
					name='name'
					value={editedUserDetails.name}
					onChange={onChangeUserFormDetails}
				/>
			</td>
			<td>
				{/* read user edit details */}
				<input
					type='email'
					required='*required'
					placeholder='Enter an email...'
					name='email'
					value={editedUserDetails.email}
					onChange={onChangeUserFormDetails}
				/>
			</td>
			<td>
				{/* read user edit details */}
				<input
					type='text'
					required='*required'
					placeholder='Enter a role...'
					name='role'
					value={editedUserDetails.role}
					onChange={onChangeUserFormDetails}
				/>
			</td>
			<td>
				{/* button to save the edited details */}
				<button type='submit'>
					<VscSaveAs />
				</button>

				{/* button to cancel the editing without saving the details */}
				<button type='button' onClick={cancelEditUserDetails}>
					<FcCancel />
				</button>
			</td>
		</tr>
	);
}

export default EditUserDetails;
