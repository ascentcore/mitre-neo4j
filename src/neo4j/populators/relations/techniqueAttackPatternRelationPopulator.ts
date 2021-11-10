import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class TechniqueAttackPatternRelationPopulator extends EntryPopulator<Relation> {
    protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
      return await tx.run(
        `MATCH (ap:AttackPattern),(t:Technique) where ap.id = '${obj.source}' and t.shortName = "${obj.destination}" CREATE (ap)-[r:KILL_CHAIN]->(t) return r`
      )
    }
}