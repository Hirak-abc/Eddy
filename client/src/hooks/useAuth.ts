// Mocked for foundation; will integrate with @clerk/clerk-react
export const useAuth = () => {
  // For testing: allow role override via query param ?role=owner|customer
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  const userRole = (roleParam === 'OWNER' || roleParam === 'CUSTOMER')
    ? roleParam as 'OWNER' | 'CUSTOMER'
    : 'OWNER';

  return {
    isLoaded: true,
    isSignedIn: true, // Mocked to true to test layout
    userRole,
  };
};
