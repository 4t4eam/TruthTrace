// Facto AI 분석 서비스
// 추후 실제 AI API (OpenAI, Claude 등)로 대체 가능

export interface FactoAnalysisResult {
  credibilityScore: number; // 0-100
  verdict: 'true' | 'mostly-true' | 'mixed' | 'mostly-false' | 'false' | 'unverifiable';
  summary: string;
  keyFindings: Array<{
    claim: string;
    status: 'verified' | 'disputed' | 'false' | 'unverifiable';
    explanation: string;
  }>;
  sources: Array<{
    title: string;
    url: string;
    credibility: 'high' | 'medium' | 'low';
  }>;
  context: string;
  warnings: string[];
}

export class FactoService {
  /**
   * 텍스트를 분석하여 사실 확인 결과를 반환합니다.
   * @param text 분석할 텍스트
   * @param language 언어 코드 (en, ko, zh, ja)
   * @returns 분석 결과
   */
  static async analyzeText(text: string, language: string = 'en'): Promise<FactoAnalysisResult> {
    // 실제 AI API 호출 시뮬레이션
    await this.simulateApiDelay();

    // 예시 데이터 - 실제로는 AI API 응답을 여기서 처리
    return this.getMockAnalysis(text, language);
  }

  /**
   * AI API 호출 시뮬레이션 (실제 API 대기 시간)
   */
  private static async simulateApiDelay(): Promise<void> {
    const delay = 2000 + Math.random() * 1000; // 2-3초
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * 예시 분석 결과 생성
   * 실제 구현 시 이 함수를 AI API 호출로 대체
   */
  private static getMockAnalysis(text: string, language: string): FactoAnalysisResult {
    const examples = this.getExamplesByLanguage(language);
    
    // 텍스트 길이와 내용에 따라 다른 예시 반환
    if (text.toLowerCase().includes('moon') || text.toLowerCase().includes('달')) {
      return examples.moonLanding;
    } else if (text.toLowerCase().includes('water') || text.toLowerCase().includes('물')) {
      return examples.waterIntake;
    } else {
      return examples.general;
    }
  }

  /**
   * 언어별 예시 데이터
   */
  private static getExamplesByLanguage(language: string): Record<string, FactoAnalysisResult> {
    const examples: Record<string, Record<string, FactoAnalysisResult>> = {
      en: {
        moonLanding: {
          credibilityScore: 98,
          verdict: 'false',
          summary: 'The claim that the moon landing was filmed in a Hollywood studio is a widely debunked conspiracy theory. Overwhelming evidence supports the authenticity of the Apollo 11 moon landing in 1969.',
          keyFindings: [
            {
              claim: 'Moon landing was filmed in a studio',
              status: 'false',
              explanation: 'Independent verification from multiple countries, physical evidence (moon rocks), and thousands of witnesses confirm the authenticity of the moon landing.'
            },
            {
              claim: 'Technology was not advanced enough in 1969',
              status: 'false',
              explanation: 'Historical records and technical documentation prove that the technology existed and was successfully developed through the Apollo program.'
            }
          ],
          sources: [
            {
              title: 'NASA - Apollo 11 Mission Overview',
              url: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html',
              credibility: 'high'
            },
            {
              title: 'Smithsonian - Moon Landing Evidence',
              url: 'https://airandspace.si.edu/explore-and-learn/topics/apollo',
              credibility: 'high'
            }
          ],
          context: 'The Apollo 11 mission successfully landed humans on the Moon on July 20, 1969. This achievement has been independently verified by multiple countries and scientific institutions worldwide.',
          warnings: ['This is a known conspiracy theory that has been repeatedly debunked by experts.']
        },
        waterIntake: {
          credibilityScore: 45,
          verdict: 'mixed',
          summary: 'The "8 glasses of water per day" recommendation is oversimplified. Hydration needs vary significantly based on individual factors such as body size, activity level, climate, and overall health.',
          keyFindings: [
            {
              claim: 'Everyone needs exactly 8 glasses of water daily',
              status: 'disputed',
              explanation: 'Scientific evidence shows that hydration needs vary greatly among individuals. There is no universal "8 glasses" rule.'
            },
            {
              claim: 'Hydration is important for health',
              status: 'verified',
              explanation: 'Proper hydration is indeed essential for various bodily functions, but the specific amount varies by person and circumstances.'
            }
          ],
          sources: [
            {
              title: 'Harvard Health - How much water should you drink?',
              url: 'https://www.health.harvard.edu/staying-healthy/how-much-water-should-you-drink',
              credibility: 'high'
            },
            {
              title: 'Mayo Clinic - Water: How much should you drink every day?',
              url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
              credibility: 'high'
            }
          ],
          context: 'The "8x8 rule" (eight 8-ounce glasses of water per day) is a simplified guideline. Modern medical advice considers multiple factors including diet, activity, and climate when determining individual hydration needs.',
          warnings: ['Oversimplified health claims may not apply to everyone.']
        },
        general: {
          credibilityScore: 60,
          verdict: 'unverifiable',
          summary: 'The provided statement requires more context and specific claims to perform a thorough fact-check. Some elements may be accurate while others need verification.',
          keyFindings: [
            {
              claim: 'Main claim from the text',
              status: 'unverifiable',
              explanation: 'Insufficient information or reliable sources to fully verify this claim. More specific details would be needed for accurate fact-checking.'
            }
          ],
          sources: [
            {
              title: 'Reuters Fact Check',
              url: 'https://www.reuters.com/fact-check',
              credibility: 'high'
            },
            {
              title: 'FactCheck.org',
              url: 'https://www.factcheck.org',
              credibility: 'high'
            }
          ],
          context: 'For accurate fact-checking, please provide more specific claims or context.',
          warnings: ['Unable to fully verify without more specific information.']
        }
      },
      ko: {
        moonLanding: {
          credibilityScore: 98,
          verdict: 'false',
          summary: '달 착륙이 할리우드 스튜디오에서 촬영되었다는 주장은 널리 반박된 음모론입니다. 1969년 아폴로 11호의 달 착륙이 실제로 이루어졌다는 압도적인 증거가 있습니다.',
          keyFindings: [
            {
              claim: '달 착륙이 스튜디오에서 촬영되었다',
              status: 'false',
              explanation: '여러 국가의 독립적인 검증, 물리적 증거(달 암석), 수천 명의 목격자가 달 착륙의 진위를 확인했습니다.'
            },
            {
              claim: '1969년 기술이 충분히 발전하지 않았다',
              status: 'false',
              explanation: '역사적 기록과 기술 문서가 아폴로 프로그램을 통해 기술이 존재했고 성공적으로 개발되었음을 증명합니다.'
            }
          ],
          sources: [
            {
              title: 'NASA - 아폴로 11호 임무 개요',
              url: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html',
              credibility: 'high'
            },
            {
              title: 'Smithsonian - 달 착륙 증거',
              url: 'https://airandspace.si.edu/explore-and-learn/topics/apollo',
              credibility: 'high'
            }
          ],
          context: '아폴로 11호 임무는 1969년 7월 20일 인류를 달에 성공적으로 착륙시켰습니다. 이 성과는 전 세계 여러 국가와 과학 기관에 의해 독립적으로 검증되었습니다.',
          warnings: ['이것은 전문가들에 의해 반복적으로 반박된 알려진 음모론입니다.']
        },
        waterIntake: {
          credibilityScore: 45,
          verdict: 'mixed',
          summary: '"하루 8잔의 물" 권장량은 지나치게 단순화된 것입니다. 수분 필요량은 체격, 활동량, 기후, 전반적인 건강 상태 등 개인적 요인에 따라 크게 달라집니다.',
          keyFindings: [
            {
              claim: '모든 사람이 하루에 정확히 8잔의 물이 필요하다',
              status: 'disputed',
              explanation: '과학적 증거는 수분 필요량이 개인마다 크게 다르다는 것을 보여줍니다. 보편적인 "8잔" 규칙은 없습니다.'
            },
            {
              claim: '수분 공급은 건강에 중요하다',
              status: 'verified',
              explanation: '적절한 수분 공급은 실제로 다양한 신체 기능에 필수적이지만, 구체적인 양은 개인과 상황에 따라 다릅니다.'
            }
          ],
          sources: [
            {
              title: 'Harvard Health - 물을 얼마나 마셔야 할까요?',
              url: 'https://www.health.harvard.edu/staying-healthy/how-much-water-should-you-drink',
              credibility: 'high'
            },
            {
              title: 'Mayo Clinic - 물: 하루에 얼마나 마셔야 할까요?',
              url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
              credibility: 'high'
            }
          ],
          context: '"8x8 규칙"(하루 8온스 물 8잔)은 단순화된 지침입니다. 현대 의학 조언은 개인의 수분 필요량을 결정할 때 식단, 활동, 기후를 포함한 여러 요인을 고려합니다.',
          warnings: ['지나치게 단순화된 건강 주장은 모든 사람에게 적용되지 않을 수 있습니다.']
        },
        general: {
          credibilityScore: 60,
          verdict: 'unverifiable',
          summary: '제공된 진술은 철저한 사실 확인을 수행하기 위해 더 많은 맥락과 구체적인 주장이 필요합니다. 일부 요소는 정확할 수 있지만 다른 요소는 검증이 필요합니다.',
          keyFindings: [
            {
              claim: '텍스트의 주요 주장',
              status: 'unverifiable',
              explanation: '이 주장을 완전히 검증하기에는 정보나 신뢰할 수 있는 출처가 불충분합니다. 정확한 사실 확인을 위해서는 더 구체적인 세부 정보가 필요합니다.'
            }
          ],
          sources: [
            {
              title: 'Reuters Fact Check',
              url: 'https://www.reuters.com/fact-check',
              credibility: 'high'
            },
            {
              title: 'FactCheck.org',
              url: 'https://www.factcheck.org',
              credibility: 'high'
            }
          ],
          context: '정확한 사실 확인을 위해서는 더 구체적인 주장이나 맥락을 제공해 주세요.',
          warnings: ['더 구체적인 정보 없이는 완전히 검증할 수 없습니다.']
        }
      },
      zh: {
        moonLanding: {
          credibilityScore: 98,
          verdict: 'false',
          summary: '登月是在好莱坞摄影棚拍摄的说法是一个被广泛驳斥的阴谋论。有压倒性的证据支持1969年阿波罗11号登月的真实性。',
          keyFindings: [
            {
              claim: '登月是在摄影棚拍摄的',
              status: 'false',
              explanation: '来自多个国家的独立验证、物理证据（月球岩石）和数千名目击者确认了登月的真实性。'
            },
            {
              claim: '1969年技术还不够先进',
              status: 'false',
              explanation: '历史记录和技术文档证明该技术存在并通过阿波罗计划成功开发。'
            }
          ],
          sources: [
            {
              title: 'NASA - 阿波罗11号任务概述',
              url: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html',
              credibility: 'high'
            },
            {
              title: 'Smithsonian - 登月证据',
              url: 'https://airandspace.si.edu/explore-and-learn/topics/apollo',
              credibility: 'high'
            }
          ],
          context: '阿波罗11号任务于1969年7月20日成功将人类送上月球。这一成就已被全球多个国家和科学机构独立验证。',
          warnings: ['这是一个已被专家反复驳斥的已知阴谋论。']
        },
        waterIntake: {
          credibilityScore: 45,
          verdict: 'mixed',
          summary: '"每天8杯水"的建议过于简化。水分需求因体型、活动水平、气候和整体健康状况等个人因素而有很大差异。',
          keyFindings: [
            {
              claim: '每个人每天需要正好8杯水',
              status: 'disputed',
              explanation: '科学证据表明，水分需求因人而异。没有普遍的"8杯"规则。'
            },
            {
              claim: '水分对健康很重要',
              status: 'verified',
              explanation: '适当的水分补充确实对各种身体功能至关重要，但具体数量因人和情况而异。'
            }
          ],
          sources: [
            {
              title: 'Harvard Health - 应该喝多少水？',
              url: 'https://www.health.harvard.edu/staying-healthy/how-much-water-should-you-drink',
              credibility: 'high'
            },
            {
              title: 'Mayo Clinic - 水：每天应该喝多少？',
              url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
              credibility: 'high'
            }
          ],
          context: '"8x8规则"（每天8杯8盎司的水）是一个简化的指南。现代医学建议在确定个人水分需求时考虑包括饮食、活动和气候在内的多个因素。',
          warnings: ['过于简化的健康声明可能不适用于所有人。']
        },
        general: {
          credibilityScore: 60,
          verdict: 'unverifiable',
          summary: '提供的陈述需要更多背景和具体声明才能进行彻底的事实核查。某些元素可能是准确的，而其他元素需要验证。',
          keyFindings: [
            {
              claim: '文本中的主要声明',
              status: 'unverifiable',
              explanation: '缺乏足够的信息或可靠来源来完全验证此声明。准确的事实核查需要更具体的细节。'
            }
          ],
          sources: [
            {
              title: 'Reuters Fact Check',
              url: 'https://www.reuters.com/fact-check',
              credibility: 'high'
            },
            {
              title: 'FactCheck.org',
              url: 'https://www.factcheck.org',
              credibility: 'high'
            }
          ],
          context: '要进行准确的事实核查，请提供更具体的声明或背景。',
          warnings: ['没有更具体的信息无法完全验证。']
        }
      },
      ja: {
        moonLanding: {
          credibilityScore: 98,
          verdict: 'false',
          summary: '月面着陸がハリウッドのスタジオで撮影されたという主張は、広く反証された陰謀論です。1969年のアポロ11号の月面着陸が実際に行われたという圧倒的な証拠があります。',
          keyFindings: [
            {
              claim: '月面着陸はスタジオで撮影された',
              status: 'false',
              explanation: '複数の国からの独立した検証、物理的証拠（月の石）、数千人の目撃者が月面着陸の真正性を確認しています。'
            },
            {
              claim: '1969年の技術は十分に発展していなかった',
              status: 'false',
              explanation: '歴史的記録と技術文書が、アポロ計画を通じて技術が存在し、成功裏に開発されたことを証明しています。'
            }
          ],
          sources: [
            {
              title: 'NASA - アポロ11号ミッション概要',
              url: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html',
              credibility: 'high'
            },
            {
              title: 'Smithsonian - 月面着陸の証拠',
              url: 'https://airandspace.si.edu/explore-and-learn/topics/apollo',
              credibility: 'high'
            }
          ],
          context: 'アポロ11号ミッションは1969年7月20日に人類を月に成功裏に着陸させました。この成果は世界中の複数の国と科学機関によって独立して検証されています。',
          warnings: ['これは専門家によって繰り返し反証された既知の陰謀論です。']
        },
        waterIntake: {
          credibilityScore: 45,
          verdict: 'mixed',
          summary: '「1日8杯の水」という推奨量は過度に単純化されています。水分の必要量は、体格、活動レベル、気候、全体的な健康状態などの個人的要因によって大きく異なります。',
          keyFindings: [
            {
              claim: '全員が1日に正確に8杯の水が必要',
              status: 'disputed',
              explanation: '科学的証拠は、水分の必要量が個人によって大きく異なることを示しています。普遍的な「8杯」のルールはありません。'
            },
            {
              claim: '水分補給は健康に重要',
              status: 'verified',
              explanation: '適切な水分補給は実際にさまざまな身体機能に不可欠ですが、具体的な量は人と状況によって異なります。'
            }
          ],
          sources: [
            {
              title: 'Harvard Health - 水をどれだけ飲むべきか？',
              url: 'https://www.health.harvard.edu/staying-healthy/how-much-water-should-you-drink',
              credibility: 'high'
            },
            {
              title: 'Mayo Clinic - 水：1日にどれだけ飲むべきか？',
              url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256',
              credibility: 'high'
            }
          ],
          context: '「8x8ルール」（1日8オンスの水を8杯）は簡略化されたガイドラインです。現代の医学的アドバイスは、個人の水分必要量を決定する際に、食事、活動、気候を含む複数の要因を考慮します。',
          warnings: ['過度に単純化された健康主張は全員に適用されない可能性があります。']
        },
        general: {
          credibilityScore: 60,
          verdict: 'unverifiable',
          summary: '提供された声明は、徹底的な事実確認を実行するためにより多くの文脈と具体的な主張が必要です。いくつかの要素は正確かもしれませんが、他の要素は検証が必要です。',
          keyFindings: [
            {
              claim: 'テキストからの主な主張',
              status: 'unverifiable',
              explanation: 'この主張を完全に検証するための情報または信頼できる情報源が不足しています。正確な事実確認にはより具体的な詳細が必要です。'
            }
          ],
          sources: [
            {
              title: 'Reuters Fact Check',
              url: 'https://www.reuters.com/fact-check',
              credibility: 'high'
            },
            {
              title: 'FactCheck.org',
              url: 'https://www.factcheck.org',
              credibility: 'high'
            }
          ],
          context: '正確な事実確認のために、より具体的な主張または文脈を提供してください。',
          warnings: ['より具体的な情報なしでは完全に検証できません。']
        }
      }
    };

    return examples[language] || examples['en'];
  }

  /**
   * 실제 AI API를 사용한 분석 (미구현 - 추후 구현)
   * 
   * 사용 가능한 AI API:
   * - OpenAI GPT-4
   * - Anthropic Claude
   * - Google Gemini
   * 
   * 구현 예시:
   * ```typescript
   * static async analyzeWithOpenAI(text: string): Promise<FactoAnalysisResult> {
   *   const response = await fetch('https://api.openai.com/v1/chat/completions', {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
   *     },
   *     body: JSON.stringify({
   *       model: 'gpt-4',
   *       messages: [
   *         {
   *           role: 'system',
   *           content: 'You are a fact-checking AI that analyzes claims and provides credibility scores...'
   *         },
   *         {
   *           role: 'user',
   *           content: text
   *         }
   *       ]
   *     })
   *   });
   *   
   *   const data = await response.json();
   *   return this.parseAIResponse(data);
   * }
   * ```
   */
}
