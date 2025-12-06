// Facto 분석 히스토리 관리 서비스
// 추후 Supabase 등 데이터베이스로 대체 가능

import { FactoAnalysisResult } from './factoService';

export interface FactoHistoryItem {
  id: string;
  userId: string;
  inputText: string;
  result: FactoAnalysisResult;
  createdAt: Date;
}

export class FactoHistoryService {
  /**
   * 새 분석 결과를 히스토리에 추가
   * @param userId 사용자 ID
   * @param inputText 입력 텍스트
   * @param result 분석 결과
   * @returns 생성된 히스토리 아이템
   */
  static async addHistory(
    userId: string,
    inputText: string,
    result: FactoAnalysisResult
  ): Promise<FactoHistoryItem> {
    const item: FactoHistoryItem = {
      id: this.generateId(),
      userId,
      inputText,
      result,
      createdAt: new Date()
    };

    await fetch('http://localhost:4000/api/facto/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    return item;
  }

  /**
   * 사용자의 히스토리 조회
   * @param userId 사용자 ID
   * @returns 히스토리 목록
   */
  static async getHistory(userId: string): Promise<FactoHistoryItem[]> {
    const res = await fetch(`http://localhost:4000/api/facto/history/${userId}`);
    console.log(res);
    const data = await res.json();

    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt)
    }));
  }

  /**
   * 특정 히스토리 아이템 삭제
   * @param userId 사용자 ID
   * @param historyId 히스토리 ID
   */
  static async deleteHistory(userId: string, historyId: string): Promise<void> {
    await fetch(`http://localhost:4000/api/facto/history/${userId}/${historyId}`, {
      method: 'DELETE'
    });
  }

  /**
   * 사용자의 모든 히스토리 삭제
   * @param userId 사용자 ID
   */
  static async clearHistory(userId: string): Promise<void> {
    await fetch(`http://localhost:4000/api/facto/history/${userId}`, {
      method: 'DELETE'
    });
  }

  /**
   * 고유 ID 생성
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 추후 Supabase 연동 예시:
   * 
   * 1. Facto History 테이블 스키마:
   * ```sql
   * CREATE TABLE facto_history (
   *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   *   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   *   input_text TEXT NOT NULL,
   *   result JSONB NOT NULL,
   *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   * );
   * 
   * -- 인덱스 생성 (성능 향상)
   * CREATE INDEX idx_facto_history_user_id ON facto_history(user_id);
   * CREATE INDEX idx_facto_history_created_at ON facto_history(created_at DESC);
   * ```
   * 
   * 2. 히스토리 추가:
   * ```typescript
   * static async addHistoryToDatabase(
   *   userId: string,
   *   inputText: string,
   *   result: FactoAnalysisResult
   * ): Promise<FactoHistoryItem> {
   *   const { data, error } = await supabase
   *     .from('facto_history')
   *     .insert({
   *       user_id: userId,
   *       input_text: inputText,
   *       result: result,
   *     })
   *     .select()
   *     .single();
   *   
   *   if (error) throw error;
   *   
   *   return {
   *     id: data.id,
   *     userId: data.user_id,
   *     inputText: data.input_text,
   *     result: data.result,
   *     createdAt: new Date(data.created_at),
   *   };
   * }
   * ```
   * 
   * 3. 히스토리 조회 (페이지네이션 포함):
   * ```typescript
   * static async getHistoryFromDatabase(
   *   userId: string,
   *   page: number = 1,
   *   limit: number = 20
   * ): Promise<FactoHistoryItem[]> {
   *   const offset = (page - 1) * limit;
   *   
   *   const { data, error } = await supabase
   *     .from('facto_history')
   *     .select('*')
   *     .eq('user_id', userId)
   *     .order('created_at', { ascending: false })
   *     .range(offset, offset + limit - 1);
   *   
   *   if (error) throw error;
   *   
   *   return data.map(item => ({
   *     id: item.id,
   *     userId: item.user_id,
   *     inputText: item.input_text,
   *     result: item.result,
   *     createdAt: new Date(item.created_at),
   *   }));
   * }
   * ```
   * 
   * 4. 특정 히스토리 삭제:
   * ```typescript
   * static async deleteHistoryFromDatabase(
   *   userId: string,
   *   historyId: string
   * ): Promise<void> {
   *   const { error } = await supabase
   *     .from('facto_history')
   *     .delete()
   *     .eq('id', historyId)
   *     .eq('user_id', userId); // 보안: 자신의 히스토리만 삭제 가능
   *   
   *   if (error) throw error;
   * }
   * ```
   * 
   * 5. 모든 히스토리 삭제:
   * ```typescript
   * static async clearHistoryFromDatabase(userId: string): Promise<void> {
   *   const { error } = await supabase
   *     .from('facto_history')
   *     .delete()
   *     .eq('user_id', userId);
   *   
   *   if (error) throw error;
   * }
   * ```
   * 
   * 6. 히스토리 통계 조회:
   * ```typescript
   * static async getHistoryStats(userId: string): Promise<{
   *   total: number;
   *   trueCount: number;
   *   falseCount: number;
   *   avgCredibility: number;
   * }> {
   *   const { data, error } = await supabase
   *     .from('facto_history')
   *     .select('result')
   *     .eq('user_id', userId);
   *   
   *   if (error) throw error;
   *   
   *   const total = data.length;
   *   const trueCount = data.filter(h => 
   *     h.result.verdict === 'true' || h.result.verdict === 'mostly-true'
   *   ).length;
   *   const falseCount = data.filter(h => 
   *     h.result.verdict === 'false' || h.result.verdict === 'mostly-false'
   *   ).length;
   *   const avgCredibility = data.reduce((sum, h) => 
   *     sum + h.result.credibilityScore, 0
   *   ) / total;
   *   
   *   return { total, trueCount, falseCount, avgCredibility };
   * }
   * ```
   * 
   * 7. 실시간 업데이트 구독 (Real-time):
   * ```typescript
   * static subscribeToHistory(
   *   userId: string,
   *   callback: (history: FactoHistoryItem) => void
   * ): () => void {
   *   const subscription = supabase
   *     .channel('facto_history_changes')
   *     .on(
   *       'postgres_changes',
   *       {
   *         event: 'INSERT',
   *         schema: 'public',
   *         table: 'facto_history',
   *         filter: `user_id=eq.${userId}`,
   *       },
   *       (payload) => {
   *         const newHistory: FactoHistoryItem = {
   *           id: payload.new.id,
   *           userId: payload.new.user_id,
   *           inputText: payload.new.input_text,
   *           result: payload.new.result,
   *           createdAt: new Date(payload.new.created_at),
   *         };
   *         callback(newHistory);
   *       }
   *     )
   *     .subscribe();
   *   
   *   // 구독 해제 함수 반환
   *   return () => {
   *     subscription.unsubscribe();
   *   };
   * }
   * ```
   */
}