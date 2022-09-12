/* eslint-disable no-tabs */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const privateKEY = fs.readFileSync(require.resolve('./private.pem'), 'utf8')
const publicKEY = fs.readFileSync(require.resolve('./public.pem', 'utf8'))

const i = 'jwt-node'
const s = 'jwt-node'
const a = 'jwt-node'

const verifyOptions = {
	issuer: i,
	subject: s,
	audience: a,
	expiresIn: '8784h',
	algorithm: ['RS256'],
}

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds)


const generateJWT = (payload) => {
	const signOptions = {
		issuer: i,
		subject: s,
		audience: a,
		expiresIn: '8784h',
		algorithm: 'RS256',
	}

	const options = signOptions
	if (payload && payload.exp) {
		delete options.expiresIn
	}
	console.log("private key:" , privateKEY)
	return jwt.sign(payload, privateKEY, options)
}

const verifyJWT = (payload) => {
	return jwt.verify(payload, publicKEY, verifyOptions)
}

const hashPassword = (password) => {
	const hash = bcrypt.hashSync(password, salt)
	return hash
}


module.exports = {
	hashPassword, verifyJWT, generateJWT
}