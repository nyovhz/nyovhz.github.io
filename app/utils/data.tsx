const xBiomediaItems: MediaType[] = [
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1769674378/rightside_final_alpha_rz8dm8.png",
    title: "right"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1769674379/frontside_final_alpha_gvlkxm.png",
    title: "front"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1769674378/leftside_final_alpha_ka6ec6.png",
    title: "left"
  },
]

const xPDWorldmediaItems: MediaType[] = [
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1784579585/liveact_01_jhwe3k.jpg",
    title: "globe"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1769674790/Captura_de_pantalla_2026-01-28_181708_xyvdyl.png",
    title: "globe"
  },
    {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1784579902/liveact_02_sljswg.jpg",
    title: "globe"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1769674789/Captura_de_pantalla_2026-01-28_182208_av6yzl.png",
    title: "networks"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1769674789/Captura_de_pantalla_2026-01-28_182820_qw8i7i.png",
    title: "interfaz"
  }
]

const x3DmediaItems: MediaType[] = [
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1768597885/fb2e50e3-7254-4c53-918f-bdf57f5c5bef_ruede4.png",
    title: "Ryu"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1768892264/casee____uwisdz.png",
    title: "Visual Experiment 01",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1768600305/CASE_BLACK_wz2av3.png",
    title: "Realtime Motion System",
  },
];

const xAImediaItems: MediaType[] = [
  {
    type: "video",
    src: "https://res.cloudinary.com/dp39ooacq/video/upload/v1748370907/Professional_Mode_The_camera_remains_completely_st_vwsywj.mp4",
    title: "Ryu"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1748373754/x_z5uj4u.png",
    title: "Visual Experiment 01",
  },
  {
    type: "video",
    src: "https://res.cloudinary.com/dp39ooacq/video/upload/v1748369810/spiral_stairs_scene_qld8xn.mp4",
    title: "Realtime Motion System",
  },
];

const xCCmediaItems: MediaType[] = [
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1768598380/sketch-000270_1_jih0y2.tiff",
    title: "Ryu"
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1768589461/mmh_mwwrat.png",
    title: "Visual Experiment 01",
  },
  {
    type: "image",
    src: "https://res.cloudinary.com/dp39ooacq/image/upload/v1768589461/cd_dlukij.png",
    title: "Realtime Motion System",
  },
];

type MediaType = {
  type: "image" | "video";
  src: string;
  title?: string;
};

const optimizeCloudinaryUrl = (
  url: string,
  width = 1920,
  type: "image" | "video" = "image"
) => {
  const base =
    type === "image"
      ? `f_auto,q_auto,w_${width}`
      : `f_auto,q_auto,w_${width},vc_auto`;

  return url.replace("/upload/", `/upload/${base}/`);
};


export const data = {
    xAImediaItems,
    xPDWorldmediaItems,
    x3DmediaItems,
    xCCmediaItems,
    xBiomediaItems,
    optimizeCloudinaryUrl
}