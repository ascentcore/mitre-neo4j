import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class DataSourceRelationPopulator extends EntryPopulator<Relation> {
  protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
    return await tx.run(
      `MATCH (a),(d:DataSource) where a.id = '${obj.source}' and d.id = "${obj.destination}" CREATE (a)-[r:SOURCE]->(d) return r`
    )
  }
}