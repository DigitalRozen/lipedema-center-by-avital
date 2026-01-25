# Batch Article Rewriter

A content enhancement system for the lipedema-platform blog that identifies weak articles (< 500 words) and rewrites them into comprehensive, SEO-optimized Hebrew articles following Avital Rozen's authoritative voice.

## Project Structure

```
batch-rewriter/
├── src/                    # Source code
│   ├── scanner.ts         # Article scanning and MDX parsing
│   ├── analyzer.ts        # Content analysis and word counting
│   ├── rewriter.ts        # Article rewriting logic
│   ├── ai-generator.ts    # OpenAI integration
│   ├── file-manager.ts    # File operations and backups
│   ├── batch-processor.ts # Orchestration logic
│   ├── validators.ts      # Content validation
│   ├── voice-checker.ts   # Voice compliance checking
│   ├── seo-optimizer.ts   # SEO optimization
│   ├── cli.ts            # Command-line interface
│   └── index.ts          # Main entry point
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── property/         # Property-based tests
├── config/               # Configuration files
│   ├── voice-guidelines.json      # Avital's voice rules
│   ├── content-structure.json     # Five-part template
│   └── medical-vocabulary.json    # Hebrew medical terms
├── dist/                 # Compiled output (generated)
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Installation

From the batch-rewriter directory:

```bash
npm install
```

## Development

```bash
# Build the project
npm run build

# Watch mode for development
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Usage

```bash
# Dry run (preview changes without writing)
node dist/cli.js --dry-run

# Rewrite all weak articles
node dist/cli.js

# Rewrite specific articles
node dist/cli.js --articles article1.mdx,article2.mdx

# Custom thresholds
node dist/cli.js --weak-threshold 400 --target-word-count 700
```

## Configuration

Configuration files in the `config/` directory:

- **voice-guidelines.json**: Avital Rozen's voice and tone rules
- **content-structure.json**: Five-part article structure template
- **medical-vocabulary.json**: Hebrew medical terminology

## Testing

The project uses both unit tests and property-based tests:

- **Unit tests**: Specific examples and edge cases
- **Property-based tests**: Universal properties across all inputs using fast-check

Run all tests:
```bash
npm test
```

## Architecture

The system follows a modular architecture:

1. **Scanner**: Discovers and reads MDX files
2. **Analyzer**: Counts words and classifies articles
3. **Rewriter**: Generates comprehensive content using AI
4. **Validator**: Ensures content meets quality standards
5. **File Manager**: Handles backups and safe file operations
6. **Batch Processor**: Orchestrates the complete workflow

## Requirements

- Node.js 18+
- TypeScript 5+
- OpenAI API key (set in environment variables)

## Environment Variables

Create a `.env` file in the batch-rewriter directory:

```
OPENAI_API_KEY=your_api_key_here
```

## License

MIT
