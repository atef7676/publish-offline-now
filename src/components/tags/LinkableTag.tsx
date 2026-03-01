import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const generateTagSlug = (tag: string) => {
  return tag.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
};

const LinkableTag = ({ tag, tagAr, className = '' }: { tag: string; tagAr?: string; className?: string }) => {
  const { isRTL } = useLanguage();
  const slug = generateTagSlug(tag);
  const displayText = isRTL && tagAr ? tagAr : tag;

  return (
    <Link
      to={`/tags/${slug}`}
      className={`sahfy-chip cursor-pointer hover:bg-primary/20 transition-colors ${className}`}
      onClick={(e) => e.stopPropagation()}
      title={tagAr ? `${tag} / ${tagAr}` : tag}
    >
      {displayText}
    </Link>
  );
};

export default LinkableTag;
