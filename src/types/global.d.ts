export {};

declare global {
  interface Window {
    AndroidNative?: {
      startMockLocation: (lat: number, lng: number) => void;
      stopMockLocation: () => void;
      executeMacro: (macroDataJson: string) => void;
      showFloatingWindow: () => void;
    };
  }
}
