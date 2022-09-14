/* eslint-disable consistent-return */
/* eslint-disable no-tabs */
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs')
const Response = require('./response.js')
const dbQuery = require('../db/dbQuery.js')

const Joi = require('@hapi/joi')

/**
   * isValidUsername helper method
   * @param {string} username
   * @returns {Boolean} True or False
   */
const isValidUsername = (username) => {
	const regEx = /[a-zA-Z0-9]{2,}/
	return regEx.test(username)
}

/**
   * validatePassword helper method
   * @param {string} password
   * @returns {Boolean} True or False
   */
const validatePassword = (password) => {
	if (password.length <= 5 || password === '') {
		return false
	} return true
}
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const isEmpty = (input) => {
	if (input === undefined || input === '') {
		return true
	}
	if (input.replace(/\s/g, '').length) {
		return false
	} return true
}

/**
   * empty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const empty = (input) => {
	if (input === undefined || input === '') {
		return true
	}
}

const createUser = async (req, res, next) => {
	console.log('creating user')
	const schema = Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required(),
	})

	const result = schema.validate(req.body)

	if (result.error) return Response.sendErrorResponse({ res, message: result.error.details[0].message.replace(/['"]/g, ''), statusCode: 422 })

	const usernameCheck = 'SELECT * FROM users WHERE username = $1'

	// check if username exists already
	const { rows } = await dbQuery.query(usernameCheck, [req.body.username])
	const dbResponse = rows[0]
	if (dbResponse) return Response.sendErrorResponse({ res, message: 'This username has been taken kid.' })
	return next()
}

/**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
const comparePassword = (hashedPassword, password) => bcrypt.compareSync(password, hashedPassword)


/**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */


module.exports = {
	isValidUsername,
	validatePassword,
	isEmpty,
	empty,
	createUser,
	comparePassword,
}
