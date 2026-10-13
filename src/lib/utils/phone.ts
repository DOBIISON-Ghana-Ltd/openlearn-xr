export const GHANA_PHONE_REGEX = /^\+233(20|23|24|26|27|50|53|54|55|56|57|59)\d{7}$/;

export const parser = {
  in: (value: string | null | undefined): string => {
    if (!value) return "";
    return value.slice(4);
  },

  out: (value: string): string | null => {
    if (!value || value.trim() === "") return null;
    return `+233${value.trim()}`;
  },
};
