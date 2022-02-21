import React from "react";
import { VscSaveAs } from "react-icons/vsc";
import { FcCancel } from "react-icons/fc";

function EditUserDetails(props) {
	const { userDetails, onChangeUserFormDetails, cancelEditUserDetails } =
		props;
	return (
		<tr>
			<td>
				<input type='checkbox' />
			</td>
			<td>
				<input
					type='text'
					required='*required'
					placeholder='Enter a name...'
					name='name'
					value={userDetails.name}
					onChange={onChangeUserFormDetails}
				/>
			</td>
			<td>
				<input
					type='email'
					required='*required'
					placeholder='Enter an email...'
					name='email'
					value={userDetails.email}
					onChange={onChangeUserFormDetails}
				/>
			</td>
			<td>
				<input
					type='text'
					required='*required'
					placeholder='Enter a role...'
					name='role'
					value={userDetails.role}
					onChange={onChangeUserFormDetails}
				/>
			</td>
			<td>
				<button type='submit'>
					<VscSaveAs />
				</button>
				<button type='button' onClick={cancelEditUserDetails}>
					<FcCancel />
				</button>
			</td>
		</tr>
	);
}

export default EditUserDetails;
