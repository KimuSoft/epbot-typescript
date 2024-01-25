export enum FishRarity {
  Trash,
  Common,
  Rare,
  Epic,
  Legendary,
  Mythic,
}

export enum BuildingType {
  // 미분류
  None,
  // 매표소 계열
  TicketBox,
  // 식당 계열
  Restaurant,
  // 창고 계열
  Warehouse,
  // 청소 계열
  Cleaning,
  // 기념품 계열
  Souvenir,
  // 동상 계열
  Statue,
  // 쓰레기 계열
  Trash,
  // 교육 계열
  Education,
  // 발전소 계열
  PowerPlant,
  // 업그레이드 계열
  Upgrade,
  // 뭐지 계열
  What,
  // 끝이야 계열
  End,
}

export interface StatEffect {
  // 설정 가능 수수료 기본값
  fee: number
  // 설정 가능 수수료 플러스, 마이너스 범위
  feeRange: number
  // 설정 가능 수수료 최소치 감소값
  feeMinDown: number
  // 설정 가능 수수료 최대치 증가값
  feeMaxUp: number

  // 유지비
  maintenance: number

  // 턴 당 물고기가 낚일 확률 보정치
  fishPointChance: number
  // 턴 당 페이크 확률 보정치
  fakeChance: number

  // 쓰레기 확률표본 증가치
  trashSample: number
  // 일반 물고기 확률표본 증가치
  commonSample: number
  // 희귀 물고기 확률표본 증가치
  rareSample: number
  // 매우 희귀 물고기 확률표본 증가치
  epicSample: number
  // 전설 물고기 확률표본 증가치
  legendarySample: number
  // 환상(초전설) 물고기 확률표본 증가치
  mythicSample: number

  // 낚이는 물고기 가격 계수
  fishPriceCoef: number
  // 낚시로 인한 명성 획득량 계수
  expCoef: number
}

export type PartialStatEffect = Partial<StatEffect>
