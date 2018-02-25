module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": ["eslint:recommended", "plugin:react/recommended"],
	"parserOptions": {
		"ecmaFeatures": {
			"experimentalObjectRestSpread": true,
			"jsx": true
		},
		"sourceType": "module"
	},
	"parser": "babel-eslint",
	"plugins": [
		"react"
	],
	"rules": {
		"no-console": 0,
		"indent": [
			"error",
			"tab", {
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};