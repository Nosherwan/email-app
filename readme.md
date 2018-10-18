# Simple React.js Email App
This is a simple single page application done in react.js that allows a user to send emails to clients. In order to test this the accompanied "email-web-api" app from the other repository of the same name needs to be installed as well. You will also Have to Generate a key for your particular email service provider to use that server app.

1. Please install the latest node version.
2. do an `npm install`.
3. provide command `npm start`.

	This should start the application. The application will try to communicate with the node.js server app running on port 4000. The `_globalUri` variable however can be changed from `src/api/index.js` file to match that of the server app.
