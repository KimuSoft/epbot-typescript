import { RoomDoc } from '../../types/room'

const GRAPH_BLOCK_SIZE = 18

export const getRoomAnalysis = async (room: RoomDoc) => {
  const effects = room.getEffects()

  const allFish =
    effects.trashSample +
    effects.commonSample +
    effects.rareSample +
    effects.epicSample +
    effects.legendarySample +
    effects.mythicSample

  const trashRatio = effects.trashSample / allFish
  const commonRatio = effects.commonSample / allFish
  const rareRatio = effects.rareSample / allFish
  const epicRatio = effects.epicSample / allFish
  const legendaryRatio = effects.legendarySample / allFish
  const mythicRatio = effects.mythicSample / allFish

  const getBlockSize = (ratio: number) => Math.floor(ratio * GRAPH_BLOCK_SIZE)

  const trashBlockSize = getBlockSize(trashRatio)
  const commonBlockSize = getBlockSize(commonRatio)
  const rareBlockSize = getBlockSize(rareRatio)
  const epicBlockSize = getBlockSize(epicRatio)
  const legendaryBlockSize = getBlockSize(legendaryRatio)
  const mythicBlockSize = getBlockSize(mythicRatio)
  const lastBlockSize =
    GRAPH_BLOCK_SIZE -
    trashBlockSize -
    commonBlockSize -
    rareBlockSize -
    epicBlockSize -
    legendaryBlockSize -
    mythicBlockSize

  const graph =
    '🟫'.repeat(trashBlockSize) +
    '🟦'.repeat(commonBlockSize) +
    '🟩'.repeat(rareBlockSize) +
    '🟪'.repeat(epicBlockSize) +
    '🟨'.repeat(legendaryBlockSize) +
    '🟥'.repeat(mythicBlockSize) +
    '⬛'.repeat(lastBlockSize)

  const getPercentage = (ratio: number) => Math.floor(ratio * 100)

  return {
    graph,
    effects,
    allFish,
    ratio: {
      trash: trashRatio,
      common: commonRatio,
      rare: rareRatio,
      epic: epicRatio,
      legendary: legendaryRatio,
      mythic: mythicRatio,
    },
    percentage: {
      trash: getPercentage(trashRatio),
      common: getPercentage(commonRatio),
      rare: getPercentage(rareRatio),
      epic: getPercentage(epicRatio),
      legendary: getPercentage(legendaryRatio),
      mythic: getPercentage(mythicRatio),
    },
  }
}
