const Joi = require("@hapi/joi")

const createScore = async (req, res, next) => {
	console.log('creating score')

    const { value, player1, player2, category } = req.body

    const createdAt = moment(new Date())

	const schema = Joi.object({
		value: Joi.string().required(),
		player1: Joi.string().required(),
		player2: Joi. string().required(),
		category: Joi.string().required(),
        createdAt: Joi.string().required(),
	})

	const result = schema.validate(req.body)

	if (result.error) return Response.sendErrorResponse({ res, message: result.error.details[0].message.replace(/['"]/g, ''), statusCode: 422 })


	const createScoreQuery = `INSERT INTO
      scores(value, player1, player2, category, createdAt)
      VALUES($1, $2, $3, $4, $5)
      returning *`

	const values = [
		value,
		player1,
		player2,
        category,
        createdAt
	]

	try {
		const { rows } = await dbQuery.query(createScoreQuery, values)
		const dbResponse = rows[0]
		return Response.sendResponse({
			res,
			responseBody: { user: dbResponse },
			statusCode: 201,
			message: 'Score successfully created',
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

module.exports = {
    createScore,
}