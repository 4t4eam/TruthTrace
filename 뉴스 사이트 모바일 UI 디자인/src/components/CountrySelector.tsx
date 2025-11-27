import ReactFlagsSelect from 'react-flags-select';
import { useEffect, useState } from 'react';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

// 국가명과 국가 코드 매핑
const countryCodeMap: Record<string, string> = {
  'United States': 'US',
  'South Korea': 'KR',
  'China': 'CN',
  'Japan': 'JP'
};

const countryNameMap: Record<string, string> = {
  'US': 'United States',
  'KR': 'South Korea',
  'CN': 'China',
  'JP': 'Japan'
};

export function CountrySelector({ selectedCountry, onCountrySelect }: CountrySelectorProps) {
  const [selected, setSelected] = useState(countryCodeMap[selectedCountry] || 'KR');
  const [isMobile, setIsMobile] = useState(false);

  const handleSelect = (code: string) => {
    setSelected(code);
    const countryName = countryNameMap[code];
    if (countryName) {
      onCountrySelect(countryName);
    }
  };

  // selectedCountry가 외부에서 변경되면 업데이트
  useEffect(() => {
    const code = countryCodeMap[selectedCountry];
    if (code && code !== selected) {
      setSelected(code);
    }
  }, [selectedCountry]);

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="country-selector-wrapper">
      <ReactFlagsSelect
        selected={selected}
        onSelect={handleSelect}
        countries={['US', 'KR', 'CN', 'JP']}
        customLabels={{
          US: 'United States',
          KR: 'South Korea',
          CN: 'China',
          JP: 'Japan'
        }}
        placeholder="Select Country"
        searchable={false}
        showSelectedLabel={!isMobile}
        showSecondarySelectedLabel={false}
        showOptionLabel={true}
        selectButtonClassName="country-select-button"
        className="country-flag-select"
      />
      <style>{`
        /* react-flags-select 커스텀 스타일 */
        .country-selector-wrapper {
          display: inline-block;
        }
        
        .country-flag-select button {
          background: transparent !important;
          border: none !important;
          padding: 6px 12px !important;
          font-size: 14px !important;
          border-radius: 2px !important;
          transition: background-color 0.2s ease !important;
          color: rgb(55, 65, 81) !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .dark .country-flag-select button {
          color: rgb(209, 213, 219) !important;
        }
        
        .country-flag-select button:hover {
          background: rgb(249, 250, 251) !important;
        }

        .dark .country-flag-select button:hover {
          background: rgb(17, 24, 39) !important;
        }
        
        /* 국기 이미지는 항상 표시 */
        .country-flag-select button img,
        .country-flag-select img {
          width: 20px !important;
          height: 15px !important;
          display: inline-block !important;
          margin-right: 0px !important;
        }

        /* 드롭다운 화살표 스타일 */
        .country-flag-select .arrow-down,
        .country-flag-select .arrow-up {
          border-top: 5px solid currentColor !important;
          border-right: 4px solid transparent !important;
          border-left: 4px solid transparent !important;
          border-bottom: none !important;
          width: 0 !important;
          height: 0 !important;
          margin-left: 4px !important;
        }

        .country-flag-select .arrow-up {
          border-bottom: 5px solid currentColor !important;
          border-top: none !important;
        }

        /* 모바일에서 화살표 숨기기 */
        @media (max-width: 640px) {
          .country-flag-select .arrow-down,
          .country-flag-select .arrow-up {
            display: none !important;
          }
          
          /* 버튼 패딩 조정 */
          .country-flag-select button {
            padding: 6px 8px !important;
          }
        }
        
        .country-flag-select ul {
          background: white !important;
          border: 1px solid rgb(229, 231, 235) !important;
          border-radius: 2px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          margin-top: 8px !important;
          max-height: 320px !important;
          overflow-y: auto !important;
          min-width: 192px !important;
        }

        .dark .country-flag-select ul {
          background: black !important;
          border-color: rgb(31, 41, 55) !important;
        }
        
        .country-flag-select ul li {
          padding: 10px 16px !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          color: rgb(75, 85, 99) !important;
        }

        .dark .country-flag-select ul li {
          color: rgb(156, 163, 175) !important;
        }
        
        .country-flag-select ul li:hover {
          background: rgb(249, 250, 251) !important;
          color: rgb(17, 24, 39) !important;
        }

        .dark .country-flag-select ul li:hover {
          background: rgb(17, 24, 39) !important;
          color: white !important;
        }
        
        .country-flag-select ul li.selected {
          background: rgb(243, 244, 246) !important;
          color: rgb(17, 24, 39) !important;
        }

        .dark .country-flag-select ul li.selected {
          background: rgb(17, 24, 39) !important;
          color: white !important;
        }
        
        .country-flag-select ul li img {
          margin-right: 8px !important;
        }
      `}</style>
    </div>
  );
}