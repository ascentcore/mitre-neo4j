import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class TechniqueOrderPopulator extends EntryPopulator<Relation> {
    protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
      return await tx.run(
        `MATCH (t1:Technique),(t2:Technique) where t1.id = '${obj.source}' and t2.id = "${obj.destination}" CREATE (t1)-[r1:NEXT_TECHNIQUE]->(t2), (t2)-[r2:PREV_TECHNIQUE]->(t1) return r1,r2`
      )
    }
}