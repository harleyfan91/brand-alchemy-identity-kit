export class SafetyRefusalError extends Error {
  constructor(public readonly section: string) {
    super(`Safety refusal in ${section}`)
    this.name = 'SafetyRefusalError'
  }
}

export class TruncationError extends Error {
  constructor(
    public readonly section: string,
    public readonly maxTokens: number,
  ) {
    super(`Truncated at max_tokens=${maxTokens} in ${section}`)
    this.name = 'TruncationError'
  }
}

export class EmptyResponseError extends Error {
  constructor(public readonly section: string) {
    super(`Empty response in ${section}`)
    this.name = 'EmptyResponseError'
  }
}

export class SchemaParseError extends Error {
  constructor(
    public readonly section: string,
    public readonly raw: string,
    cause: unknown,
  ) {
    super(`Schema parse failed in ${section}`)
    this.name = 'SchemaParseError'
    this.cause = cause
  }
}

export class AnthropicRateLimitError extends Error {
  constructor(message = 'Anthropic rate limit') {
    super(message)
    this.name = 'AnthropicRateLimitError'
  }
}

export class AnthropicOverloadedError extends Error {
  constructor(message = 'Anthropic overloaded') {
    super(message)
    this.name = 'AnthropicOverloadedError'
  }
}

export class AnthropicAuthError extends Error {
  constructor(message = 'Anthropic auth failed') {
    super(message)
    this.name = 'AnthropicAuthError'
  }
}

export class AnthropicConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AnthropicConfigError'
  }
}
