# Article Backups

This directory contains backup copies of articles before they were rewritten by the batch rewriter tool.

## Backup Format

Backups are named using the following format:
```
{original-filename}.{timestamp}.backup
```

Example: `lypadmh-zh-la-tschvk-368658.mdx.2026-01-22T19-14-44-334Z.backup`

## Backup Information

- **Date Created:** January 22, 2026
- **Total Backups:** 15 articles
- **Reason:** Batch rewrite operation to transform weak articles (< 500 words) into comprehensive content (600+ words)
- **Script Used:** `scripts/batch-rewriter.ts`

## Rewritten Articles

All 15 articles in this directory were successfully rewritten with the following improvements:
- Average word count increase: 1,028%
- All articles now have 800+ words
- Follow five-part content structure (Hook, Empathy, Science, Protocol, Bridge)
- Include comprehensive Q&A sections
- Maintain Avital Rozen's authoritative voice

## Restoration

To restore an article from backup:

```bash
# Copy backup to original location
cp .backup/{filename}.{timestamp}.backup {filename}
```

Example:
```bash
cp .backup/lypadmh-zh-la-tschvk-368658.mdx.2026-01-22T19-14-44-334Z.backup lypadmh-zh-la-tschvk-368658.mdx
```

## Documentation

For complete details about the batch rewrite operation, see:
- `BATCH_REWRITE_REPORT.md` - Full rewrite report with statistics
- `scripts/batch-rewriter/README.md` - Tool documentation

## Retention Policy

These backups should be retained for:
- **Minimum:** 90 days after rewrite operation
- **Recommended:** Indefinitely for historical reference

## Notes

- All backups are complete MDX files with frontmatter and content
- Original metadata (slug, date, category, image) is preserved
- Backups can be used for comparison or rollback if needed
- Do not delete these files without reviewing the rewritten versions first
