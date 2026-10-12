import { expect, test } from "vitest";
import { districts } from "./daraa-map";
import { areas } from "@/data/daraa-map";

// The grouping is hand-maintained while the polygons are generated, so the
// two can drift apart. Either half of this failing means the map would
// quietly render an uncoloured, unlisted area.
test("every sub-district is in exactly one district", () => {
  const grouped = Object.values(districts).flat();

  expect([...grouped].sort()).toEqual(areas.map((a) => a.id).sort());
  expect(new Set(grouped).size).toBe(grouped.length);
});
