import Query from "./query";

export default class TopContributors extends Query {
  constructor(
    private readonly count: number,
  ) {
      super();
  }

  get query(): string {
      return `MATCH (c:Contributor) WITH c, SIZE((c)-[:CONTRIBUTED]->()) as contributionCnt order by contributionCnt desc limit ${this.count} match (c)-[:CONTRIBUTED]->(x) return c,x`;
  }

}