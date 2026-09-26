// Mocked for foundation; will integrate with @clerk/clerk-react
export const useAuth = () => {
  return {
    isLoaded: true,
    isSignedIn: true, // Mocked to true to test layout
    userRole: 'OWNER' as 'OWNER' | 'CUSTOMER',
  };
};
