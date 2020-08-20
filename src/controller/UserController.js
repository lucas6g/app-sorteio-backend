const knex = require('../database/connection')



module.exports = {
    async signup(req,res){


        const {
            user_name,
            email,
            password,
            confirmation_token,
            push_token
        } = req.body

        const user = {
            user_name,
            email,
            password,
            confirmation_token,
            push_token
        }


      const emailExists =  await knex('user').select('*').where('email','=',email)

      const userNameExists =  await knex('user').select('*').where('user_name','=',user_name)
      
       if(emailExists.length !== 0){
            return res.status(401).json({error:'Esse email ja esta em uso'})
       }
      
       if(userNameExists.length !== 0){
            return res.status(401).json({error:'Esse usuario ja existe'})
       }


       if(!email || !password){
            return res.status(401).json({error:'Os campos email e senha são obrigatorios'})
       }
       

       
      if(await knex('user').insert(user)){
        return res.status(201).json({message:'usuario cadastrado com sucesso'})
      }

    }

}



