// import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
// configure, create, and export the project's history instance
// so that every other module gets the same instance of history

const getHistory = function () {
	return createHashHistory();
};

export default getHistory();
