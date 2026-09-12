import { env } from '@/lib/config/env';

type ISurveyLink = {
  label: string;
  link?: string | null;
};

export function SurveyLink(props: ISurveyLink) {
  const { label, link } = props;

  if (!env.NEXT_PUBLIC_ENABLE_SURVEY || !link) {
    return null;
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-small text-primary-cta underline underline-offset-2 hover:text-primary-hover transition-colors text-center"
    >
      {label}
    </a>
  );
}

export default SurveyLink;
