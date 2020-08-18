const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    return res.json({message:'eaee cantos'})

})

app.listen(3333,()=>{
    console.log('servidor rodando na port 3333')   
})