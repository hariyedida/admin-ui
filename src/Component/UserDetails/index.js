import "./index.css";

import { Component } from "react";
import UserList from "../UserList";
import EditUserDetails from "../EditUserDetails";
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

	updateUIData = () => {
		const { fetchUserList, activePage } = this.state;
		const Limit = 10;
		console.log(fetchUserList);

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

	updatedFetchedList = () => {
		const { fetchUserList, itemsStart, itemsEnd } = this.state;
		this.setState({ userList: fetchUserList.slice(itemsStart, itemsEnd) });
	};

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

	UpdateList = () => {
		const { fetchUserList, deletedUserItems } = this.state;
		const newUserList = fetchUserList.filter(
			(eachId) => eachId.id !== deletedUserItems
		);

		this.setState({ fetchUserList: newUserList }, this.updateUIData);
	};

	onChangeSearchInput = (event) => {
		this.setState({ searchInput: event.target.value }, this.filterUserList());
	};

	onClickClearSearch = () => {
		this.setState({ fetchUserList: this.props.userList }, this.updateUIData);
	};

	onClickEditUserDetails = (userDetails) => {
		this.setState({
			editUserDataId: userDetails.id,
			updateUserData: { ...userDetails },
		});
	};

	onChangeUserFormDetails = (event) => {
		event.preventDefault();
		const { updateUserData } = this.state;
		const editFieldName = event.target.getAttribute("name");
		const editFieldValue = event.target.value;
		const newUserDetails = { ...updateUserData };

		newUserDetails[editFieldName] = editFieldValue;
		this.setState({ updateUserData: newUserDetails });
	};

	saveEditedUserDetails = (event) => {
		event.preventDefault();
		const { updateUserData, userList, fetchUserList } = this.state;
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

	cancelEditUserDetails = () => {
		this.setState({ editUserDataId: null });
	};

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

	handleAllCheckInput = () => {
		this.setState((prevState) => {
			return {
				isCheckedAllUsers: !prevState.isCheckedAllUsers,
			};
		}, this.selectAllusers());
	};

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

	updateFetchedList = () => {
		const { deletedUserItems, fetchUserList } = this.state;
		const userId = deletedUserItems.map((eachId) => eachId.id);
		const updatedUserList = fetchUserList.filter(
			(user) => !userId.includes(user.id)
		);
		this.setState({ fetchUserList: [...updatedUserList] }, this.updateUIData);
	};

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

	render() {
		const {
			userList,
			searchInput,
			editUserDataId,
			updateUserData,
			checkedUserIdDict,
			totalPages,
			activePage,
			isCheckedAllUsers,
		} = this.state;

		return (
			<div className='admin-ui'>
				<form onSubmit={this.saveEditedUserDetails}>
					<div className='user-field-search-input-container'>
						<input
							type='search'
							value={searchInput}
							onChange={this.onChangeSearchInput}
							placeholder='search by name,email,role'
							className='user-field-search-input'
						/>
						<button
							type='button'
							onClick={this.onClickClearSearch}
							className='user-field-clear-search-button'
						>
							clear
						</button>
					</div>
					<table>
						<thead>
							<tr>
								<th>
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
							{userList.map((eachUser) => {
								return (
									<>
										{editUserDataId === eachUser.id ? (
											<EditUserDetails
												key={eachUser.id}
												userDetails={updateUserData}
												onChangeUserFormDetails={
													this.onChangeUserFormDetails
												}
												cancelEditUserDetails={
													this.cancelEditUserDetails
												}
											/>
										) : (
											<UserList
												key={eachUser.id}
												userDetails={eachUser}
												onClickEditUserDetails={
													this.onClickEditUserDetails
												}
												onClickDeleteUserDetails={
													this.onClickDeleteUserDetails
												}
												handleCheckInput={this.handleCheckInput}
												isChecked={
													checkedUserIdDict[eachUser.id] === true
														? true
														: false
												}
											/>
										)}
									</>
								);
							})}
						</tbody>
					</table>
				</form>
				<div className='delete-use-details-button-container'>
					<button
						type='button'
						onClick={this.deleteSelectedUsers}
						className='delete-user-details-button'
					>
						Delete Selected
					</button>
				</div>

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
