const express = require('express')

const {addScore,getScores} = require('../controllers/scoreController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()
router.use(requireAuth)

router.post('/',addScore)

router.get('/',getScores)

module.exports = router
