import Query from "./query";

export default class ShortestPath extends Query {
  constructor(private intrusionSet: string, private technique: string) {
    super()
  }

  get query(): string {
    return `match (i:IntrusionSet {name: "${this.intrusionSet}"}),(t:Technique {name: "${this.technique}"}),p = shortestPath((i)-[:USES|SUBTECHNIQUE_OF|KILL_CHAIN*]-(t)) return p`;
  }
}
