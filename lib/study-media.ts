export const studyMedia = {
  filmbotCinema: "https://cdn.prod.website-files.com/69e728fd7d249fa8056e937d/6a36b3a1bbe438f1cba806f2_FILMBOT_FRIDA_CINEMA_ALIGN_MEDIA_2025_048.webp",
  spirePoster: "https://assets.awwwards.com/awards/external/2019/02/5c5ff277a55d6383610598_static.jpeg",
  kaito: "https://assets.awwwards.com/awards/element/2025/04/67ff66f98886c388284553.mp4",
  inkfishPoster: "https://assets.awwwards.com/awards/element/2024/05/6633de096cd32411928842_static.jpeg",
  inkfishFilm: "https://player.vimeo.com/progressive_redirect/playback/879455273/rendition/1080p/file.mp4?loc=external&log_user=0&signature=46a7007bd014d03478e7afb3d447617d7eaaa4c682d4cc18a4fbd3b5b8c2043f",
  inkfishDetailFilm: "https://player.vimeo.com/progressive_redirect/playback/530061866/rendition/1080p/file.mp4?loc=external&log_user=0&signature=c04da394988913e2c285470238bfb09e8e9dd1d873da444fcbcbc8dc9ba4b8e2",
  noomoModel: "https://labs.noomoagency.com/models/Scene14.glb",
  noomoHdr: "https://labs.noomoagency.com/hdri/photo_studio_01_1k.hdr",
  lawtedScene: "https://www.lawted.tech/3D/scene.splinecode",
  hungSmall: "https://cdn.prod.website-files.com/631c765413b393038861bc7c/631c765413b39380ea61c221_Wall_Pills_Small.webp",
  hungBig: "https://cdn.prod.website-files.com/631c765413b393038861bc7c/631c765413b393b01f61c229_Wall_Pills_Big.png",
  scaleModel: "https://scfo.de/knight.glb",
} as const

// 映射横向行程
export function horizontalOffset(progress: number, panels: number) {
  if (progress <= 0) return 0
  return -Math.min(1, progress) * (panels - 1) / panels * 100
}
