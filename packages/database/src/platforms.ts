export const platforms = [
  {
    title: "애플뮤직",
    icon: "/platform/apple-music.svg",
    id: "apple-music",
    disabled: true,
  },
  {
    title: "스포티파이",
    icon: "/platform/spotify.svg",
    id: "spotify",
    url: "/spotify/start",
    disabled: false,
  },
  {
    title: "유튜브뮤직",
    icon: "/platform/yt-music.svg",
    id: "yt-music",
    disabled: false,
  },
  {
    title: "사운드클라우드",
    icon: "/platform/sound-cloud.svg",
    id: "sound-cloud",
    disabled: true,
  },
  {
    title: "직접입력",
    icon: "/platform/text.svg",
    id: "text",
    disabled: false,
  },
  {
    title: "검색",
    icon: "/platform/search.svg",
    id: "search",
    disabled: true,
  },
];

export const platformIds = platforms.map((platform) => platform.id);
