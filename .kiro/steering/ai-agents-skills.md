---
inclusion: always
---

# AI Agent Skills Guidelines

## Overview

AI Agent Skills are specialized knowledge modules that enhance AI coding agents with domain-specific expertise. This guide provides best practices for creating and using agent skills to improve development workflows.

## What Are Agent Skills?

Agent skills provide:
- 🎯 **Focused Knowledge** — Only what the AI doesn't already know
- 📝 **Production-Ready Code** — Working examples, not abstract concepts  
- ⚡ **Quick Activation** — Trigger keywords for instant context
- 🔄 **Reusable Patterns** — Copy once, use everywhere

## SKILL.md Format

Every skill follows this structure:

```markdown
---
name: skill-name                    # Unique identifier (lowercase, hyphens)
description: Brief description      # When should the agent use this skill?
license: MIT                       # Optional: license information
---

# Skill Title

Quick start and core patterns...

## Key Concepts
- Concept 1
- Concept 2

## Code Examples
```language
// Working code examples
```

## Common Issues and Solutions
### Issue: Problem description
**Solution**: How to fix it
```

## Skill Creation Guidelines

### ✅ Do Include
- **Practical, production-ready code examples**
- **Trigger keywords in the description**
- **Tested code snippets**
- **Concise but complete explanations**
- **Progressive disclosure** (quick start → advanced patterns)
- **Concrete examples over abstract descriptions**

### ❌ Don't Include
- Basic concepts the AI already knows
- Placeholder code or TODOs
- Overly verbose explanations
- Untested code examples

## File Structure

```
project/
├── .kiro/skills/              # Kiro project skills
│   └── skill-name/
│       ├── SKILL.md          # Main skill file (required)
│       ├── examples/         # Optional: code examples
│       └── scripts/          # Optional: supporting scripts
└── ~/.kiro/skills/           # Personal skills (cross-project)
    └── skill-name/
        └── SKILL.md
```

## Skill Categories

### Development Workflows
- **Debugging**: Error analysis, log investigation, troubleshooting
- **Testing**: Unit tests, integration tests, test automation
- **Deployment**: CI/CD, containerization, cloud deployment
- **Code Review**: Best practices, security checks, performance

### Technology-Specific Skills
- **Framework Skills**: Next.js, React, Vue, Angular patterns
- **Database Skills**: SQL optimization, NoSQL patterns, migrations
- **Cloud Skills**: AWS, Azure, GCP deployment and management
- **API Skills**: REST, GraphQL, authentication, rate limiting

### Domain Expertise
- **Security**: OWASP guidelines, vulnerability assessment
- **Performance**: Optimization techniques, monitoring, profiling
- **Accessibility**: WCAG compliance, screen reader support
- **SEO**: Meta tags, structured data, performance optimization

## Example Skills for This Project

### Lipedema Content Creation
```markdown
---
name: lipedema-content-creation
description: Creating Hebrew medical content about lipedema and lymphedema. Use when writing articles, posts, or educational content.
---

# Lipedema Content Creation

## Content Structure Template
1. **Hook** (Pain Point) - Start with emotional/physical reality
2. **Empathy** (Validating) - Acknowledge struggle with understanding
3. **Science** (Simple Explanation) - Accessible medical terms
4. **Protocol** (Actionable Steps) - Clear, implementable steps
5. **Bridge** (Call to Action) - Product recommendation or consultation

## Medical Vocabulary (Hebrew)
- **לימפה** (lymph)
- **בצקת** (edema)
- **רקמה פיברוטית** (fibrotic tissue)
- **דלקתיות** (inflammation)
- **נוגדי חמצון** (antioxidants)
- **מערכת הלימפה** (lymphatic system)

## Voice Guidelines
- Direct about medical reality: "ליפאדמה לא נעלמת עם דיאטה"
- Deeply empathetic: "אני יודעת איך הרגליים שלך מרגישות כבדות בלילה"
- Avoid translationese (עברית מתורגמת)
```

### Supabase Integration
```markdown
---
name: supabase-integration
description: Supabase database operations, authentication, and real-time features. Use for database queries, user management, and data synchronization.
---

# Supabase Integration Patterns

## Database Operations
```typescript
// Insert with error handling
const { data, error } = await supabase
  .from('articles')
  .insert([{ title, content, category }])
  .select()

if (error) throw new Error(`Insert failed: ${error.message}`)
```

## Authentication Patterns
```typescript
// Server-side auth check
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createServerComponentClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()
```

## Common Issues
### Issue: RLS policies blocking queries
**Solution**: Check row-level security policies and user permissions
```

## Best Practices

### Skill Naming
- Use kebab-case: `skill-name`
- Be descriptive: `nextjs-deployment` not `deployment`
- Include technology: `supabase-auth` not `auth`

### Description Writing
- Include trigger keywords that activate the skill
- Be specific about when to use the skill
- Mention the main technologies or concepts

### Code Examples
- Always test code before including
- Include error handling
- Show complete, working examples
- Add comments explaining key concepts

### Documentation
- Start with quick start examples
- Progress to advanced patterns
- Include troubleshooting section
- Reference official documentation when relevant

## Integration with Kiro

Skills are automatically discovered when placed in:
- `.kiro/skills/` for project-specific skills
- `~/.kiro/skills/` for personal skills

Kiro will:
1. Scan skill directories on startup
2. Load skill metadata from frontmatter
3. Activate skills based on description matching
4. Provide skill context when relevant

## Skill Maintenance

### Regular Updates
- Keep code examples current with latest versions
- Update deprecated APIs and patterns
- Add new common issues and solutions
- Verify all links and references

### Version Control
- Track skills in git with your project
- Use semantic versioning for major skill changes
- Document breaking changes in skill updates
- Share skills across team repositories

## Contributing Skills

When creating skills for the team:
1. Follow the established format and guidelines
2. Test all code examples thoroughly
3. Get peer review before adding to shared skills
4. Document the skill's purpose and usage clearly
5. Include relevant keywords for discoverability

This approach ensures consistent, high-quality skills that enhance development productivity across the team.