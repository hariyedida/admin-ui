import React, { Component } from "react";
import apiStatusConstants from "../API_Status_Constants";
import Loader from "react-loader-spinner";
import UserDetails from "./UserDetails";

class FetchApi extends Component {
	state = {
		apiStaus: apiStatusConstants.initial,
		userList: [],
	};

	componentDidMount = () => {
		this.getAllUserDetails();
	};

	//  fetch data and store to the state variable
	getAllUserDetails = async () => {
		this.setState({ apiStatus: apiStatusConstants.inProgress });
		const apiUrl = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`;
		const response = await fetch(apiUrl);
		if (response.ok) {
			const fetchedData = await response.json();
			const updatedData = fetchedData.map((eachUser) => ({
				email: eachUser.email,
				id: eachUser.id,
				name: eachUser.name,
				role: eachUser.role,
				checked: false,
			}));

			this.setState({
				apiStatus: apiStatusConstants.success,
				userList: [...updatedData],
			});
		} else {
			this.setState({ apiStatus: apiStatusConstants.failure });
		}
	};

	//  render the fetched data
	renderSuccesAdminUi = () => {
		const { userList, totalPages } = this.state;
		return <UserDetails userList={userList} totalPages={totalPages} />;
	};

	// if data fetching failed
	renderFailureView = () => (
		<div>
			<p>failure</p>
			<button type='button'>Clear</button>
		</div>
	);

	// render loader while fetching data
	renderLoadingView = () => (
		<div className='loader-container'>
			<Loader type='Oval' color='#475569' height='50' width='50' />
		</div>
	);

	// render UI based on data fetching api status
	renderAdminUiPage = () => {
		const { apiStatus } = this.state;
		switch (apiStatus) {
			case apiStatusConstants.success:
				return this.renderSuccesAdminUi();
			case apiStatusConstants.failure:
				return this.renderFailureView();
			case apiStatusConstants.inProgress:
				return this.renderLoadingView();
			default:
				return null;
		}
	};
	render() {
		return this.renderAdminUiPage();
	}
}

export default FetchApi;
