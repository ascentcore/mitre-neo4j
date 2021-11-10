import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class ContributorsRelationPopulator extends EntryPopulator<Relation> {
    protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
      return await tx.run(
        `MATCH (c:Contributor),(a) where a.id = '${obj.destination}' and c.name = "${obj.source}" CREATE (c)-[r:CONTRIBUTED]->(a) return r`
      )
    }
}