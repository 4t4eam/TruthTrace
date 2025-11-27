import { NewsItem } from './newsService';

// 각 국가별, 언어별 뉴스 데이터
export const mockNewsData: NewsItem[] = [
  // ===== 한국 뉴스 (한국어) =====
  {
    id: 'kr-tech-1-ko',
    title: 'AI 기술의 새로운 혁신, 차세대 언어 모델 공개',
    description: '글로벌 기술 기업들이 최신 인공지능 기술을 선보이며 업계에 새로운 바람을 일으키고 있습니다.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '10분 전',
    country: 'South Korea',
    language: 'ko',
    content: '서울 - 국내 주요 기술 기업들이 차세대 인공지능 언어 모델을 공개하며 글로벌 AI 경쟁에 본격 참여합니다. 이번에 공개된 모델은 기존 대비 3배 향상된 성능을 보이며, 한국어 처리 능력에서 특히 뛰어난 성과를 보였습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kr-econ-1-ko',
    title: '반도체 수출 역대 최고치 경신, 경제 성장 견인',
    description: '한국의 반도체 수출이 사상 최고치를 기록하며 국가 경제 성장을 이끌고 있습니다.',
    image: 'https://images.unsplash.com/photo-1591238372408-c0c98de6288a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW1pY29uZHVjdG9yfGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '30분 전',
    country: 'South Korea',
    language: 'ko',
    content: '산업통상자원부 발표에 따르면 지난달 반도체 수출액이 150억 달러를 돌파하며 역대 최고치를 경신했습니다. AI 반도체 수요 급증이 주요 원인으로 분석됩니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kr-politics-1-ko',
    title: '국회, 디지털 전환 촉진법 통과로 미래 산업 육성',
    description: '국회가 디지털 전환을 가속화하기 위한 법안을 통과시키며 관련 산업 발전에 청신호를 보냈습니다.',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '정치',
    time: '1시간 전',
    country: 'South Korea',
    language: 'ko',
    content: '국회 본회의는 오늘 디지털 전환 촉진 및 지원에 관한 법률안을 가결했습니다. 이 법안은 기업의 디지털 혁신을 지원하고 관련 인프라를 구축하는 내용을 담고 있습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kr-sports-1-ko',
    title: 'KBO 리그 개막, 우승 후보는 누구?',
    description: '프로야구 2025 시즌이 개막하며 각 팀의 전력 분석에 관심이 집중되고 있습니다.',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMHN0YWRpdW18ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '스포츠',
    time: '2시간 전',
    country: 'South Korea',
    language: 'ko',
    content: '2025 KBO 리그가 화려한 개막식과 함께 시작되었습니다. 전문가들은 올해 우승 후보로 두산과 KT를 꼽고 있으며, 신인 선수들의 활약도 기대됩니다.',
    createdAt: new Date().toISOString()
  },

  // ===== 한국 뉴스 (영어 번역) =====
  {
    id: 'kr-tech-1-en',
    title: 'New AI Innovation: Next-Generation Language Model Unveiled',
    description: 'Global tech companies are unveiling cutting-edge artificial intelligence technology, bringing fresh momentum to the industry.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '10 min ago',
    country: 'South Korea',
    language: 'en',
    content: 'Seoul - Major Korean tech companies have unveiled next-generation AI language models, marking their full participation in the global AI race. The newly released models show a 3x performance improvement over existing ones, with particularly outstanding results in Korean language processing.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kr-econ-1-en',
    title: 'Semiconductor Exports Hit Record High, Driving Economic Growth',
    description: "Korea's semiconductor exports reach an all-time high, leading the nation's economic growth.",
    image: 'https://images.unsplash.com/photo-1591238372408-c0c98de6288a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW1pY29uZHVjdG9yfGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '30 min ago',
    country: 'South Korea',
    language: 'en',
    content: 'According to the Ministry of Trade, Industry and Energy, semiconductor exports exceeded $15 billion last month, setting a new record. The surge in AI chip demand is identified as the primary driver.',
    createdAt: new Date().toISOString()
  },

  // ===== 미국 뉴스 (영어) =====
  {
    id: 'us-tech-1-en',
    title: 'Silicon Valley Giants Announce Major AI Breakthroughs',
    description: 'Leading tech companies reveal revolutionary artificial intelligence advancements at annual summit.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjM5NzU5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '15 min ago',
    country: 'United States',
    language: 'en',
    content: 'San Francisco - Major Silicon Valley companies showcased groundbreaking AI technologies at their annual developers conference. The innovations promise to reshape how we interact with technology in our daily lives.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'us-econ-1-en',
    title: 'Wall Street Rallies on Strong Economic Data',
    description: 'Stock markets surge as new economic indicators exceed analyst expectations.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwc3RyZWV0fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '45 min ago',
    country: 'United States',
    language: 'en',
    content: 'New York - The Dow Jones and S&P 500 hit new record highs today following the release of better-than-expected employment and GDP figures. Investors are optimistic about sustained economic growth.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'us-politics-1-en',
    title: 'Congress Passes Landmark Climate Legislation',
    description: 'Historic environmental bill gains bipartisan support, setting ambitious carbon reduction targets.',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '정치',
    time: '1 hour ago',
    country: 'United States',
    language: 'en',
    content: 'Washington D.C. - In a rare show of bipartisan cooperation, Congress has passed comprehensive climate legislation aimed at reducing carbon emissions by 50% by 2035.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'us-sports-1-en',
    title: 'NBA Finals Preview: Championship Contenders Emerge',
    description: 'As playoffs heat up, analysts predict the most competitive championship race in years.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZXxlbnwxfHx8fDE3NjM5NzU5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '스포츠',
    time: '2 hours ago',
    country: 'United States',
    language: 'en',
    content: 'With the NBA playoffs in full swing, several teams have emerged as serious championship contenders. Experts predict this could be the most exciting finals in recent memory.',
    createdAt: new Date().toISOString()
  },

  // ===== 미국 뉴스 (한국어 번역) =====
  {
    id: 'us-tech-1-ko',
    title: '실리콘밸리 거대 기업들, 주요 AI 혁신 발표',
    description: '주요 기술 기업들이 연례 정상회담에서 혁명적인 인공지능 발전을 공개했습니다.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjM5NzU5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '15분 전',
    country: 'United States',
    language: 'ko',
    content: '샌프란시스코 - 실리콘밸리의 주요 기업들이 연례 개발자 컨퍼런스에서 획기적인 AI 기술을 선보였습니다. 이러한 혁신은 우리의 일상에서 기술과 상호작용하는 방식을 재편할 것으로 기대됩니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'us-econ-1-ko',
    title: '월스트리트, 강력한 경제 지표에 급등',
    description: '새로운 경제 지표가 분석가들의 예상을 초과하며 주식시장이 급등했습니다.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwc3RyZWV0fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '45분 전',
    country: 'United States',
    language: 'ko',
    content: '뉴욕 - 다우존스와 S&P 500이 예상보다 우수한 고용 및 GDP 수치 발표 이후 오늘 사상 최고치를 경신했습니다. 투자자들은 지속적인 경제 성장에 낙관적입니다.',
    createdAt: new Date().toISOString()
  },

  // ===== 중국 뉴스 (중국어) =====
  {
    id: 'cn-tech-1-zh',
    title: '中国科技巨头发布新一代量子计算机',
    description: '国内领先科技公司在量子计算领域取得重大突破，推动科技创新发展。',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '20分钟前',
    country: 'China',
    language: 'zh',
    content: '北京 - 中国领先的科技公司今天宣布成功研发新一代量子计算机，处理能力比传统超级计算机提升1000倍。这标志着中国在量子计算领域取得重大突破。',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cn-econ-1-zh',
    title: '中国经济增长超预期，消费市场持续繁荣',
    description: '最新经济数据显示中国经济保持强劲增长势头，内需市场活力充沛。',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluYSUyMGVjb25vbXl8ZW58MXx8fHwxNzYzOTQ4NzMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '1小时前',
    country: 'China',
    language: 'zh',
    content: '国家统计局发布的最新数据显示，第一季度GDP增长率达到6.2%，超出市场预期。消费升级和数字经济成为经济增长的主要驱动力。',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cn-politics-1-zh',
    title: '全国人大通过数字经济促进法',
    description: '新法律旨在规范和促进数字经济健康发展，保护数据安全和个人隐私。',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '정치',
    time: '2小时前',
    country: 'China',
    language: 'zh',
    content: '北京 - 全国人民代表大会今日通过《数字经济促进法》，该法律将为数字经济发展提供法律保障，同时加强数据安全和个人信息保护。',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cn-sports-1-zh',
    title: 'CBA总决赛开战，冠军归属成焦点',
    description: '篮球联赛进入白热化阶段，各支球队展开激烈角逐。',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZXxlbnwxfHx8fDE3NjM5NzU5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '스포츠',
    time: '3小时前',
    country: 'China',
    language: 'zh',
    content: 'CBA总决赛今晚拉开帷幕，广东队和辽宁队将展开七场四胜制的冠军争夺战。两队实力相当，比赛悬念十足。',
    createdAt: new Date().toISOString()
  },

  // ===== 중국 뉴스 (한국어 번역) =====
  {
    id: 'cn-tech-1-ko',
    title: '중국 기술 거대 기업, 차세대 양자컴퓨터 발표',
    description: '국내 선도 기술 기업이 양자컴퓨팅 분야에서 큰 돌파구를 마련하며 기술 혁신 발전을 주도합니다.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '20분 전',
    country: 'China',
    language: 'ko',
    content: '베이징 - 중국의 선도 기술 기업이 오늘 차세대 양자컴퓨터 개발에 성공했다고 발표했습니다. 처리 능력이 기존 슈퍼컴퓨터보다 1000배 향상되었으며, 이는 중국이 양자컴퓨팅 분야에서 큰 진전을 이뤘음을 의미합니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cn-econ-1-ko',
    title: '중국 경제 성장 예상 초과, 소비 시장 지속 번영',
    description: '최신 경제 데이터에 따르면 중국 경제가 강력한 성장세를 유지하고 내수 시장이 활기를 띠고 있습니다.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluYSUyMGVjb25vbXl8ZW58MXx8fHwxNzYzOTQ4NzMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '1시간 전',
    country: 'China',
    language: 'ko',
    content: '국가통계국이 발표한 최신 데이터에 따르면 1분기 GDP 성장률이 6.2%에 달해 시장 예상을 상회했습니다. 소비 업그레이드와 디지털 경제가 경제 성장의 주요 동력이 되고 있습니다.',
    createdAt: new Date().toISOString()
  },

  // ===== 일본 뉴스 (일본어) =====
  {
    id: 'jp-tech-1-ja',
    title: '日本企業、次世代ロボット技術を発表',
    description: '国内大手メーカーが人工知能搭載の介護ロボットを開発、高齢化社会の課題解決に期待。',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '30分前',
    country: 'Japan',
    language: 'ja',
    content: '東京 - 日本の大手ロボットメーカーが、AI技術を搭載した次世代介護ロボットを発表しました。高齢化が進む日本社会において、介護人材不足の解決策として期待されています。',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jp-econ-1-ja',
    title: '日経平均、3万5000円台回復で景気回復の兆し',
    description: '株式市場が好調を維持し、企業業績の改善を反映した上昇が続いています。',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwc3RyZWV0fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '1時間前',
    country: 'Japan',
    language: 'ja',
    content: '東京証券取引所で日経平均株価が3万5000円台を回復しました。円安効果と企業の好調な決算が株価上昇の主な要因とされています。',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jp-politics-1-ja',
    title: '国会、デジタル庁の権限拡大法案を可決',
    description: 'デジタル化推進のため、デジタル庁の機能を強化する法案が成立しました。',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '정치',
    time: '2時間前',
    country: 'Japan',
    language: 'ja',
    content: '国会は本日、デジタル庁の権限を拡大し、行政のデジタル化を加速させる法案を可決しました。マイナンバーカードの普及促進も含まれています。',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jp-sports-1-ja',
    title: 'プロ野球開幕、優勝争いが激化の予感',
    description: '2025年シーズンが開幕し、各チームの戦力分析に注目が集まっています。',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMHN0YWRpdW18ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '스포츠',
    time: '3時間前',
    country: 'Japan',
    language: 'ja',
    content: 'プロ野球2025年シーズンが開幕しました。セ・リーグでは阪神と広島、パ・リーグではオリックスとソフトバンクが優勝候補として注目されています。',
    createdAt: new Date().toISOString()
  },

  // ===== 일본 뉴스 (한국어 번역) =====
  {
    id: 'jp-tech-1-ko',
    title: '일본 기업, 차세대 로봇 기술 발표',
    description: '국내 대형 제조사가 인공지능을 탑재한 간호 로봇을 개발하며 고령화 사회 문제 해결에 기대를 모읍니다.',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzOTc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: '기술',
    time: '30분 전',
    country: 'Japan',
    language: 'ko',
    content: '도쿄 - 일본의 대형 로봇 제조사가 AI 기술을 탑재한 차세대 간호 로봇을 발표했습니다. 고령화가 진행되는 일본 사회에서 간호 인력 부족 해결책으로 기대를 모으고 있습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'jp-econ-1-ko',
    title: '닛케이 평균, 3만 5000엔대 회복으로 경기 회복 조짐',
    description: '주식시장이 호조를 유지하며 기업 실적 개선을 반영한 상승이 계속되고 있습니다.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwc3RyZWV0fGVufDF8fHx8MTc2Mzk0ODczM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: '경제',
    time: '1시간 전',
    country: 'Japan',
    language: 'ko',
    content: '도쿄증권거래소에서 닛케이 평균 주가가 3만 5000엔대를 회복했습니다. 엔화 약세 효과와 기업들의 호조로운 실적이 주가 상승의 주요 요인으로 분석됩니다.',
    createdAt: new Date().toISOString()
  },
];
