import { Transaction, Result } from "neo4j-driver-core";
import { MitreItem } from "../../../mitre/types";
import EntryPopulator from "../abstract/entryPopulator";

export default class IdentitiesPopulator extends EntryPopulator<MitreItem> {
  protected addOne(tx: Transaction, obj: MitreItem): Result {
    console.log(`Creating identity ${obj.name}`)
    return tx.run(
      "CREATE (i:Identity {id: $id, name: $name})",
      { 
        id: obj.id,
        name: obj.name,
      },
    )
  }
}