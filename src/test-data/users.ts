export interface TestUser {
  readonly username: string;
  readonly canAuthenticate: boolean;
  readonly description: string;
}

const samplePassword = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

export const testUsers = {
  standard: {
    username: process.env.SAUCEDEMO_STANDARD_USER ?? 'standard_user',
    canAuthenticate: true,
    description: 'Standard user',
  },
  lockedOut: {
    username: process.env.SAUCEDEMO_LOCKED_OUT_USER ?? 'locked_out_user',
    canAuthenticate: false,
    description: 'Locked-out user',
  },
  problem: {
    username: process.env.SAUCEDEMO_PROBLEM_USER ?? 'problem_user',
    canAuthenticate: true,
    description: 'Problem user',
  },
  performanceGlitch: {
    username: process.env.SAUCEDEMO_PERFORMANCE_GLITCH_USER ?? 'performance_glitch_user',
    canAuthenticate: true,
    description: 'Performance-glitch user',
  },
  error: {
    username: process.env.SAUCEDEMO_ERROR_USER ?? 'error_user',
    canAuthenticate: true,
    description: 'Error user',
  },
  visual: {
    username: process.env.SAUCEDEMO_VISUAL_USER ?? 'visual_user',
    canAuthenticate: true,
    description: 'Visual user',
  },
} as const satisfies Record<string, TestUser>;

export const userPassword: string = samplePassword;
export const authenticatedUsers: readonly TestUser[] = Object.values(testUsers).filter(
  (user) => user.canAuthenticate,
);
