// Auth payloads from the PENTANA API. Bill payloads live with their mapper in `data/`.

export type User = {
  id: number;
  name: string;
  nickname: string | null;
  display_name: string;
  email: string;
  member_category: string | null;
  credit: number;
  is_admin: boolean;
};

export type LoginResponse = { token: string; user: User };

/** Laravel resource collections wrap their payload in `data`. */
export type Wrapped<T> = { data: T };
