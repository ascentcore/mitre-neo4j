import Query from "./query";

export default class AllRelationsOfAttackPatternQuery extends Query {
  private attackPatternName: string;

  constructor(attackPatternName: string) {
    super()
    this.attackPatternName = attackPatternName;
  }

  get query(): string {
    return `MATCH (a:AttackPattern)-[r]-(b) where a.name = '${this.attackPatternName}' return a,r,b`;
  }
}