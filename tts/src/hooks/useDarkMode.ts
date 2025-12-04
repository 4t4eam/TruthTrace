import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 사용자의 시스템 다크모드 설정 확인
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 초기 다크모드 상태 설정
    setIsDarkMode(mediaQuery.matches);
    
    // HTML 요소에 dark 클래스 추가/제거
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 시스템 다크모드 설정 변경 감지
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
}
