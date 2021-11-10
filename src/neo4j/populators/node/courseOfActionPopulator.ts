import { Transaction, Result } from "neo4j-driver-core";
import { MitreItem } from "../../../mitre/types";
import EntryPopulator from "../abstract/entryPopulator";

export default class CourseOfActionPopulator extends EntryPopulator<MitreItem> {
  protected addOne(tx: Transaction, obj: MitreItem): Result {
    return tx.run(
      "CREATE (c:CourseOfAction {id: $id, name: $name, description: $description})",
      { 
        id: obj.id,
        name: obj.name,
        description: obj.description || '',
      },
    )
  }
}