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
		serachInput: "",
		editUserDataId: null,
		updateUserData: { id: "", name: "", email: "", role: "" },
		isCheckedAllUsers: false,
		checkedUserIdDict: {},
		deletedUserItems: null,
		totalPages: null,
	};

	componentDidMount = () => {
		const { fetchUserList, activePage } = this.state;
		const Limit = 10;
		const newItemsStart = (activePage - 1) * Limit;
		const totalPages = Math.ceil(fetchUserList.length / Limit);
		this.setState(
			{
				totalPages,
				itemsStart: newItemsStart,
				itemsEnd: newItemsStart + Limit,
			},
			this.updatedFetchedList
		);
	};

	updatedFetchedList = () => {
		const { fetchUserList, itemsStart, itemsEnd } = this.state;
		this.setState({ userList: fetchUserList.slice(itemsStart, itemsEnd) });
	};

	UpdateList = () => {
		const { fetchUserList, deletedUserItems } = this.state;
		const newUserList = fetchUserList.filter(
			(eachId) => eachId.id !== deletedUserItems
		);

		this.setState({ fetchUserList: newUserList }, this.componentDidMount);
	};

	onChangeSearchInput = (event) => {
		this.setState({ searchInput: event.target.value });
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
		const { updateUserData, userList } = this.state;
		const newUserList = [...userList];
		const updateUserIndex = newUserList.findIndex(
			(eachUser) => eachUser.id === updateUserData.id
		);

		newUserList[updateUserIndex] = updateUserData;

		this.setState({ userList: newUserList, editUserDataId: null });
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

	handleAllCheckInput = (event) => {
		const { userList } = this.state;
		let selectUsersIDDict = {};
		if (event.target.checked) {
			userList.forEach((eachUser) => {
				selectUsersIDDict[eachUser.id] = event.target.checked;
			});
		} else {
			selectUsersIDDict = {};
		}

		this.setState({ checkedUserIdDict: { ...selectUsersIDDict } });
	};

	handleCheckInput = (id, event) => {
		const { checkedUserIdDict } = this.state;
		let updatedDict = { ...checkedUserIdDict };

		updatedDict[id] = event.target.checked;

		this.setState({ checkedUserIdDict: { ...updatedDict } });
	};

	handlePageChange = (event) => {
		const { totalPages, activePage } = this.state;
		console.log(event.target.value);
		switch (event.target.value) {
			case "<<":
				this.setState({ activePage: 1 }, this.componentDidMount);
				break;
			case ">>":
				this.setState({ activePage: totalPages }, this.componentDidMount);
				break;
			case "<":
				if (activePage > 1) {
					const newActivePage = activePage - 1;
					this.setState(
						{ activePage: newActivePage },
						this.componentDidMount
					);
				}
				break;
			case ">":
				if (activePage < totalPages) {
					const newActivePage = activePage + 1;
					this.setState(
						{ activePage: newActivePage },
						this.componentDidMount
					);
				}
				break;
			default:
				this.setState(
					{ activePage: event.target.value },
					this.componentDidMount
				);
		}
	};

	render() {
		const {
			userList,
			serachInput,
			editUserDataId,
			updateUserData,
			checkedUserIdDict,
			totalPages,
			activePage,
		} = this.state;
		let isCheckedAll = false;
		if (Object.keys(checkedUserIdDict).length === userList.length) {
			const dictValues = Object.values(checkedUserIdDict);
			isCheckedAll = dictValues.includes(false) ? false : true;
		}

		return (
			<div>
				<form onSubmit={this.saveEditedUserDetails}>
					<input
						type='search'
						value={serachInput}
						onChange={this.onChangeSearchInput}
						placeholder='search by name,email,role'
					/>
					<table>
						<thead>
							<tr>
								<th>
									<input
										type='checkbox'
										id='all'
										value='all'
										checked={isCheckedAll}
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
							{userList.map((eachUser) => (
								<>
									{editUserDataId === eachUser.id ? (
										<EditUserDetails
											key={updateUserData.id}
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
							))}
						</tbody>
					</table>
				</form>
				<Pagination
					totalPages={totalPages}
					activePage={activePage}
					handlePageChange={this.handlePageChange}
				/>
			</div>
		);
	}
}

export default UserDetails;
