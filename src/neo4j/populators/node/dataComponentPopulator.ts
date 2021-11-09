import { Transaction, Result } from "neo4j-driver-core";
import { MitreItem } from "../../../mitre/types";
import EntryPopulator from "../abstract/entryPopulator";

export default class DataComponentPopulator extends EntryPopulator<MitreItem> {
  protected addOne(tx: Transaction, obj: MitreItem): Result {
    console.log(`Creating data component ${obj.name}`)
    return tx.run(
      "CREATE (d:DataComponent {id: $id, name: $name, description: $description})",
      { 
        id: obj.id,
        name: obj.name,
        description: obj.description || '',
      },
    )
  }
}