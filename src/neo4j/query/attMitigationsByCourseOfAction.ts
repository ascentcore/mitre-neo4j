import Query from "./query";

export default class AllMitigationsByCourseOfActionQuery extends Query {
  private attackPatternName: string;

  constructor(attackPatternName: string) {
    super()
    this.attackPatternName = attackPatternName;
  }

  get query(): string {
    return `MATCH (b:CourseOfAction)-[r:MITIGATES]-(a) where b.name = '${this.attackPatternName}' return a,r,b`;
  }
}