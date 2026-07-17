
const locales = 'en-US';

export const formatter = {
  // 1. Admin Table: Detailed with 24h time for precision
  admin: new Intl.DateTimeFormat(locales, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),

  // 2. Public/Blog: Friendly and readable (e.g., "October 24, 2025")
  public: new Intl.DateTimeFormat(locales, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),

  // 3. Short/Compact: For small badges or mobile views (e.g., "Oct 24")
  short: new Intl.DateTimeFormat(locales, {
    month: 'short',
    day: 'numeric',
  }),

  // 4. Numeric: Standard data format (e.g., "02-08-26, 20:24")
  numeric: new Intl.DateTimeFormat(locales, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),
};

export const formatDate = (date: string| null, type: keyof typeof formatter = 'public') => {
  if (!date) return "—";
  const formatted = formatter[type].format(new Date(date));
  return type === 'numeric' ? formatted.replace(/\//g, '-') : formatted;
};

// import { match, P } from 'ts-pattern';

// export const smartFormatDate = (date: string | null | undefined) => 
//   match(date)
//     .with(P.nullish, () => "N/A")
//     .with(P.string.minLength(1), (val) => formatter.format(new Date(val)))
//     .otherwise(() => "Invalid Date");