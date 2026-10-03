import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, role: UserRole, schoolName?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  validateFourPartName: (name: string) => { valid: boolean; count: number; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial demo user: School Admin for immediate dashboard testability
const DEMO_SCHOOL_ADMIN: User = {
  id: 'usr-admin-01',
  username: 'school.admin',
  fullName: 'Ahmed Fathy Mansour El-Husseiny',
  role: 'SCHOOL_ADMIN',
  schoolId: 'SCH-001',
  schoolName: 'Al-Farabi Modern International School (Cairo)',
  email: 'admin@alfarabi-school.edu.eg',
  phone: '+20 100 123 9900',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sevas_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_SCHOOL_ADMIN;
      }
    }
    // Default logged in as SCHOOL_ADMIN for easy immediate evaluation, or start at portal
    return DEMO_SCHOOL_ADMIN;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sevas_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sevas_current_user');
    }
  }, [user]);

  const login = (username: string, role: UserRole, schoolName?: string) => {
    let newUser: User;
    if (role === 'SEVAS_TEAM_LEADER' || role === 'SEVAS_TEAM_MEMBER') {
      newUser = {
        id: 'usr-team-01',
        username: username || 'retaj.leader',
        fullName: 'Retaj Khaled Abdel-Aziz Mostafa',
        role,
        email: 'retaj.leader@sevas-emergency.gov.eg',
        phone: '+20 100 000 7382',
      };
    } else if (role === 'PARENT') {
      newUser = {
        id: 'usr-parent-01',
        username: username || 'parent.demo',
        fullName: 'Ahmed Tarek Mansour Soliman',
        role: 'PARENT',
        email: 'ahmed.mansour@gmail.com',
        phone: '+20 100 555 4321',
      };
    } else {
      newUser = {
        id: 'usr-admin-01',
        username: username || 'school.admin',
        fullName: 'Ahmed Fathy Mansour El-Husseiny',
        role: 'SCHOOL_ADMIN',
        schoolId: 'SCH-001',
        schoolName: schoolName || 'Al-Farabi Modern International School (Cairo)',
        email: 'admin@alfarabi-school.edu.eg',
        phone: '+20 100 123 9900',
      };
    }
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    login(newRole.toLowerCase().replace('_', '.'), newRole);
  };

  /**
   * Prototype validation: Full name must contain exactly four name parts
   * Example:
   * "Ahmed Mohamed Ali Hassan" -> Accept (4 parts)
   * "Ahmed Hassan" -> Reject (2 parts)
   */
  const validateFourPartName = (name: string): { valid: boolean; count: number; error?: string } => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { valid: false, count: 0, error: 'Full name is required.' };
    }
    // Split by whitespace and filter out empty strings
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length !== 4) {
      return {
        valid: false,
        count: parts.length,
        error: `Full Name must contain exactly four name parts. Currently has ${parts.length} part${parts.length === 1 ? '' : 's'}. (e.g., "Ahmed Mohamed Ali Hassan")`,
      };
    }
    return { valid: true, count: 4 };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        validateFourPartName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
