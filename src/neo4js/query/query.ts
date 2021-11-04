import * as neo4j from 'neo4j-driver';

// ALL mitigations by course of actions, return platforms and attack patterns
// MATCH (b:CourseOfAction)-[r:MITIGATES]-(a)-[r2:ON_PLATFORM]-(p:Platform) where b.name = 'Audit' return a,r2,
export default abstract class Query {
  abstract get query(): string;

  run(tx: neo4j.Transaction): neo4j.Result {
    return tx.run(this.query);
  }
}
