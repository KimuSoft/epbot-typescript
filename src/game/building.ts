import { Building } from './buildings/base'
import { FreshWater, Port } from './buildings/etc'

const buildings: (typeof Building)[] = [Port, FreshWater]

export const findBuilding = (id: string): typeof Building | null => {
  return buildings.find((b) => b.id === id) ?? null
}
