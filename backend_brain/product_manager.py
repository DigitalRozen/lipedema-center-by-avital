#!/usr/bin/env python3
"""
Product Management System
Backend Architect & Data Engineer

Manages affiliate and digital products with pricing, categorization, and matching logic.
"""

import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class Product:
    """Product data structure"""
    id: str
    name: str
    type: str  # "Physical" or "Digital"
    price: float
    currency: str
    description: str
    image_url: Optional[str]
    affiliate_link: str
    trigger_tags: List[str]
    active: bool = True
    category_match: Optional[str] = None
    priority: int = 1  # 1=high, 2=medium, 3=low


class ProductManager:
    """Manages product catalog and matching logic"""
    
    def __init__(self):
        self.products = self._initialize_products()
    
    def _initialize_products(self) -> List[Product]:
        """Initialize the product catalog with real affiliate products"""
        return [
            # High-value physical products
            Product(
                id="lympha-press-optimal-plus",
                name="Lympha Press Optimal Plus",
                type="Physical",
                price=12000,
                currency="₪",
                description="מכשיר דחיסה פנאומטי מתקדם לטיפול בליפדמה ולימפדמה. הפתרון המקצועי המומלץ ביותר לטיפול ביתי.",
                image_url="https://example.com/lympha-press-optimal.jpg",
                affiliate_link="https://affiliate.link/lympha-press-optimal",
                trigger_tags=["עיסוי_לימפתי", "מכשירים", "דחיסה", "טיפול_פיזי", "נפיחות"],
                category_match="physical",
                priority=1
            ),
            Product(
                id="faradbeauty-led-mask",
                name="FaradBeauty מסכת LED",
                type="Physical",
                price=620,
                currency="₪",
                description="מסכת טיפוח פנים מתקדמת עם טכנולוגיית LED לשיפור מחזור הדם והפחתת דלקות.",
                image_url="https://example.com/faradbeauty-led.jpg",
                affiliate_link="https://affiliate.link/faradbeauty-led",
                trigger_tags=["טיפול_פיזי", "דלקת", "מכשירים", "פנים"],
                category_match="physical",
                priority=2
            ),
            Product(
                id="faradbeauty-lymph-brush",
                name="FaradBeauty מברשת לימפה",
                type="Physical",
                price=480,
                currency="₪",
                description="מברשת עיסוי מחוממת לעיסוי לימפתי יעיל ושיפור הזרימה הלימפתית.",
                image_url="https://example.com/faradbeauty-brush.jpg",
                affiliate_link="https://affiliate.link/faradbeauty-brush",
                trigger_tags=["עיסוי_לימפתי", "מכשירים", "טיפול_פיזי"],
                category_match="physical",
                priority=1
            ),
            Product(
                id="jobst-elvarex-soft",
                name="JOBST Elvarex Soft",
                type="Physical",
                price=450,
                currency="₪",
                description="גרבי דחיסה רכות פרימיום מבית JOBST, המותג המוביל בעולם לטיפולי דחיסה.",
                image_url="https://example.com/jobst-elvarex.jpg",
                affiliate_link="https://affiliate.link/jobst-elvarex",
                trigger_tags=["גרבי_דחיסה", "דחיסה", "טיפול_פיזי", "נפיחות"],
                category_match="physical",
                priority=1
            ),
            Product(
                id="compression-sleeve-arm",
                name="שרוול דחיסה רפואי",
                type="Physical",
                price=320,
                currency="₪",
                description="שרוול דחיסה מקצועי לזרוע, מיועד לטיפול בליפדמה ולימפדמה בזרועות.",
                image_url="https://example.com/compression-sleeve.jpg",
                affiliate_link="https://affiliate.link/compression-sleeve",
                trigger_tags=["גרבי_דחיסה", "דחיסה", "זרועות", "טיפול_פיזי"],
                category_match="physical",
                priority=2
            ),
            Product(
                id="compression-stockings-premium",
                name="גרביים דחיסה רפואיות",
                type="Physical",
                price=299,
                currency="₪",
                description="גרביים דחיסה איכותיות לתמיכה יומיומית ושיפור זרימת הלימפה ברגליים.",
                image_url="https://example.com/compression-stockings.jpg",
                affiliate_link="https://affiliate.link/compression-stockings",
                trigger_tags=["גרבי_דחיסה", "דחיסה", "רגליים", "טיפול_פיזי"],
                category_match="physical",
                priority=2
            ),
            Product(
                id="short-compression-bandages",
                name="תחבושות דחיסה קצרות",
                type="Physical",
                price=280,
                currency="₪",
                description="סט תחבושות דחיסה קצרות מקצועיות לטיפול ממוקד באזורים ספציפיים.",
                image_url="https://example.com/short-bandages.jpg",
                affiliate_link="https://affiliate.link/short-bandages",
                trigger_tags=["דחיסה", "תחבושות", "טיפול_פיזי"],
                category_match="physical",
                priority=3
            ),
            Product(
                id="medical-compression-socks-lipedema",
                name="גרבי דחיסה רפואיות",
                type="Physical",
                price=240,
                currency="₪",
                description="גרבי דחיסה מיוחדות לליפדמה עם תמיכה מותאמת ונוחות מקסימלית.",
                image_url="https://example.com/medical-socks-lipedema.jpg",
                affiliate_link="https://affiliate.link/medical-socks-lipedema",
                trigger_tags=["גרבי_דחיסה", "ליפדמה", "רפואי", "טיפול_פיזי"],
                category_match="physical",
                priority=2
            ),
            
            # Digital products
            Product(
                id="lipedema-exercise-course",
                name="קורס וידאו: תרגילים לליפדמה",
                type="Digital",
                price=199,
                currency="₪",
                description="סדרת תרגילים מותאמים לליפדמה עם הדרכה מקצועית וטכניקות מתקדמות.",
                image_url="https://example.com/exercise-course.jpg",
                affiliate_link="https://checkout.link/exercise-course",
                trigger_tags=["תרגילים", "טיפול_פיזי", "וידאו", "הדרכה"],
                category_match="physical",
                priority=1
            ),
            Product(
                id="nutrition-guide-digital",
                name="ספר דיגיטלי: מדריך התזונה",
                type="Digital",
                price=149,
                currency="₪",
                description="מדריך תזונה מקיף לליפדמה עם תפריטים מותאמים, מתכונים ועצות מקצועיות.",
                image_url="https://example.com/nutrition-guide.jpg",
                affiliate_link="https://checkout.link/nutrition-guide",
                trigger_tags=["תזונה", "דיאטה", "מדריך", "דלקת", "ויטמינים"],
                category_match="nutrition",
                priority=1
            )
        ]
    
    def get_products_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get products matching a specific category"""
        matching_products = [
            asdict(product) for product in self.products 
            if product.active and product.category_match == category
        ]
        
        # Sort by priority (1=high priority first)
        return sorted(matching_products, key=lambda x: x['priority'])
    
    def get_products_by_tags(self, tags: List[str]) -> List[Dict[str, Any]]:
        """Get products matching any of the provided tags"""
        matching_products = []
        
        for product in self.products:
            if not product.active:
                continue
                
            # Check if any product trigger_tags match the provided tags
            if any(tag in product.trigger_tags for tag in tags):
                product_dict = asdict(product)
                # Calculate match score for sorting
                match_score = len(set(tags) & set(product.trigger_tags))
                product_dict['match_score'] = match_score
                matching_products.append(product_dict)
        
        # Sort by match score (descending) then by priority
        return sorted(matching_products, key=lambda x: (-x['match_score'], x['priority']))
    
    def get_all_active_products(self) -> List[Dict[str, Any]]:
        """Get all active products"""
        return [asdict(product) for product in self.products if product.active]
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get specific product by ID"""
        for product in self.products:
            if product.id == product_id:
                return asdict(product)
        return None
    
    def get_portfolio_value(self) -> Dict[str, Any]:
        """Calculate total portfolio value and statistics"""
        active_products = [p for p in self.products if p.active]
        
        total_value = sum(p.price for p in active_products)
        physical_products = [p for p in active_products if p.type == "Physical"]
        digital_products = [p for p in active_products if p.type == "Digital"]
        
        return {
            "total_value": total_value,
            "currency": "₪",
            "total_products": len(active_products),
            "physical_count": len(physical_products),
            "digital_count": len(digital_products),
            "physical_value": sum(p.price for p in physical_products),
            "digital_value": sum(p.price for p in digital_products),
            "average_price": total_value / len(active_products) if active_products else 0
        }
    
    def export_products_json(self, output_path: str = "shared_data/products.json"):
        """Export products to JSON file"""
        products_data = {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_products": len(self.products),
                "active_products": len([p for p in self.products if p.active]),
                "portfolio_stats": self.get_portfolio_value()
            },
            "products": self.get_all_active_products()
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(products_data, f, ensure_ascii=False, indent=2)
        
        print(f"Products exported to: {output_path}")
        return products_data


def main():
    """Test the product manager"""
    manager = ProductManager()
    
    # Export products
    products_data = manager.export_products_json()
    
    # Print summary
    stats = manager.get_portfolio_value()
    print(f"\n=== Product Portfolio Summary ===")
    print(f"Total Products: {stats['total_products']}")
    print(f"Physical Products: {stats['physical_count']} (₪{stats['physical_value']:,.0f})")
    print(f"Digital Products: {stats['digital_count']} (₪{stats['digital_value']:,.0f})")
    print(f"Total Portfolio Value: ₪{stats['total_value']:,.0f}")
    print(f"Average Product Price: ₪{stats['average_price']:,.0f}")
    
    # Test category matching
    print(f"\n=== Category Matching Test ===")
    physical_products = manager.get_products_by_category("physical")
    print(f"Physical category products: {len(physical_products)}")
    
    # Test tag matching
    test_tags = ["עיסוי_לימפתי", "דחיסה"]
    matching_products = manager.get_products_by_tags(test_tags)
    print(f"Products matching tags {test_tags}: {len(matching_products)}")


if __name__ == "__main__":
    main()