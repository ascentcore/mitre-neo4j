import Query from "./query";

export default class AllRelatedToAttackPattern extends Query {
  constructor(private attackPattern: string) {
    super();
  }

  get query(): string {
    return `MATCH (ap:AttackPattern {name: '${this.attackPattern}'})--(anything) return ap,anything`;
  }
}