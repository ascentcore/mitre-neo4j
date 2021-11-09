import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class ContributorsRelationPopulator extends EntryPopulator<Relation> {
    protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
      console.log(`Creating relation ${obj.source}->${obj.destination}`)
      const r = await tx.run(
        `MATCH (c:Contributor),(a) where a.id = '${obj.destination}' and c.name = "${obj.source}" CREATE (c)-[r:CONTRIBUTED]->(a) return r`
      )
      if (r.summary.counters.updates().relationshipsCreated !== 1) {
        console.error('Relationship not created!')
      }
      return r
    }
}