

export interface User {
    username: string;
    password: string;
  }
  
 
  export interface LoginManagerProps {
    users: User[];
    onLoginSuccess: (username: string) => void;  
  }
  