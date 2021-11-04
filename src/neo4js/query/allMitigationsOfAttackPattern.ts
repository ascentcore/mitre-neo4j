import Query from "./query";

export default class AllMitigationsOfAttackPatternQuery extends Query {
  private attackPatternName: string;

  constructor(attackPatternName: string) {
    super()
    this.attackPatternName = attackPatternName;
  }

  get query(): string {
    return `MATCH (b)-[r:MITIGATES]-(a:AttackPattern) where a.name = '${this.attackPatternName}' return a,r,b`;
  }
}