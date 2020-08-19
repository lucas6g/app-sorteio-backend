const knex = require('../database/connection')

module.exports = {
    async signup(req,res){

        /*
                O cadastro no banco de dados foi realizado?
        Consegue enviar e-mail?
        Estou partindo do pressuposto que você tem um cadastro realizado no banco de dados e que consegue enviar e-mails. Faça o seguinte:

        Na tabela do usuário cadastrado, crie um campo de nome "verificado" do tipo int e atribua 0 para não verificado e 1 para verificado. Por padrão todos os cadastros terão o valor 0
        adicione na tabela de cadastro um campo chamado "token" do tipo varchar
        cada novo cadastro que for realizado, gere um token único do tipo UUID
        Envie um link de ativação de cadastro por e-mail para seu usuário. Exemplo de link de ativação: http://www.seusite.com/ativacao?token=TOKEN_EXCLUSIVO_DO_USUARIO
        O endereço acima irá ler a query string token e irá verificar se há algum registro que corresponda ao token. Se houver, altere o campo "verificado" para 1
        Imagino que você tem uma tela de login. Nessa tela de login você recebe as credenciais do usuário (login e senha). Você deve conceder acesso somente para os usuários que tenham o campo "verificado" igual a 1.

        Espero que tenha ajudado.
        
        */

       return res.status(200).json({message:'usuario cadastrado com sucesso'})
    
    }

}



