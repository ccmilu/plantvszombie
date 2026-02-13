const IMG = '/images/'

/** 所有素材路径映射 */
export const ASSET_MAP = {
  // ---------- 背景 ----------
  background: `${IMG}Background.jpg`,

  // ---------- UI ----------
  card: `${IMG}Card.png`,
  shop: `${IMG}Shop.png`,
  button: `${IMG}Button.png`,
  shovel: `${IMG}Shovel.png`,
  shovelBank: `${IMG}ShovelBank.png`,
  lawnMower: `${IMG}LawnMower.png`,
  zombiesWon: `${IMG}ZombiesWon.png`,

  // ---------- 子弹 ----------
  pea: `${IMG}Pea.png`,
  peaSnow: `${IMG}PeaSnow.png`,

  // ---------- 特效 ----------
  sun: `${IMG}Sun.gif`,
  boom: `${IMG}Boom.gif`,
  burn: `${IMG}Burn.gif`,

  // ---------- 植物动画（GIF） ----------
  sunflowerAnim: `${IMG}SunFlower.gif`,
  peashooterAnim: `${IMG}Peashooter.gif`,
  wallnutAnim: `${IMG}WallNut.gif`,
  wallnut1Anim: `${IMG}WallNut1.gif`,
  wallnut2Anim: `${IMG}WallNut2.gif`,
  snowpeaAnim: `${IMG}SnowPea.gif`,
  cherryBombAnim: `${IMG}CherryBomb.gif`,
  repeaterAnim: `${IMG}Repeater.gif`,
  potatoMine1Anim: `${IMG}PotatoMine1.gif`,
  potatoMineAnim: `${IMG}PotatoMine.gif`,
  potatoMineBombAnim: `${IMG}PotatoMineBomb.gif`,

  // ---------- 植物卡面（PNG） ----------
  sunflowerCard: `${IMG}SunFlower.png`,
  peashooterCard: `${IMG}Peashooter.png`,
  wallnutCard: `${IMG}WallNut.png`,
  snowpeaCard: `${IMG}SnowPea.png`,
  cherryBombCard: `${IMG}CherryBomb.png`,
  repeaterCard: `${IMG}Repeater.png`,
  potatoMineCard: `${IMG}PotatoMine.png`,

  // ---------- 僵尸（GIF） ----------
  zombieWalk1: `${IMG}ZombieWalk1.gif`,
  zombieWalk2: `${IMG}ZombieWalk2.gif`,
  zombieAttack: `${IMG}ZombieAttack.gif`,
  zombieDie: `${IMG}ZombieDie.gif`,
  zombieHead: `${IMG}ZombieHead.gif`,

  coneZombieWalk: `${IMG}ConeZombieWalk.gif`,
  coneZombieAttack: `${IMG}ConeZombieAttack.gif`,

  bucketZombieWalk: `${IMG}BucketZombieWalk.gif`,
  bucketZombieAttack: `${IMG}BucketZombieAttack.gif`,

  screenZombieWalk: `${IMG}ScreenZombieWalk.gif`,
  screenZombieAttack: `${IMG}ScreenZombieAttack.gif`,

  footballZombieWalk: `${IMG}FootballZombieWalk.gif`,
  footballZombieAttack: `${IMG}FootballZombieAttack.gif`,
  footballZombieDie: `${IMG}FootballZombieDie.gif`,
} as const

export type AssetKey = keyof typeof ASSET_MAP
