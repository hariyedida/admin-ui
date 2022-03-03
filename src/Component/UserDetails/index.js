import "./index.css";

import { Component } from "react";
import UserList from "../UserList";
import Pagination from "../Pagination";

class UserDetails extends Component {
	state = {
		fetchUserList: this.props.userList,
		userList: [],
		activePage: 1,
		itemsStart: null,
		itemsEnd: null,
		searchInput: "",
		editUserDataId: null,
		updateUserData: { id: "", name: "", email: "", role: "" },
		isCheckedAllUsers: false,
		checkedUserIdDict: {},
		deletedUserItems: [],
		totalPages: null,
	};

	componentDidMount = () => {
		this.updateUIData();
	};

	// calculate total number of pages based on fetched data and page limit and store the data into state variable
	updateUIData = () => {
		const { fetchUserList, activePage } = this.state;
		const Limit = 10;
		const newItemsStart = (activePage - 1) * Limit;
		const totalPages = Math.ceil(fetchUserList.length / Limit);
		this.setState(
			{
				totalPages,
				itemsStart: newItemsStart,
				itemsEnd: newItemsStart + Limit,
				searchInput: "",
			},
			this.updatedFetchedList
		);
	};

	// load data required to render on the page
	updatedFetchedList = () => {
		const { fetchUserList, itemsStart, itemsEnd } = this.state;
		this.setState({ userList: fetchUserList.slice(itemsStart, itemsEnd) });
	};

	// filter the data based on the user search input
	filterUserList = () => {
		const { searchInput, fetchUserList } = this.state;
		let serachUserList = fetchUserList;

		serachUserList = serachUserList.filter((user) =>
			Object.values(user).some((val) =>
				JSON.stringify(val)
					.toLowerCase()
					.includes(searchInput.toLowerCase())
			)
		);

		this.setState(
			{ fetchUserList: [...serachUserList] },
			this.updateUIData()
		);
	};

	// updated data if details delted from list
	UpdateList = () => {
		const { fetchUserList, deletedUserItems } = this.state;
		const newUserList = fetchUserList.filter(
			(eachId) => eachId.id !== deletedUserItems
		);

		this.setState({ fetchUserList: newUserList }, this.updateUIData);
	};

	// read user search input and filter the data based on input query
	onChangeSearchInput = (event) => {
		this.setState({ searchInput: event.target.value }, this.filterUserList());
	};

	// clear search input and restore the user table
	onClickClearSearch = () => {
		this.setState({ fetchUserList: this.props.userList }, this.updateUIData);
	};

	// read user details which user want to edit
	onClickEditUserDetails = (userDetails) => {
		this.setState({
			editUserDataId: userDetails.id,
			updateUserData: { ...userDetails },
		});
	};

	// read edited fields from user input
	onChangeUserFormDetails = (event) => {
		event.preventDefault();
		const { updateUserData } = this.state;
		const editFieldName = event.target.getAttribute("name");
		const editFieldValue = event.target.value;
		const newUserDetails = { ...updateUserData };

		newUserDetails[editFieldName] = editFieldValue;
		this.setState({ updateUserData: newUserDetails });
	};

	// save edited details into state
	saveEditedUserDetails = (event) => {
		event.preventDefault();
		const { updateUserData, fetchUserList } = this.state;
		const newUserList = [...fetchUserList];
		const updateUserIndex = newUserList.findIndex(
			(eachUser) => eachUser.id === updateUserData.id
		);
		newUserList[updateUserIndex] = updateUserData;

		this.setState(
			{ fetchUserList: newUserList, editUserDataId: null },
			this.UpdateList
		);
	};

	// cancel editing with out saving data
	cancelEditUserDetails = () => {
		this.setState({ editUserDataId: null });
	};

	// check/uncheck all users when user clicks select all check box
	selectAllusers = () => {
		const { userList } = this.state;
		this.setState(
			(prevState) => {
				return {
					userList: userList.map((eachUser) => ({
						...eachUser,
						checked: !prevState.isCheckedAllUsers,
					})),
				};
			},
			() => {
				// console.log("asdf");
			}
		);
	};

	// check/uncheck select all check box
	handleAllCheckInput = () => {
		this.setState((prevState) => {
			return {
				isCheckedAllUsers: !prevState.isCheckedAllUsers,
			};
		}, this.selectAllusers());
	};

	// check/uncheck select all check box based on items checked in the page
	updateAllSelectCheckBox = () => {
		const { userList } = this.state;
		const allSelected = userList.map((eachUser) => eachUser.checked);
		const allEqual = (arr) => arr.every((val) => val === true);

		if (allEqual(allSelected)) {
			this.setState({ isCheckedAllUsers: true });
		} else {
			this.setState({ isCheckedAllUsers: false });
		}
	};

