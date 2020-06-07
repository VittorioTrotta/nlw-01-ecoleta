import express from 'express';
//Inicializa proj typescrpit
//npx tsc --init

// ./ pq é um arquivo da minha aplicação
import routes from './routes';

const app = express();

app.use(express.json());
//Conceitos:
//Rota: Endereço completo da requisição
//Recurso: Qual entidade estamos acessando do sistema


//Métodos HTTP:

//GET: Buscar uma ou mais informações do back-end
// POST: Criar uma nova informação do back-end
// PUT: Atualizar uma informação existe no back-end
// DELETE: Remover uma informação do back-end


//Exemplos
//POST http://localhost:3333/users = Cria um usário
//GET http://localhost:3333/users = Lista usuários

//GET http://localhost:3333/users/5 = Busca usuário com ID 5


//Request Param: Parâmetros que vem na própria rota que identificam um recurso
//Query Param: Parâmetros que são opcionais
//Request Body: Parâmetros para criação/atualização de informações

// SELECT * FROM users WHERE name * 'Diego'
// knex('users').where('name','Diego').select('*');


const users = [
'Diego', //0
'Cleyon', //1
'Robson', //2
'Vitor' //3
];

app.use(routes);


app.listen(3333);

/* 
app.get('/users',(request,response)=>{
    const search = String(request.query.search);

    const filteredUsers= search ? users.filter(user=>user.includes(search)) : users;

    //response.send('Hello World');


    //Normalmente é retornado um JSON
    return response.json(filteredUsers);

});


app.get('/users/:id',(request,response)=> {
    const id =Number(request.params.id);

    const user = users[id];

    return response.json(user);
})


app.post('/users',(request,response)=> {
    const data = request.body;

    console.log(data);
    
    const user={
        name:data.name,
        email:data.email
    };
    //Importante colocar o retorno como json, além disso, para a execução aqui
    return response.json(user);
})
 */

