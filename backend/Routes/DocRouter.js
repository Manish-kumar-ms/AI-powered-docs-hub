import express from 'express'
import { addDoc, deleteDoc, editDoc, getAllDocs, getDocById, regenerateSummary, regenerateTags, semanticSearch, teamQA } from '../controller/DocController.js'
import { ensureAuthenticated } from '../Middleware/isAuth.js'

const router=express.Router()


router.post('/addDoc',ensureAuthenticated,addDoc)
router.put('/editDoc/:id',ensureAuthenticated,editDoc)
router.delete('/deleteDoc/:id',ensureAuthenticated,deleteDoc)
router.post('/semanticSearch',ensureAuthenticated,semanticSearch)
router.post('/teamQA',ensureAuthenticated,teamQA)
router.get('/allDocs',ensureAuthenticated,getAllDocs)
router.get('/getDoc/:id',ensureAuthenticated,getDocById)
router.put('/regenerateSummary/:id',ensureAuthenticated,regenerateSummary)
router.put('/regenerateTags/:id',ensureAuthenticated,regenerateTags)
export default router