	// check/uncheck individual user details
	handleCheckInput = (event) => {
		const id = event.target.id;
		this.setState((prevState) => {
			return {
				userList: prevState.userList.map((eachUser) =>
					eachUser.id === id
						? { ...eachUser, checked: !eachUser.checked }
						: eachUser
				),
			};
		}, this.updateAllSelectCheckBox);
	};

	// delete selected users details from array
	deleteSelectedUsers = () => {
		this.setState((prevState) => {
			return {
				userList: prevState.userList.filter(
					(userDetails) => !userDetails.checked
				),
				isCheckedAllUsers: false,
				deletedUserItems: [
					...prevState.userList.map((eachUser) => {
						return eachUser.checked === true ? eachUser : "";
					}),
				],
			};
		}, this.updateFetchedList);
	};

	// navigate to next/previous/first/last page by user action
	handlePageChange = (event) => {
		const { totalPages, activePage } = this.state;
		switch (event.target.value) {
			case "<<":
				this.setState({ activePage: 1 }, this.updateUIData);
				break;
			case ">>":
				this.setState({ activePage: totalPages }, this.updateUIData);
				break;
			case "<":
				if (activePage > 1) {
					const newActivePage = activePage - 1;
					this.setState({ activePage: newActivePage }, this.updateUIData);
				}
				break;
			case ">":
				if (activePage < totalPages) {
					const newActivePage = activePage + 1;
					this.setState({ activePage: newActivePage }, this.updateUIData);
				}
				break;
			default:
				this.setState(
					{ activePage: event.target.value },
					this.updateUIData
				);
		}
	};

	//store delete item id and data to filter the data
	onClickDeleteUserDetails = (id) => {
		const { userList } = this.state;
		let newUserList = [];
		newUserList = userList.filter((eachId) => eachId.id !== id);
		this.setState(
			{
				userList: newUserList,
				deletedUserItems: id,
			},
			this.UpdateList
		);
	};

	// filter the data to remove deleted item from array
	updateFetchedList = () => {
		const { deletedUserItems, fetchUserList } = this.state;
		const userId = deletedUserItems.map((eachId) => eachId.id);
		const updatedUserList = fetchUserList.filter(
			(user) => !userId.includes(user.id)
		);
		this.setState({ fetchUserList: [...updatedUserList] }, this.updateUIData);
	};

	render() {
		const {
			userList,
			searchInput,
			editUserDataId,
			updateUserData,
			totalPages,
			activePage,
			isCheckedAllUsers,
		} = this.state;

		return (
			<div className='admin-ui'>
				<form onSubmit={this.saveEditedUserDetails}>
					<div className='user-field-search-input-container'>
						{/* search intput */}
						<input
							type='search'
							value={searchInput}
							onChange={this.onChangeSearchInput}
							placeholder='search by name,email,role'
							className='user-field-search-input'
						/>
						{/* button to clear search input and restore the data */}
						<button
							type='button'
							onClick={this.onClickClearSearch}
							className='user-field-clear-search-button'
						>
							clear
						</button>
					</div>
					{/* user details are rendered in table */}
					<table>
						{/* table header */}
						<thead>
							<tr>
								<th>
									{/* checkbox input to select all displayed users  */}
									<input
										type='checkbox'
										id='all'
										value='all'
										checked={isCheckedAllUsers}
										onChange={this.handleAllCheckInput}
									/>
								</th>
								<th>Name</th>
								<th>Email</th>
								<th>Role</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{/*table body */}
							{/* user details are rendered in pagination */}
							{userList.length > 0 ? (
								<>
									{userList.map((eachUser) => (
										<UserList
											key={eachUser.id}
											editUserDataId={editUserDataId}
											editedUserDetails={updateUserData}
											userDetails={eachUser}
											onClickEditUserDetails={
												this.onClickEditUserDetails
											}
											onClickDeleteUserDetails={
												this.onClickDeleteUserDetails
											}
											handleCheckInput={this.handleCheckInput}
											onChangeUserFormDetails={
												this.onChangeUserFormDetails
											}
											cancelEditUserDetails={
												this.cancelEditUserDetails
											}
										/>
									))}
								</>
							) : (
								//  if user list is empty either by no search results
								// or no users in the array no results text is displayed
								<tr>
									<td>No results</td>
								</tr>
							)}
						</tbody>
					</table>
				</form>
				{/* button to delete selected users */}
				<div className='delete-use-details-button-container'>
					<button
						type='button'
						onClick={this.deleteSelectedUsers}
						className='delete-user-details-button'
					>
						Delete Selected
					</button>
				</div>

				{/* pagination */}
				<div className='pagination-container'>
					<Pagination
						totalPages={totalPages}
						activePage={activePage}
						handlePageChange={this.handlePageChange}
					/>
				</div>
			</div>
		);
	}
}

export default UserDetails;
