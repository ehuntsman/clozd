import React from 'react';
import {
	Routes,
	Route,
} from 'react-router-dom';
import PageContainer from './PageContainer/PageContainer.js';
import Companies from './Companies/Companies.js';
import Company from './Company/Company.js';

const App = () => {
	return (
			<Routes>
				<Route path="/" element={<PageContainer />}>
					<Route index element={<Companies />} />
					<Route path="companies" element={<Companies />} />
          <Route path="/companies/:id" element={<Company />} />
				</Route>
			</Routes>
	);
};

export default App;
