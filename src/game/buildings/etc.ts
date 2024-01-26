import { BuildingType, PartialStatEffect } from '../../types/types'
import { Building } from './base'

export class Port extends Building {
  static id = 'HG'
  static emoji = '🚢'

  static buildingType = BuildingType.None
  static buildingName = '항구'
  static description =
    '항구를 통해 무역에 나섭니다. 무역을 통해 벌어온 돈으로 유지비를 아낄 수 있겠죠?'

  static tier = 2
  static price = 2000
  static effects: PartialStatEffect = {
    maintenance: -10,
    trashSample: 30,
  }
}

export class FreshWater extends Building {
  static id = 'DSHSS'
  static emoji = '🚰'

  static buildingType = BuildingType.None
  static buildingName = '담수화 시설'
  static description = '바닷물을 마실 수 있는 물로 정화해 주는 시설이에요!'

  static tier = 3
  static price = 5000
  static effects: PartialStatEffect = {
    maintenance: -3,
  }
}
