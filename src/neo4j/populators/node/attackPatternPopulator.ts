import { Transaction, Result } from "neo4j-driver-core";
import { MitreItem } from "../../../mitre/types";
import EntryPopulator from "../abstract/entryPopulator";

export default class AttackPatternPopulator extends EntryPopulator<MitreItem> {
  protected addOne(tx: Transaction, obj: MitreItem): Result {
    console.log(`Creating attack pattern ${obj.name}`)
    return tx.run(
      "CREATE (a:AttackPattern {id: $id, name: $name, description: $description, detection: $detection})",
      { 
        id: obj.id,
        name: obj.name,
        description: obj.description || '',
        detection: obj.x_mitre_detection || '',
      },
    )
  }
}