import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class TechniqueAttackPatternRelationPopulator extends EntryPopulator<Relation> {
    protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
      console.log(`Creating relation ${obj.source}->${obj.destination}`)
      const r = await tx.run(
        `MATCH (ap:AttackPattern),(t:Technique) where ap.id = '${obj.source}' and t.shortName = "${obj.destination}" CREATE (ap)-[r:KILL_CHAIN]->(t) return r`
      )
      if (r.summary.counters.updates().relationshipsCreated !== 1) {
        console.error('Relationship not created!')
      }
      return r
    }
}