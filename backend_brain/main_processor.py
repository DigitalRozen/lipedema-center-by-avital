#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Main Content Transformation Processor
Comprehensive system for transforming Instagram posts into Hebrew articles
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional
from content_transformer import ContentTransformer
from batch_processor import BatchProcessor
from supabase_integration import SupabaseIntegration
from hebrew_formatter import HebrewFormatter

class MainProcessor:
    def __init__(self):
        self.transformer = ContentTransformer()
        self.batch_processor = BatchProcessor()
        self.supabase_integration = SupabaseIntegration()
        self.hebrew_formatter = HebrewFormatter()
        
        # Ensure output directories exist
        self.ensure_directories()
    
    def ensure_directories(self):
        """Create necessary output directories"""
        directories = [
            'shared_data/transformed_articles',
            'shared_data/supabase_integration',
            'shared_data/hebrew_formatted',
            'shared_data/nextjs_components'
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def run_complete_transformation_pipeline(self, 
                                           limit: int = None, 
                                           start_index: int = 0,
                                           include_hebrew_formatting: bool = True,
                                           generate_supabase_integration: bool = True,
                                           generate_nextjs_components: bool = True) -> Dict:
        """
        Run the complete transformation pipeline
        
        Args:
            limit: Number of posts to process (None for all)
            start_index: Starting index for processing
            include_hebrew_formatting: Apply Hebrew RTL formatting
            generate_supabase_integration: Generate Supabase integration files
            generate_nextjs_components: Generate Next.js component templates
        
        Returns:
            Dictionary with all generated file paths and statistics
        """
        
        print("🚀 STARTING COMPLETE TRANSFORMATION PIPELINE")
        print("=" * 50)
        
        results = {
            'start_time': datetime.now().isoformat(),
            'files_generated': {},
            'statistics': {},
            'errors': []
        }
        
        try:
            # Step 1: Batch process Instagram posts
            print("\n📝 STEP 1: Processing Instagram posts...")
            batch_result = self.batch_processor.run_full_batch(
                limit=limit, 
                start_index=start_index
            )
            
            if not batch_result:
                raise Exception("Batch processing failed")
            
            results['files_generated']['articles'] = batch_result['articles_file']
            results['files_generated']['summary'] = batch_result['summary_file']
            results['statistics']['batch_processing'] = batch_result['summary']
            
            # Step 2: Hebrew formatting (if requested)
            if include_hebrew_formatting:
                print("\n🔤 STEP 2: Applying Hebrew RTL formatting...")
                hebrew_result = self.apply_hebrew_formatting(batch_result['articles_file'])
                results['files_generated']['hebrew_formatted'] = hebrew_result
            
            # Step 3: Supabase integration (if requested)
            if generate_supabase_integration:
                print("\n🗄️ STEP 3: Generating Supabase integration...")
                supabase_result = self.supabase_integration.process_transformed_articles(
                    batch_result['articles_file']
                )
                results['files_generated']['supabase'] = supabase_result
            
            # Step 4: Next.js components (if requested)
            if generate_nextjs_components:
                print("\n⚛️ STEP 4: Generating Next.js components...")
                nextjs_result = self.generate_nextjs_components(
                    results['files_generated'].get('hebrew_formatted', batch_result['articles_file'])
                )
                results['files_generated']['nextjs_components'] = nextjs_result
            
            # Step 5: Generate final report
            print("\n📊 STEP 5: Generating final report...")
            results['end_time'] = datetime.now().isoformat()
            results['success'] = True
            
            report_result = self.generate_final_report(results)
            results['files_generated']['final_report'] = report_result
            
            print("\n✅ TRANSFORMATION PIPELINE COMPLETED SUCCESSFULLY!")
            self.print_final_summary(results)
            
        except Exception as e:
            results['errors'].append(str(e))
            results['success'] = False
            results['end_time'] = datetime.now().isoformat()
            print(f"\n❌ PIPELINE FAILED: {e}")
        
        return results
    
    def apply_hebrew_formatting(self, articles_file: str) -> str:
        """Apply Hebrew RTL formatting to articles"""
        # Load articles
        with open(articles_file, 'r', encoding='utf-8') as f:
            articles = json.load(f)
        
        # Apply Hebrew formatting
        formatted_articles = []
        for article in articles:
            formatted_article = self.hebrew_formatter.format_article_for_web(article)
            formatted_articles.append(formatted_article)
        
        # Save formatted articles
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f'shared_data/hebrew_formatted/hebrew_formatted_articles_{timestamp}.json'
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(formatted_articles, f, ensure_ascii=False, indent=2)
        
        # Generate CSS file
        css_file = f'shared_data/hebrew_formatted/hebrew_rtl_styles_{timestamp}.css'
        css_content = self.hebrew_formatter.create_rtl_css_classes()
        
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(css_content)
        
        print(f"✓ Hebrew formatted articles: {output_file}")
        print(f"✓ Hebrew RTL CSS: {css_file}")
        
        return {
            'articles_file': output_file,
            'css_file': css_file,
            'count': len(formatted_articles)
        }
    
    def generate_nextjs_components(self, articles_file) -> Dict:
        """Generate Next.js component templates"""
        # Load articles (could be regular or Hebrew formatted)
        if isinstance(articles_file, dict) and 'articles_file' in articles_file:
            # Hebrew formatted result
            with open(articles_file['articles_file'], 'r', encoding='utf-8') as f:
                articles = json.load(f)
        else:
            # Regular articles file
            with open(articles_file, 'r', encoding='utf-8') as f:
                articles = json.load(f)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        components_dir = f'shared_data/nextjs_components/components_{timestamp}'
        os.makedirs(components_dir, exist_ok=True)
        
        generated_components = []
        
        for i, article in enumerate(articles):
            transformed = article['transformed']
            slug = self.supabase_integration.create_slug(transformed['title'])
            
            # Generate component
            component_content = self.hebrew_formatter.generate_nextjs_component_template(article)
            
            # Save component file
            component_file = os.path.join(components_dir, f'{slug}.tsx')
            with open(component_file, 'w', encoding='utf-8') as f:
                f.write(component_content)
            
            generated_components.append({
                'slug': slug,
                'title': transformed['title'],
                'file': component_file
            })
        
        # Generate index file
        index_content = self.generate_components_index(generated_components)
        index_file = os.path.join(components_dir, 'index.ts')
        
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(index_content)
        
        print(f"✓ Generated {len(generated_components)} Next.js components in: {components_dir}")
        
        return {
            'components_dir': components_dir,
            'components': generated_components,
            'index_file': index_file,
            'count': len(generated_components)
        }
    
    def generate_components_index(self, components: List[Dict]) -> str:
        """Generate index file for Next.js components"""
        content = "// Auto-generated component exports\n\n"
        
        for component in components:
            component_name = component['slug'].replace('-', '_').title()
            content += f"export {{ default as {component_name} }} from './{component['slug']}'\n"
        
        content += "\n// Component metadata\n"
        content += "export const componentMetadata = {\n"
        
        for component in components:
            content += f"  '{component['slug']}': {{\n"
            content += f"    title: '{component['title']}',\n"
            content += f"    slug: '{component['slug']}',\n"
            content += f"  }},\n"
        
        content += "}\n"
        
        return content
    
    def generate_final_report(self, results: Dict) -> str:
        """Generate comprehensive final report"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f'shared_data/final_report_{timestamp}.md'
        
        # Calculate processing time
        start_time = datetime.fromisoformat(results['start_time'])
        end_time = datetime.fromisoformat(results['end_time'])
        processing_time = (end_time - start_time).total_seconds()
        
        report_content = f"""# Content Transformation Report
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Summary
- **Status**: {'✅ Success' if results['success'] else '❌ Failed'}
- **Processing Time**: {processing_time:.2f} seconds
- **Articles Processed**: {results['statistics'].get('batch_processing', {}).get('total_articles', 0)}

## Statistics
"""
        
        if 'batch_processing' in results['statistics']:
            stats = results['statistics']['batch_processing']
            report_content += f"""
### Content Distribution
- **Awareness Levels**: {stats.get('awareness_level_distribution', {})}
- **Categories**: {stats.get('category_distribution', {})}
- **Monetization Strategies**: {stats.get('monetization_distribution', {})}
- **Average Reading Time**: {stats.get('average_reading_time', 0)} minutes
"""
        
        report_content += "\n## Generated Files\n"
        
        for category, files in results['files_generated'].items():
            if isinstance(files, dict):
                report_content += f"\n### {category.title()}\n"
                for key, value in files.items():
                    report_content += f"- **{key}**: `{value}`\n"
            else:
                report_content += f"- **{category}**: `{files}`\n"
        
        if results['errors']:
            report_content += "\n## Errors\n"
            for error in results['errors']:
                report_content += f"- {error}\n"
        
        report_content += f"""
## Next Steps

### For Development Team:
1. **Database Setup**: Run the SQL migration in Supabase dashboard
2. **Import Articles**: Use the Next.js import script
3. **Styling**: Add the Hebrew RTL CSS to your project
4. **Components**: Copy the generated Next.js components to your project

### For Content Team:
1. **Review Articles**: Check transformed content for accuracy
2. **SEO Optimization**: Review meta descriptions and keywords
3. **Publishing**: Mark articles as published when ready
4. **Featured Content**: Select articles for homepage featuring

### File Locations:
- **Transformed Articles**: `shared_data/transformed_articles/`
- **Supabase Integration**: `shared_data/supabase_integration/`
- **Hebrew Formatting**: `shared_data/hebrew_formatted/`
- **Next.js Components**: `shared_data/nextjs_components/`

## System Architecture

This transformation system consists of:

1. **Content Transformer**: Converts Instagram posts to structured articles
2. **Batch Processor**: Handles multiple posts efficiently
3. **Hebrew Formatter**: Applies RTL formatting and typography
4. **Supabase Integration**: Generates database migration scripts
5. **Next.js Generator**: Creates ready-to-use React components

## Quality Assurance

Each transformed article includes:
- ✅ Awareness level classification (Problem/Solution/Product)
- ✅ Category assignment (Nutrition/Physical/Diagnosis/Mindset)
- ✅ Monetization strategy alignment
- ✅ SEO optimization (meta description, keywords)
- ✅ Hebrew RTL formatting
- ✅ Reading time estimation
- ✅ Call-to-action generation

---

*Generated by Avital Rosen's Content Transformation System*
*Platform: Lipedema Authority Platform*
"""
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report_content)
        
        print(f"✓ Final report generated: {report_file}")
        
        return report_file
    
    def print_final_summary(self, results: Dict):
        """Print final summary to console"""
        print("\n" + "=" * 50)
        print("🎉 TRANSFORMATION PIPELINE SUMMARY")
        print("=" * 50)
        
        if 'batch_processing' in results['statistics']:
            stats = results['statistics']['batch_processing']
            print(f"📊 Articles Processed: {stats.get('total_articles', 0)}")
            print(f"⏱️ Average Reading Time: {stats.get('average_reading_time', 0)} minutes")
            
            print("\n📈 Content Distribution:")
            for category, count in stats.get('category_distribution', {}).items():
                print(f"   {category}: {count}")
        
        print(f"\n📁 Files Generated:")
        for category, files in results['files_generated'].items():
            if category != 'final_report':
                print(f"   {category}: ✅")
        
        print(f"\n📋 Final Report: {results['files_generated'].get('final_report', 'Not generated')}")
        
        print("\n🚀 Ready for deployment to Lipedema Authority Platform!")

def main():
    """Main function - run complete transformation pipeline"""
    processor = MainProcessor()
    
    # Run with first 10 posts as demonstration
    results = processor.run_complete_transformation_pipeline(
        limit=10,
        start_index=0,
        include_hebrew_formatting=True,
        generate_supabase_integration=True,
        generate_nextjs_components=True
    )
    
    return results

if __name__ == "__main__":
    main()