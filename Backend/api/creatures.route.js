import express from "express"
import CreaturesCtrl from "./creatures.controller.js"

const router = express.Router()

//Gets all creatures
router.route("/").get(CreaturesCtrl.apiGetCreatures)
router.route("/id/:id").get(CreaturesCtrl.apiGetCreatureById)
router.route("/metas").get(CreaturesCtrl.apiGetCreatureMetas)

//allows modification of creatures
.post(CreaturesCtrl.apiPostCreature)
.put(CreaturesCtrl.apiUpdateCreature)
.delete(CreaturesCtrl.apiDeleteCreature)

//should allow user to copy a creature and add modifications

export default router

