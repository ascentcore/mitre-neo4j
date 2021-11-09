import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class PermissionRelationPopulator extends EntryPopulator<Relation> {
  protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
    console.log(`Creating relation ${obj.source}->${obj.destination}`);
    const r = await tx.run(
      `MATCH (a),(p:Permission) where a.id = '${obj.source}' and p.name = '${obj.destination}' CREATE (a)-[r:REQUIRES_PERMISSION]->(p) return r`
    )
    if (r.summary.counters.updates().relationshipsCreated !== 1) {
      console.error('Relationship not created!')
    }
    return r
  }
}