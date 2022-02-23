import React from "react";
import "./index.css";

function PaginationItems({ totalPages, activePage, handlePageChange }) {
	const pages = [...Array(totalPages).keys()];
	return (
		<ul>
			<li>
				<button
					type='button'
					onClick={handlePageChange}
					value={"<<"}
				>{`<<`}</button>
			</li>
			<li>
				<button
					type='button'
					onClick={handlePageChange}
					value={"<"}
				>{`<`}</button>
			</li>
			{pages.map((eachPage) => {
				const activePageClass =
					eachPage + 1 === parseInt(activePage, 10) ? "active" : " ";
				return (
					<li className={activePageClass}>
						<button
							type='button'
							onClick={handlePageChange}
							value={eachPage + 1}
						>
							{eachPage + 1}
						</button>
					</li>
				);
			})}
			<li>
				<button
					type='button'
					onClick={handlePageChange}
					value={">"}
				>{`>`}</button>
			</li>
			<li>
				<button
					type='button'
					onClick={handlePageChange}
					value={">>"}
				>{`>>`}</button>
			</li>
		</ul>
	);
}

const Pagination = (props) => {
	const { totalPages, handlePageChange, activePage } = props;
	return (
		<>
			<PaginationItems
				totalPages={totalPages}
				activePage={activePage}
				handlePageChange={handlePageChange}
			/>
		</>
	);
};

export default Pagination;
