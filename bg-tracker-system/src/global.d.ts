interface ProcessEnv {
  readonly REACT_APP_API_STAGING_URL: string;
  readonly REACT_APP_API_DEVELOPMENT_URL: string;
}

interface Process {
  readonly env: ProcessEnv;
}

declare var process: Process;