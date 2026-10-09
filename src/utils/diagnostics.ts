import type { ConsoleMessage, Page, TestInfo } from '@playwright/test';

export interface BrowserDiagnostic {
  readonly source: 'console' | 'pageerror';
  readonly message: string;
}

function redactSensitiveValues(message: string): string {
  return message.replace(/((?:password|token|secret|authorization)=)[^&\s]*/gi, '$1[REDACTED]');
}

function onConsoleMessage(message: ConsoleMessage): BrowserDiagnostic | undefined {
  return message.type() === 'error'
    ? { source: 'console', message: redactSensitiveValues(message.text()) }
    : undefined;
}

export async function attachFailureDiagnostics(
  page: Page,
  testInfo: TestInfo,
  diagnostics: BrowserDiagnostic[],
): Promise<void> {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  await page.screenshot({ fullPage: true, animations: 'disabled' }).catch((error: unknown) => {
    diagnostics.push({
      source: 'pageerror',
      message: `Failure screenshot capture failed: ${String(error)}`,
    });
  });

  if (diagnostics.length > 0) {
    await testInfo.attach('browser-diagnostics', {
      body: Buffer.from(JSON.stringify(diagnostics, null, 2)),
      contentType: 'application/json',
    });
  }
}

export { onConsoleMessage };
