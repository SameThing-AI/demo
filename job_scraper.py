#!/usr/bin/env python3
"""
REVOLUTIONARY ASSESSMENT MACHINE - JOB SCRAPER
Scrapes 20 diverse jobs from LinkedIn for comprehensive testing
"""

import json
import pandas as pd
from datetime import datetime
import os
import sys

try:
    from jobspy import scrape_jobs
except ImportError:
    print("Installing jobspy...")
    os.system("pip install python-jobspy")
    from jobspy import scrape_jobs

def scrape_diverse_jobs():
    """Scrape 20 diverse jobs from LinkedIn across different industries"""
    
    print("🔥 REVOLUTIONARY ASSESSMENT MACHINE - JOB SCRAPER")
    print("=" * 60)
    print("🎯 Scraping 20 diverse jobs from LinkedIn for comprehensive testing...")
    
    # Define diverse job categories to ensure variety
    job_searches = [
        # Tech roles
        {"search_term": "Product Manager", "location": "San Francisco", "count": 3},
        {"search_term": "Software Engineer", "location": "New York", "count": 2},
        {"search_term": "Data Scientist", "location": "Seattle", "count": 2},
        
        # Business roles
        {"search_term": "Marketing Manager", "location": "Los Angeles", "count": 2},
        {"search_term": "Sales Director", "location": "Chicago", "count": 2},
        {"search_term": "Business Analyst", "location": "Boston", "count": 2},
        
        # Finance & Consulting
        {"search_term": "Financial Analyst", "location": "New York", "count": 2},
        {"search_term": "Management Consultant", "location": "Washington DC", "count": 1},
        
        # Creative & Design
        {"search_term": "UX Designer", "location": "San Francisco", "count": 2},
        {"search_term": "Content Manager", "location": "Austin", "count": 1},
        
        # Operations & HR
        {"search_term": "Operations Manager", "location": "Denver", "count": 1},
        {"search_term": "HR Business Partner", "location": "Atlanta", "count": 1},
        
        # Healthcare & Education
        {"search_term": "Healthcare Administrator", "location": "Houston", "count": 1},
        {"search_term": "Training Specialist", "location": "Phoenix", "count": 1}
    ]
    
    all_jobs = []
    total_scraped = 0
    
    for search in job_searches:
        if total_scraped >= 20:
            break
            
        print(f"\n🔍 Searching for {search['search_term']} in {search['location']}...")
        
        try:
            jobs = scrape_jobs(
                site_name=["linkedin"],
                search_term=search["search_term"],
                location=search["location"],
                results_wanted=search["count"],
                hours_old=72,  # Jobs posted in last 3 days
                country_indeed='USA'
            )
            
            if not jobs.empty:
                # Add search metadata
                jobs['search_category'] = search["search_term"]
                jobs['search_location'] = search["location"]
                
                # Select relevant columns and clean data
                relevant_columns = [
                    'title', 'company', 'location', 'job_type', 'date_posted',
                    'job_url', 'description', 'search_category', 'search_location'
                ]
                
                available_columns = [col for col in relevant_columns if col in jobs.columns]
                cleaned_jobs = jobs[available_columns].copy()
                
                # Clean and format descriptions
                cleaned_jobs['description'] = cleaned_jobs['description'].astype(str)
                cleaned_jobs['description'] = cleaned_jobs['description'].str[:2000]  # Limit length
                
                all_jobs.append(cleaned_jobs)
                total_scraped += len(cleaned_jobs)
                print(f"✅ Found {len(cleaned_jobs)} jobs for {search['search_term']}")
            else:
                print(f"❌ No jobs found for {search['search_term']}")
                
        except Exception as e:
            print(f"❌ Error scraping {search['search_term']}: {str(e)}")
            continue
    
    if not all_jobs:
        print("❌ No jobs scraped successfully!")
        return None
    
    # Combine all jobs
    final_jobs = pd.concat(all_jobs, ignore_index=True)
    
    # Take only first 20 jobs if we have more
    final_jobs = final_jobs.head(20)
    
    print(f"\n🎉 Successfully scraped {len(final_jobs)} diverse jobs!")
    
    # Save to JSON for the assessment system
    jobs_data = []
    for _, job in final_jobs.iterrows():
        job_data = {
            "id": f"job_{len(jobs_data) + 1}",
            "title": str(job.get('title', 'Unknown Position')),
            "company": str(job.get('company', 'Unknown Company')),
            "location": str(job.get('location', 'Unknown Location')),
            "job_type": str(job.get('job_type', 'Full-time')),
            "description": str(job.get('description', 'No description available')),
            "search_category": str(job.get('search_category', 'General')),
            "date_scraped": datetime.now().isoformat(),
            "job_url": str(job.get('job_url', ''))
        }
        jobs_data.append(job_data)
    
    # Save jobs data
    with open('scraped_jobs.json', 'w', encoding='utf-8') as f:
        json.dump(jobs_data, f, indent=2, ensure_ascii=False)
    
    # Save as CSV for reference
    final_jobs.to_csv('scraped_jobs.csv', index=False)
    
    # Display summary
    print("\n📊 JOB SCRAPING SUMMARY:")
    print("=" * 40)
    
    category_counts = final_jobs['search_category'].value_counts()
    for category, count in category_counts.items():
        print(f"  • {category}: {count} jobs")
    
    print(f"\n📁 Files created:")
    print(f"  • scraped_jobs.json ({len(jobs_data)} jobs)")
    print(f"  • scraped_jobs.csv (backup)")
    
    print("\n🚀 Ready for comprehensive assessment testing!")
    return jobs_data

if __name__ == "__main__":
    jobs = scrape_diverse_jobs()
    if jobs:
        print(f"\n🎯 Next: Testing {len(jobs)} jobs on the revolutionary assessment platform!")
    else:
        print("\n❌ Job scraping failed. Please check your internet connection and try again.")
