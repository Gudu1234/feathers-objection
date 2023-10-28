// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, JSONSchema } from 'objection';
import Knex from 'knex';
import { Application } from '../declarations';

class User extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get tableName(): string {
    return 'user';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['password'],

      properties: {
      
        email: { type: ['string', 'null'] },
        password: { type: 'string' },
      
      }
    };
  }

  $beforeInsert(): void {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }
}

export default function (app: Application): typeof User {
  const db: Knex = app.get('knex');

  db.schema.hasTable('user').then(exists => {
    if (!exists) {
      db.schema.createTable('user', table => {
        table.increments('id');
      
        table.string('email').unique();
        table.string('password');
      
      
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created user table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating user table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating user table', e)); // eslint-disable-line no-console

  return User;
}
