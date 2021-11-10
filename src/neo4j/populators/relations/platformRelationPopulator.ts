import { Transaction, QueryResult } from "neo4j-driver-core";
import EntryPopulator, { Relation } from "../abstract/entryPopulator";

export default class PlatformRelationPopulator extends EntryPopulator<Relation> {
  protected async addOne(tx: Transaction, obj: Relation): Promise<QueryResult> {
    return await tx.run(
      `MATCH (a),(p:Platform) where a.id = '${obj.source}' and p.name = '${obj.destination}' CREATE (a)-[r:ON_PLATFORM]->(p) return r`
    )
  }
}