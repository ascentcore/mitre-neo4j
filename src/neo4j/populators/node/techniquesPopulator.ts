import { Transaction, Result } from "neo4j-driver-core";
import { MitreItem } from "../../../mitre/types";
import EntryPopulator from "../abstract/entryPopulator";

export default class TechniquesPopulator extends EntryPopulator<MitreItem> {
  protected addOne(tx: Transaction, obj: MitreItem): Result {
    return tx.run(
      "CREATE (t:Technique {id: $id, name: $name, description: $description, shortName: $x_mitre_shortname})",
      obj,
    )
  }
}