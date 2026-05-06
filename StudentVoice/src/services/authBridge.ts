type AuthBridge = {
  clearSession: () => void;
};

export const authBridge: { current: AuthBridge | null } = { current: null };
