// 사용자 인증 서비스
// 추후 Supabase Auth 등 데이터베이스로 대체 가능

export interface User {
  id: string;
  email: string;
  password?: string; // 실제로는 저장하지 않음
  name: string;
  image?: string;
  createdAt: Date;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'auth_user';

  /**
   * 사용자 로그인 (임시 - 로컬 스토리지)
   * @param email 이메일
   * @param password 비밀번호
   * @returns 사용자 정보
   */
  static async login(email: string, password: string): Promise<User> {
    // 임시 로그인 로직 - 실제로는 백엔드 API 호출
    await this.simulateApiDelay();

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      image: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzOTcyNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      createdAt: new Date(),
    };

    this.saveToStorage(user);
    return user;
  }

  /**
   * 사용자 회원가입 (임시 - 로컬 스토리지)
   * @param email 이메일
   * @param password 비밀번호
   * @param name 이름
   * @returns 사용자 정보
   */
  static async signup(email: string, password: string, name: string): Promise<User> {
    // 임시 회원가입 로직
    await this.simulateApiDelay();

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date(),
    };

    this.saveToStorage(user);
    return user;
  }

  /**
   * 사용자 정보 업데이트
   * @param userId 사용자 ID
   * @param data 업데이트할 데이터
   */
  static async updateUser(
    userId: string,
    data: { name?: string; email?: string; password?: string; image?: string }
  ): Promise<User> {
    await this.simulateApiDelay();

    const currentUser = this.loadFromStorage();
    if (!currentUser || currentUser.id !== userId) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...currentUser,
      ...data,
    };

    this.saveToStorage(updatedUser);
    return updatedUser;
  }

  /**
   * 로그아웃
   */
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  static getCurrentUser(): User | null {
    return this.loadFromStorage();
  }

  /**
   * API 호출 시뮬레이션
   */
  private static async simulateApiDelay(): Promise<void> {
    const delay = 500 + Math.random() * 500; // 0.5-1초
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * 로컬 스토리지에서 사용자 정보 로드
   */
  private static loadFromStorage(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
      };
    } catch (error) {
      console.error('Failed to load user:', error);
      return null;
    }
  }

  /**
   * 로컬 스토리지에 사용자 정보 저장
   */
  private static saveToStorage(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  /**
   * ==========================================
   * 추후 Supabase Auth 연동 예시
   * ==========================================
   * 
   * 1. Supabase 프로젝트 생성 및 설정
   * 
   * 2. 사용자 테이블 스키마:
   * ```sql
   * CREATE TABLE users (
   *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   *   email TEXT UNIQUE NOT NULL,
   *   name TEXT NOT NULL,
   *   image TEXT,
   *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   * );
   * ```
   * 
   * 3. 로그인 구현:
   * ```typescript
   * static async loginWithSupabase(email: string, password: string): Promise<User> {
   *   const { data, error } = await supabase.auth.signInWithPassword({
   *     email,
   *     password,
   *   });
   *   
   *   if (error) throw error;
   *   
   *   // 추가 사용자 정보 조회
   *   const { data: userData, error: userError } = await supabase
   *     .from('users')
   *     .select('*')
   *     .eq('id', data.user.id)
   *     .single();
   *   
   *   if (userError) throw userError;
   *   
   *   return {
   *     id: userData.id,
   *     email: userData.email,
   *     name: userData.name,
   *     image: userData.image,
   *     createdAt: new Date(userData.created_at),
   *   };
   * }
   * ```
   * 
   * 4. 회원가입 구현:
   * ```typescript
   * static async signupWithSupabase(
   *   email: string,
   *   password: string,
   *   name: string
   * ): Promise<User> {
   *   // 1. Supabase Auth 회원가입
   *   const { data: authData, error: authError } = await supabase.auth.signUp({
   *     email,
   *     password,
   *   });
   *   
   *   if (authError) throw authError;
   *   
   *   // 2. users 테이블에 추가 정보 저장
   *   const { data: userData, error: userError } = await supabase
   *     .from('users')
   *     .insert({
   *       id: authData.user.id,
   *       email,
   *       name,
   *     })
   *     .select()
   *     .single();
   *   
   *   if (userError) throw userError;
   *   
   *   return {
   *     id: userData.id,
   *     email: userData.email,
   *     name: userData.name,
   *     image: userData.image,
   *     createdAt: new Date(userData.created_at),
   *   };
   * }
   * ```
   * 
   * 5. 사용자 정보 업데이트:
   * ```typescript
   * static async updateUserWithSupabase(
   *   userId: string,
   *   data: { name?: string; email?: string; password?: string; image?: string }
   * ): Promise<User> {
   *   // 비밀번호 변경
   *   if (data.password) {
   *     const { error } = await supabase.auth.updateUser({
   *       password: data.password,
   *     });
   *     if (error) throw error;
   *   }
   *   
   *   // 프로필 정보 업데이트
   *   const updateData: any = {};
   *   if (data.name) updateData.name = data.name;
   *   if (data.email) updateData.email = data.email;
   *   if (data.image) updateData.image = data.image;
   *   
   *   const { data: userData, error } = await supabase
   *     .from('users')
   *     .update(updateData)
   *     .eq('id', userId)
   *     .select()
   *     .single();
   *   
   *   if (error) throw error;
   *   
   *   return {
   *     id: userData.id,
   *     email: userData.email,
   *     name: userData.name,
   *     image: userData.image,
   *     createdAt: new Date(userData.created_at),
   *   };
   * }
   * ```
   * 
   * 6. 로그아웃:
   * ```typescript
   * static async logoutWithSupabase(): Promise<void> {
   *   const { error } = await supabase.auth.signOut();
   *   if (error) throw error;
   * }
   * ```
   * 
   * 7. 현재 사용자 조회:
   * ```typescript
   * static async getCurrentUserWithSupabase(): Promise<User | null> {
   *   const { data: { user } } = await supabase.auth.getUser();
   *   
   *   if (!user) return null;
   *   
   *   const { data: userData, error } = await supabase
   *     .from('users')
   *     .select('*')
   *     .eq('id', user.id)
   *     .single();
   *   
   *   if (error) return null;
   *   
   *   return {
   *     id: userData.id,
   *     email: userData.email,
   *     name: userData.name,
   *     image: userData.image,
   *     createdAt: new Date(userData.created_at),
   *   };
   * }
   * ```
   */
}
