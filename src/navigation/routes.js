import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import ListContainer from '../containers/ListContainer';

const MainRoutes = () => {
	return (
		<div>
			<Route exact path="/" render={() =>
				<Redirect to="/main" />
			} />
			<Route path="/main" component={MainContainer} />
			<Route path="/list" component={ListContainer} />
		</div>
	);
};

export default MainRoutes;
