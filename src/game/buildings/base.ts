import { BuildingType, PartialStatEffect } from '../../types/types'

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
