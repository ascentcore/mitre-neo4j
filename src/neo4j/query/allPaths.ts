import Query from "./query";

export default class AllPaths extends Query {
  constructor(private intrusionSet: string, private technique: string) {
    super()
  }

  get query(): string {
    return `match p=(i:IntrusionSet {name: "${this.intrusionSet}"})-[:USES|SUBTECHNIQUE_OF|KILL_CHAIN*]->(t:Technique {name: "${this.technique}"}) return p`;
  }
}
