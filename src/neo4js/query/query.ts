import * as neo4j from 'neo4j-driver';

export default abstract class Query {
  abstract get query(): string;

  get className(): string {
    return this.constructor.name;
  }

  run(tx: neo4j.Transaction): neo4j.Result {
    return tx.run(this.query);
  }
}
