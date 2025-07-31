#!/usr/bin/env python3
"""
REVOLUTIONARY ASSESSMENT MACHINE - MANUAL JOB DATA
Creates 20 diverse job profiles for comprehensive testing
"""

import json
from datetime import datetime

def create_test_jobs():
    """Create 20 diverse job profiles for testing the assessment platform"""
    
    print("🔥 REVOLUTIONARY ASSESSMENT MACHINE - JOB DATA GENERATOR")
    print("=" * 60)
    
    jobs_data = [
        # TECH ROLES
        {
            "id": "job_1",
            "title": "Senior Product Manager - FinTech",
            "company": "Stripe",
            "location": "San Francisco, CA",
            "job_type": "Full-time",
            "description": "Lead product strategy for payment processing platform. Define roadmaps, collaborate with engineering teams, analyze user data, and drive product decisions. Requires 5+ years PM experience, technical background, and experience with financial products. Key responsibilities include stakeholder management, data-driven decision making, and cross-functional leadership.",
            "search_category": "Product Manager",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://stripe.com/careers"
        },
        {
            "id": "job_2", 
            "title": "Full Stack Software Engineer",
            "company": "Netflix",
            "location": "Los Gatos, CA",
            "job_type": "Full-time",
            "description": "Build scalable web applications using React, Node.js, and cloud technologies. Design APIs, implement microservices, and optimize performance. Collaborate with product and design teams. Requires strong JavaScript skills, experience with databases, and knowledge of system design patterns.",
            "search_category": "Software Engineer",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://netflix.com/careers"
        },
        {
            "id": "job_3",
            "title": "Senior Data Scientist - ML",
            "company": "Uber",
            "location": "Seattle, WA", 
            "job_type": "Full-time",
            "description": "Develop machine learning models for demand forecasting and pricing optimization. Work with large datasets, build predictive models, and deploy ML solutions. Requires PhD/MS in quantitative field, experience with Python/R, and deep learning expertise.",
            "search_category": "Data Scientist",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://uber.com/careers"
        },
        
        # BUSINESS ROLES
        {
            "id": "job_4",
            "title": "Marketing Director - Growth",
            "company": "Airbnb",
            "location": "San Francisco, CA",
            "job_type": "Full-time", 
            "description": "Lead growth marketing initiatives across digital channels. Develop acquisition strategies, manage marketing campaigns, analyze performance metrics, and optimize conversion funnels. Requires 7+ years marketing experience, analytical skills, and growth hacking expertise.",
            "search_category": "Marketing Manager",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://airbnb.com/careers"
        },
        {
            "id": "job_5",
            "title": "Enterprise Sales Director",
            "company": "Salesforce",
            "location": "New York, NY",
            "job_type": "Full-time",
            "description": "Drive enterprise sales for CRM solutions. Manage complex sales cycles, build relationships with C-level executives, and exceed revenue targets. Lead sales team and develop territory strategies. Requires 10+ years B2B sales experience and proven track record.",
            "search_category": "Sales Director", 
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://salesforce.com/careers"
        },
        {
            "id": "job_6",
            "title": "Senior Business Analyst",
            "company": "McKinsey & Company",
            "location": "Boston, MA",
            "job_type": "Full-time",
            "description": "Analyze business problems, develop strategic recommendations, and support client engagements. Create financial models, conduct market research, and present findings to senior stakeholders. Requires MBA, strong analytical skills, and consulting experience.",
            "search_category": "Business Analyst",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://mckinsey.com/careers"
        },
        
        # FINANCE ROLES
        {
            "id": "job_7",
            "title": "Investment Banking Analyst",
            "company": "Goldman Sachs",
            "location": "New York, NY",
            "job_type": "Full-time",
            "description": "Support M&A transactions, conduct financial modeling, and prepare pitch presentations. Analyze market trends, perform due diligence, and assist in deal execution. Requires finance background, advanced Excel skills, and ability to work under pressure.",
            "search_category": "Financial Analyst",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://goldmansachs.com/careers"
        },
        {
            "id": "job_8",
            "title": "Strategy Consultant - Healthcare",
            "company": "Bain & Company",
            "location": "Chicago, IL",
            "job_type": "Full-time",
            "description": "Lead healthcare industry consulting projects. Develop market entry strategies, optimize operations, and drive digital transformation initiatives. Work with pharmaceutical and hospital clients. Requires healthcare expertise and strong problem-solving skills.",
            "search_category": "Management Consultant",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://bain.com/careers"
        },
        
        # DESIGN & CREATIVE
        {
            "id": "job_9",
            "title": "Senior UX Designer - Mobile",
            "company": "Apple",
            "location": "Cupertino, CA",
            "job_type": "Full-time",
            "description": "Design intuitive mobile experiences for iOS applications. Create wireframes, prototypes, and design systems. Conduct user research and usability testing. Collaborate with engineering and product teams. Requires 5+ years UX experience and strong portfolio.",
            "search_category": "UX Designer",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://apple.com/careers"
        },
        {
            "id": "job_10",
            "title": "Content Strategy Manager",
            "company": "Meta",
            "location": "Menlo Park, CA",
            "job_type": "Full-time",
            "description": "Develop content strategies across social media platforms. Create editorial calendars, manage content creators, and analyze engagement metrics. Drive brand storytelling and community building. Requires content marketing experience and creative thinking.",
            "search_category": "Content Manager",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://meta.com/careers"
        },
        
        # OPERATIONS & SUPPLY CHAIN
        {
            "id": "job_11",
            "title": "Operations Manager - Logistics",
            "company": "Amazon",
            "location": "Seattle, WA",
            "job_type": "Full-time",
            "description": "Optimize warehouse operations and supply chain processes. Manage logistics teams, implement efficiency improvements, and ensure delivery targets are met. Use data analytics to drive operational decisions. Requires operations experience and leadership skills.",
            "search_category": "Operations Manager", 
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://amazon.com/careers"
        },
        {
            "id": "job_12",
            "title": "HR Business Partner - Tech",
            "company": "Google",
            "location": "Mountain View, CA",
            "job_type": "Full-time",
            "description": "Partner with engineering teams on talent management initiatives. Support performance management, career development, and organizational design. Drive culture initiatives and change management. Requires HR experience in tech environments.",
            "search_category": "HR Business Partner",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://google.com/careers"
        },
        
        # HEALTHCARE & LIFE SCIENCES
        {
            "id": "job_13",
            "title": "Healthcare Practice Manager",
            "company": "Kaiser Permanente",
            "location": "Oakland, CA",
            "job_type": "Full-time",
            "description": "Manage healthcare delivery operations. Oversee clinical staff, ensure regulatory compliance, and optimize patient care processes. Implement quality improvement initiatives and manage budgets. Requires healthcare administration background.",
            "search_category": "Healthcare Administrator",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://kp.org/careers"
        },
        {
            "id": "job_14",
            "title": "Clinical Research Manager",
            "company": "Pfizer",
            "location": "New York, NY",
            "job_type": "Full-time",
            "description": "Lead clinical trials for pharmaceutical products. Manage research protocols, ensure regulatory compliance, and coordinate with investigators. Analyze clinical data and prepare regulatory submissions. Requires clinical research experience and medical knowledge.",
            "search_category": "Research Manager",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://pfizer.com/careers"
        },
        
        # EDUCATION & TRAINING
        {
            "id": "job_15",
            "title": "Learning & Development Specialist",
            "company": "Microsoft",
            "location": "Redmond, WA",
            "job_type": "Full-time",
            "description": "Design and deliver corporate training programs. Develop learning curricula, facilitate workshops, and measure training effectiveness. Create e-learning content and manage learning management systems. Requires instructional design experience.",
            "search_category": "Training Specialist",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://microsoft.com/careers"
        },
        
        # LEGAL & COMPLIANCE
        {
            "id": "job_16",
            "title": "Corporate Counsel - Privacy",
            "company": "Zoom",
            "location": "San Jose, CA",
            "job_type": "Full-time",
            "description": "Provide legal counsel on privacy and data protection matters. Draft and review contracts, ensure GDPR compliance, and advise on regulatory requirements. Support product launches and business initiatives. Requires JD and privacy law expertise.",
            "search_category": "Legal Counsel",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://zoom.com/careers"
        },
        
        # EMERGING ROLES
        {
            "id": "job_17",
            "title": "AI Ethics Researcher",
            "company": "OpenAI",
            "location": "San Francisco, CA",
            "job_type": "Full-time",
            "description": "Research ethical implications of AI systems. Develop responsible AI frameworks, conduct bias analysis, and create ethical guidelines. Collaborate with technical teams on AI safety. Requires PhD in relevant field and AI ethics expertise.",
            "search_category": "AI Researcher",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://openai.com/careers"
        },
        {
            "id": "job_18",
            "title": "Sustainability Program Manager",
            "company": "Tesla",
            "location": "Austin, TX",
            "job_type": "Full-time",
            "description": "Lead corporate sustainability initiatives. Develop environmental programs, track carbon footprint, and drive renewable energy adoption. Create sustainability reports and engage stakeholders. Requires environmental science background.",
            "search_category": "Sustainability Manager",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://tesla.com/careers"
        },
        {
            "id": "job_19",
            "title": "Cybersecurity Analyst",
            "company": "CrowdStrike",
            "location": "Austin, TX",
            "job_type": "Full-time",
            "description": "Monitor security threats and investigate incidents. Implement security controls, conduct vulnerability assessments, and respond to breaches. Develop security policies and train employees. Requires cybersecurity certifications and technical skills.",
            "search_category": "Cybersecurity Analyst",
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://crowdstrike.com/careers"
        },
        {
            "id": "job_20",
            "title": "DevOps Engineer - Cloud",
            "company": "Kubernetes",
            "location": "Remote",
            "job_type": "Full-time",
            "description": "Build and maintain cloud infrastructure using Kubernetes and Docker. Implement CI/CD pipelines, automate deployments, and monitor system performance. Optimize cloud costs and ensure high availability. Requires DevOps experience and cloud expertise.",
            "search_category": "DevOps Engineer", 
            "date_scraped": datetime.now().isoformat(),
            "job_url": "https://kubernetes.io/careers"
        }
    ]
    
    # Save jobs data
    with open('scraped_jobs.json', 'w', encoding='utf-8') as f:
        json.dump(jobs_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {len(jobs_data)} diverse job profiles for testing!")
    
    # Display summary
    print("\n📊 JOB PROFILE SUMMARY:")
    print("=" * 40)
    
    categories = {}
    for job in jobs_data:
        category = job['search_category']
        categories[category] = categories.get(category, 0) + 1
    
    for category, count in categories.items():
        print(f"  • {category}: {count} job(s)")
    
    print(f"\n📁 File created: scraped_jobs.json ({len(jobs_data)} jobs)")
    print("\n🚀 Ready for comprehensive revolutionary assessment testing!")
    
    return jobs_data

if __name__ == "__main__":
    jobs = create_test_jobs()
    print(f"\n🎯 Next: Testing {len(jobs)} diverse job roles on the assessment platform!")
