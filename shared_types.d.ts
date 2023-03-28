export type APIKey = {
  key: string;
};

export type User = {
  id: string,
  name: string;
};
export type ConnectionInfo = {id: string} & APIKey
export type UserOrder = (typeof user.id)[];

export type SearchQuery = {
  query: string;
};


export type DevSong = {
  title: string;
};
export type Song = {
  title: string,
  album: string,
  artist: string,
  songLink: string,
  imgLink: string;
};
export type PlayingSong = {
  song: Song,
  time: {
    current: number,
    total: number;
  },
  paused: boolean,
  requester: User;
};

export type SingleQueue = {
  user: User,
  songs: Song[];
};
export type EntireQueue = {
  data: SingleQueue[],
  order: UserOrder;
};

export type UserChangeData = {
  user: User,
  order: UserOrder;
};
export type NewUserData = UserChangeData & {
  songs?: Song[]
}
export type NewSongData = {
  user: User,
  song: Song;
};