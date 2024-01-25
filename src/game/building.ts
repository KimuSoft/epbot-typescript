import { BuildingType, PartialStatEffect, StatEffect } from '../types/types'
import { FreshWater, Port } from './buildings/etc'

export abstract class Building {
  static id: string
  static emoji: string = '🏢'

  static buildingType: BuildingType
  static buildingName: string
  static description: string = ''

  // 시설 성능
  static tier: number = 1
  static price: number
  static effects: PartialStatEffect = {} as PartialStatEffect
}

const buildings: (typeof Building)[] = [Port, FreshWater]

export const findBuilding = (id: string): typeof Building | null => {
  return buildings.find((b) => b.id === id) ?? null
}
