import Knex from 'knex';

//Função para criar alterações no banco
export async function up(knex:Knex){
//Criar a tabela
    return knex.schema.createTable('items',table =>{
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('title').notNullable();


    });
}

export async function down(knex:Knex){
//Voltar atrás (Deletar a tabela ou campos)
return knex.schema.dropTable('items');

}