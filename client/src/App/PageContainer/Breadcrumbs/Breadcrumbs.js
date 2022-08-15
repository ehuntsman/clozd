import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
	const location = useLocation();

	const crumbs = [];

	switch (location.pathname) {
		case '/':
		case '/companies':
			crumbs.push({
				name: 'Companies',
				destination: '/companies',
			});
			break;
		case '/companies/' + location.pathname.split('/')[2]:
			console.log("adds company crumb");
			crumbs.push({
				name: 'Companies',
				destination: '/',
			},{
				name: 'Company',
				destination: '#',
			});
			break;
		default:
			break;
	}

	console.log(crumbs, "breadcrumbs", location.pathname);
	return (
		<div className="breadcrumbs">
			<div className="breadcrumbs_crumb">/</div>
			{crumbs.map(crumb => (
				<div className="breadcrumbs_crumb" key={crumb.name}>
					<Link to={crumb.destination}>{crumb.name}</Link>
					/
				</div>
			))}
		</div>
	);
};

export default Breadcrumbs;