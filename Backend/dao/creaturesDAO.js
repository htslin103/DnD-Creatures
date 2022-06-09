import { Console } from "console"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let creatures

export default class CreaturesDAO{
    static async injectDB(conn){
        if(creatures){ //if creatures already filled, return 
            return
        }
        {
            try{ //otherwise fill with reference to that specific database
                creatures = await conn.db(process.env.CREATURES_NS).collection("Creatures") //"Creatures" is what the collection is called in MDB Atlas
            }catch(e){
                console.error(
                    `Unable to establish a collection handle in creaturesDAO: ${e}`, 
                )
            }
        }
    }

    static async getCreatures(
        {
            filters = null,
            page = 0, 
            creaturesPerPage = 20,
        } = {}) {
            let query
            if (filters) {
              //TODO: Fix this section for the searching         
                if ("name" in filters) {
                  query = { $text: { $search: filters["name"] } }
                } else if ("meta" in filters) {
                  query = { "meta": { $eq: filters["meta"] } }
                } else if ("senses" in filters) {
                  query = { $text: { $search: filters["senses"] } }
                } else if ("hitpoints" in filters) {
                  query = { $text: { $search: filters["hitpoints"] } }
                } else if ("damageimmunities" in filters) {
                  query = { "Damage Immunities": { $eq: filters["damageimmunities"] } }
                }
              }

            let cursor
    
            try {
              //this will find all in the database that go along with the query
              cursor = await creatures
                .find(query) 
            } catch (e) {
              console.error(`Unable to issue find command, ${e}`) 
              return { creaturesList: [], totalNumCreatures: 0 } //return empty list if there's an error in the query 
            } 

            const displayCursor = cursor.limit(creaturesPerPage).skip(creaturesPerPage * page)//multiplying page to get to the page we want

            try {
            const creaturesList = await displayCursor.toArray()
            const totalNumCreatures = await creatures.countDocuments(query)

            return { creaturesList, totalNumCreatures }
            } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { creaturesList: [], totalNumCreatures: 0 }
            }
        }   

        //retrieving the object from creatures.controller.js
        //This section will need to resemble the database fields 
    static async addCreature(creatureInfo)
    {
      try{           
        const creatureDoc = {
          name : creatureInfo.name,
          meta : creatureInfo.meta,
          "Armor Class" : creatureInfo.ArmorClass,
          "Hit Points" : creatureInfo.HitPoints,
          Speed : creatureInfo.Speed,
          STR : creatureInfo.STR,
          STR_mod : creatureInfo.STR_mod,
          DEX : creatureInfo.DEX,
          DEX_mod : creatureInfo.DEX_mod,
          CON : creatureInfo.CON,
          CON_mod : creatureInfo.CON_mod,
          INT : creatureInfo.INT,
          INT_mod : creatureInfo.INT_mod,
          WIS : creatureInfo.WIS,
          WIS_mod : creatureInfo.WIS_mod,
          CHA : creatureInfo.CHA,
          CHA_mod : creatureInfo.CHA_mod,
          "Saving Throws": creatureInfo.SavingThrows,
          Skills: creatureInfo.Skills,
          "Damage Immunities" : creatureInfo.DamageImmunities,
          Senses : creatureInfo.Senses,
          Languages : creatureInfo.Languages,
          Challenge : creatureInfo.Challenge,
          Traits : creatureInfo.Traits,
          Actions : creatureInfo.Actions,
          "Legendary Actions" : creatureInfo.LegendaryActions,
          img_url : creatureInfo.img_url,              
        }
        
      return await creatures.insertOne(creatureDoc)
  
      }catch(e){
        console.error(`Unable to post creature: ${e}`)
        return {error:e}
      }
    }    
    
    static async updateCreature(creatureInfo) {
      try {
        const updateResponse = await creatures.updateOne(
          { _id: ObjectId(creatureInfo.creatureId)},
          { $set: { 
              //ideally it only update fields that have changed
              name:creatureInfo.name,
              meta:creatureInfo.meta,
              "Armor Class" :creatureInfo.ArmorClass,
              "Hit Points" :creatureInfo.HitPoints,
              Speed :creatureInfo.Speed,
              STR :creatureInfo.STR,
              STR_mod :creatureInfo.STR_mod,
              DEX :creatureInfo.DEX,
              DEX_mod :creatureInfo.DEX_mod,
              CON :creatureInfo.CON,
              CON_mod :creatureInfo.CON_mod,
              INT :creatureInfo.INT,
              INT_mod :creatureInfo.INT_mod,
              WIS :creatureInfo.WIS,
              WIS_mod :creatureInfo.WIS_mod,
              CHA :creatureInfo.CHA,
              CHA_mod :creatureInfo.CHA_mod,
              "Saving Throws" :creatureInfo.SavingThrows,
              Skills :creatureInfo.Skills,
              "Damage Immunities" :creatureInfo.DamageImmunities,
              Senses :creatureInfo.Senses,
              Languages :creatureInfo.Languages,
              Challenge :creatureInfo.Challenge,
              Traits :creatureInfo.Traits,
              Actions :creatureInfo.Actions,
              "Legendary Actions" :creatureInfo.LegendaryActions,
              img_url :creatureInfo.img_url,              

            } },
        )
  
        return updateResponse
      } catch (e) {
        console.error(`Unable to update creature: ${e}`)
        return { error: e }
      }
    }
  
    //Looks at creature id and deletes it
    static async deleteCreature(creatureId) {
  
      try {
        const deleteResponse = await creatures.deleteOne({
          _id: ObjectId(creatureId),
          
        })
  
        return deleteResponse
      } catch (e) {
        console.error(`Unable to delete creature: ${e}`)
        return { error: e }
      }
    }

      //Get creature by id
      //TODO find out how to do this simply 
    static async getCreatureByID(id) {
      
      try {       
        return await creatures.find({"_id": ObjectId(id)}).next()      
        
      } catch (e) {
        console.error(`Unable to find the creature by the id : ${e}`)
        throw e
      }
    }
    
    static async getMetas() {
      let metas = []
      try {
        metas = await creatures.distinct("meta")
        return metas
      } catch (e) {
        console.error(`Unable to get metas, ${e}`)
        return metas
      }
    }
}
