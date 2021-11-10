import { Transaction, QueryResult } from "neo4j-driver-core";
import { MitreItem } from "../../../mitre/types";
import EntryPopulator from "../abstract/entryPopulator";

export default class RelationshipsPopulator extends EntryPopulator<MitreItem> {
  protected async addOne(tx: Transaction, relationship: MitreItem): Promise<QueryResult> {
    const type = relationship.relationship_type.toUpperCase().replace('-', '_');
    return await tx.run(
      `MATCH (a),(b) where a.id = '${relationship.source_ref}' and b.id = '${relationship.target_ref}' CREATE (a)-[r:${type}]->(b) return r`
    )
  }
}