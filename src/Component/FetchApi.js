import React, { Component } from "react";
import apiStatusConstants from "../API_Status_Constants";
import Loader from "react-loader-spinner";
import UserDetails from "./UserDetails";

class FetchApi extends Component {
	state = {
		apiStaus: apiStatusConstants.initial,
		userList: [],
		activePage: 1,
		totalPages: 1,
	};

	componentDidMount = () => {
		this.getAllUserDetails();
	};

	getAllUserDetails = async () => {
		const { activePage, serachInput } = this.state;
		const Limit = 10;
		const Offset = (activePage - 1) * Limit;
		this.setState({ apiStatus: apiStatusConstants.inProgress });

		const apiUrl = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`;
		const response = await fetch(apiUrl);
		if (response.ok) {
			const fetchedData = await response.json();
			const totalPages = Math.ceil(fetchedData.length / Limit);
			this.setState({
				apiStatus: apiStatusConstants.success,
				userList: fetchedData,
				totalPages,
			});
		} else {
			this.setState({ apiStatus: apiStatusConstants.failure });
		}
	};

	renderSuccesAdminUi = () => {
		const { userList } = this.state;
		return <UserDetails userList={userList} />;
	};

	renderFailureView = () => (
		<div>
			<p>failure</p>
			<button type='button'>Clear</button>
		</div>
	);

	renderLoadingView = () => (
		<div>
			<Loader type='Oval' color='#f7931e' height='50' width='50' />
		</div>
	);

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
