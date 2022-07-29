/* eslint-disable no-underscore-dangle */
/* eslint-disable import/named */
/* eslint-disable radix */
/* eslint-disable no-tabs */
const moment =  require('moment')

const dbQuery = require('../db/dbQuery.js')


const Utils = require('../helpers/utils.js')

const {
	comparePassword,
	isValidUsername,
	validatePassword,
	isEmpty,
} = require('../helpers/validation.js')

const Response = require('../helpers/response.js')


/**
   * Register New User
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
const registerUser = async (req, res) => {
	const {
		username, firstName, lastName, password,
	} = req.body

	const createdOn = moment(new Date())

	if (!isValidUsername(username)) {
		return Response.sendErrorResponse({
			res,
			message: 'Please enter a valid username address',
			statusCode: 400,
		})
	}

	if (!validatePassword(password)) {
		return Response.sendErrorResponse({
			res,
			message: 'Password must be more than five(5) characters',
			statusCode: 400,
		})
	}

	const hashedPassword = Utils.hashPassword(password)

	const createUserQuery = `INSERT INTO
      users(username, firstName, lastName, password, createdOn)
      VALUES($1, $2, $3, $4, $5)
      returning *`

	const values = [
		username,
		firstName,
		lastName,
		hashedPassword,
		createdOn,
	]

	try {
		const { rows } = await dbQuery.query(createUserQuery, values)
		const dbResponse = rows[0]
		delete dbResponse.password
		return Response.sendResponse({
			res,
			responseBody: { user: dbResponse },
			statusCode: 201,
			message: 'User successfully created',
		})
	} catch (error) {
		console.log(error, 'error')
		return Response.sendErrorResponse({
			res,
			message: error,
			statusCode: 500,
		})
	}
}

/**
   * login User
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
const loginUser = async (req, res) => {
	const { username, password } = req.body

	if (isEmpty(username) || isEmpty(password)) {
		return Response.sendErrorResponse({
			res,
			message: 'username or Password detail is missing',
			statusCode: 400,
		})
	}

	if (!isValidUsername(username) || !validatePassword(password)) {
		return Response.sendErrorResponse({
			res,
			message: 'Please enter a valid username or Password',
			statusCode: 400,
		})
	}

	const loginUserQuery = 'SELECT * FROM users WHERE username = $1'

	try {
		const { rows } = await dbQuery.query(loginUserQuery, [username])

		const dbResponse = rows[0]

		if (!dbResponse) {
			return Response.sendErrorResponse({
				res,
				message: 'User with this username does not exist',
				statusCode: 400,
			})
		}
		if (!comparePassword(dbResponse.password, password)) {
			return Response.sendErrorResponse({
				res,
				message: 'The password you provided is incorrect',
				statusCode: 400,
			})
		}

		console.log(dbResponse, 'dbResponse')

		const token = Utils.generateJWT(dbResponse)
		const refreshExpiry = moment().utc().add(3, 'days').endOf('day')
			.format('X')
		const refreshtoken = Utils.generateJWT({ exp: parseInt(refreshExpiry), data: dbResponse._id })
		delete dbResponse.password
		return Response.sendResponse({
			res,
			responseBody: { user: dbResponse, token, refresh: refreshtoken },
			message: 'login successful',
		})
	} catch (error) {
		console.log(error)
		return Response.sendErrorResponse({
			res,
			message: error,
			statusCode: 500,
		})
	}
}

const me = async (req, res) => {
	try {
		return Response.sendResponse({
			res,
			message: 'User details successfully fetched',
			responseBody: {
				firstName: res.user.firstname,
				username: res.user.username,
				lastName: res.user.lastname,
				token: res.token,
				id: res.user.id,
			},
		})
	} catch (error) {
		console.log(error)
		return Response.sendErrorResponse({
			res,
			message: 'Unable to fetch currently logged in user detail',
			statusCode: 400,
		})
	}
}

module.exports = {
	registerUser,
	loginUser,
	me,
}




