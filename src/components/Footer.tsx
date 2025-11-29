import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const sections = [
    {
      title: t('footer.news'),
      links: [
        { label: t('category.politics'), href: '#' },
        { label: t('category.economy'), href: '#' },
        { label: t('category.society'), href: '#' },
        { label: t('category.tech'), href: '#' },
        { label: t('category.world'), href: '#' },
      ]
    },
    {
      title: t('footer.opinion'),
      links: [
        { label: t('footer.editorials'), href: '#' },
        { label: t('footer.columns'), href: '#' },
        { label: t('footer.contributors'), href: '#' },
        { label: t('footer.letters'), href: '#' },
      ]
    },
    {
      title: t('footer.more'),
      links: [
        { label: t('footer.multimedia'), href: '#' },
        { label: t('footer.photography'), href: '#' },
        { label: t('footer.video'), href: '#' },
        { label: t('footer.newsletters'), href: '#' },
      ]
    },
    {
      title: t('footer.subscribe'),
      links: [
        { label: t('footer.home.delivery'), href: '#' },
        { label: t('footer.digital'), href: '#' },
        { label: t('footer.gift'), href: '#' },
        { label: t('footer.group'), href: '#' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
  ];

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* 로고 및 구독 섹션 */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900 dark:text-white">
            The Times
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            {t('footer.tagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900/90 dark:bg-white/90 text-white dark:text-black backdrop-blur-sm hover:bg-gray-900 dark:hover:bg-white hover:scale-105 transition-all duration-200 text-sm shadow-lg"
            >
              <Mail className="w-4 h-4" />
              {t('footer.newsletter.subscribe')}
            </a>
          </div>
        </div>

        {/* 링크 섹션 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 소셜 미디어 및 하단 링크 */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* 소셜 미디어 */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-125 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* 하단 링크 */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {t('footer.contact')}
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {t('footer.about')}
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {t('footer.terms')}
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                {t('footer.help')}
              </a>
            </div>
          </div>

          {/* 저작권 */}
          <div className="mt-8 text-xs text-gray-500 dark:text-gray-500">
            <p>© 2025 The Times. {t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}