import Query from "./query";

export default class IntrusionSetAttackPattern extends Query {
  constructor(private intrusionSet: string) {
    super();
  }

  get query(): string {
    return `match (i:IntrusionSet {name: '${this.intrusionSet}'})-[:USES|SUBTECHNIQUE_OF*1..3]->(b) return i,b`;
  }
}