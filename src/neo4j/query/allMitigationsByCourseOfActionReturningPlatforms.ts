import Query from "./query";

export default class AllMitigationsByCourseOfActionReturningPlatformsQuery extends Query {
  private courseOfAction: string;

  constructor(courseOfAction: string) {
    super()
    this.courseOfAction = courseOfAction;
  }

  get query(): string {
    return `MATCH (b:CourseOfAction)-[r:MITIGATES]-(a)-[r2:ON_PLATFORM]-(p:Platform) where b.name = '${this.courseOfAction}' return a,r,b,r2,p`;
  }
}