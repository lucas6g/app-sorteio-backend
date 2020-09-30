const { Router } = require('express')
const requireAuth = require('../middlewares/requireAuth')
const SortitionController = require('../controller/SortitionController')
const router = Router()

//lista sorteios pelo nome do premio
router.get('/sortition/search', SortitionController.findSortitions)

router.use(requireAuth)

//create a new sortition
router.post('/sortition', SortitionController.createSortition)

//list especifc sortitions
router.get(
  '/sortition/created',
  SortitionController.getAllSortitionsCreatedByUser
)

//participar de um sorteio
router.post(
  '/sortition/:sortition_id/participate',
  SortitionController.participateSortition
)

//rota de realizar um sorteio
router.put(
  '/sortition/:sortition_id/performs',
  SortitionController.performSortition
)

//listar todos os sorteios que um usuario especifico esta participando
router.get(
  '/sortition/participing',
  SortitionController.getParticipingSortitions
)

module.exports = router
