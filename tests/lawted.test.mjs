import test from "node:test"
import assert from "node:assert/strict"
import { lawtedNextStage, lawtedStage, lawtedTransition } from "../lib/lawted.ts"

test("Lawted scroll positions follow the original seven stages", () => {
  assert.equal(lawtedStage(0), 1)
  assert.equal(lawtedStage(1000 / 40700), 2)
  assert.equal(lawtedStage(11500 / 40700), 3)
  assert.equal(lawtedStage(19500 / 40700), 4)
  assert.equal(lawtedStage(24000 / 40700), 5)
  assert.equal(lawtedStage(26000 / 40700), 6)
  assert.equal(lawtedStage(34000 / 40700), 7)
  assert.equal(lawtedStage(1), 7)
  assert.equal(lawtedStage(0.1), 2)
  assert.equal(lawtedStage(0), 1)
})

test("Lawted scene events support forward and reverse jumps", () => {
  assert.equal(lawtedTransition(1, 7), "Stage1-7")
  assert.equal(lawtedTransition(7, 3), "Stage7-3")
  assert.equal(lawtedNextStage(2, 6), 3)
  assert.equal(lawtedNextStage(4, 7), 5)
  assert.equal(lawtedNextStage(1, 7), 7)
  assert.equal(lawtedNextStage(6, 2), 2)
  assert.throws(() => lawtedTransition(2, 2))
})
