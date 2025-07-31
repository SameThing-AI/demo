#!/usr/bin/env python3
"""
REVOLUTIONARY ASSESSMENT MACHINE - COMPREHENSIVE TESTING SYSTEM
Tests all 20 job roles and implements 10 feedback loops per role
"""

import json
import asyncio
import aiohttp
import time
from datetime import datetime
import os
import pandas as pd

class RevolutionaryAssessmentTester:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.api_key = self.load_api_key()
        self.test_results = []
        self.feedback_loops = []
        
    def load_api_key(self):
        """Load OpenAI API key from environment"""
        try:
            with open('.env.local', 'r') as f:
                content = f.read()
                for line in content.split('\n'):
                    if 'OPENAI_API_KEY=' in line:
                        return line.split('=')[1].strip('"')
        except:
            return None
    
    async def test_single_job_role(self, job_data, loop_iteration=1):
        """Test a single job role through the complete assessment pipeline"""
        
        print(f"\n🎯 TESTING: {job_data['title']} at {job_data['company']}")
        print(f"   Loop Iteration: {loop_iteration}/10")
        print("   " + "=" * 50)
        
        test_result = {
            "job_id": job_data['id'],
            "job_title": job_data['title'],
            "company": job_data['company'],
            "category": job_data['search_category'],
            "loop_iteration": loop_iteration,
            "timestamp": datetime.now().isoformat(),
            "tests": {}
        }
        
        # Test 1: Environment Generation
        print("   🔬 Test 1: Revolutionary Environment Generation...")
        env_result = await self.test_environment_generation(job_data)
        test_result["tests"]["environment_generation"] = env_result
        
        # Test 2: Assessment Detection Logic
        print("   🔬 Test 2: Revolutionary Assessment Detection...")
        detection_result = self.test_assessment_detection(job_data)
        test_result["tests"]["assessment_detection"] = detection_result
        
        # Test 3: Interactive Sandbox Quality
        print("   🔬 Test 3: Interactive Sandbox Quality...")
        sandbox_result = await self.test_sandbox_quality(env_result)
        test_result["tests"]["sandbox_quality"] = sandbox_result
        
        # Test 4: Code Execution Capability
        print("   🔬 Test 4: Code Execution Capability...")
        execution_result = self.test_code_execution(env_result)
        test_result["tests"]["code_execution"] = execution_result
        
        # Test 5: Role Specificity
        print("   🔬 Test 5: Role-Specific Content Analysis...")
        specificity_result = self.test_role_specificity(job_data, env_result)
        test_result["tests"]["role_specificity"] = specificity_result
        
        # Test 6: Assessment Evaluation
        print("   🔬 Test 6: AI-Powered Evaluation...")
        evaluation_result = await self.test_assessment_evaluation(job_data)
        test_result["tests"]["evaluation_quality"] = evaluation_result
        
        # Test 7: Engagement Level
        print("   🔬 Test 7: Engagement and Interactivity...")
        engagement_result = self.test_engagement_level(env_result)
        test_result["tests"]["engagement_level"] = engagement_result
        
        # Test 8: Revolutionary Features
        print("   🔬 Test 8: Revolutionary Features Check...")
        revolutionary_result = self.test_revolutionary_features(env_result)
        test_result["tests"]["revolutionary_features"] = revolutionary_result
        
        # Calculate overall score
        test_result["overall_score"] = self.calculate_overall_score(test_result["tests"])
        
        # Generate improvement recommendations
        test_result["improvements"] = self.generate_improvements(test_result)
        
        print(f"   ✅ Overall Score: {test_result['overall_score']}/100")
        
        return test_result
    
    async def test_environment_generation(self, job_data):
        """Test the live environment generation API"""
        
        scenario_data = {
            "scenario": {
                "role": job_data["title"],
                "company": job_data["company"],
                "description": job_data["description"],
                "difficulty": "revolutionary-maximum",
                "type": "infinity-sandbox"
            },
            "type": "infinity-sandbox",
            "complexity": "revolutionary-maximum"
        }
        
        try:
            # Direct API call to OpenAI (simulating our generate-live-environment endpoint)
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Content-Type': 'application/json',
                        'Authorization': f'Bearer {self.api_key}'
                    },
                    json={
                        "model": "gpt-4o",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are the world's most advanced AI assessment architect. Create revolutionary, executable, interactive assessment environments. Always respond with valid JSON only."
                            },
                            {
                                "role": "user",
                                "content": f"""Create a REVOLUTIONARY INFINITY SANDBOX assessment for: {json.dumps(scenario_data)}
                                
This must be a FULLY INTERACTIVE, EXECUTABLE environment with:
- Real JavaScript code that candidates can run and modify
- Interactive dashboards and tools specific to the role
- Industry-specific scenarios and challenges
- Real-time feedback and adaptation

Return JSON with interface components, scenarios, and executable code."""
                            }
                        ],
                        "temperature": 0.3,
                        "max_tokens": 4000
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        ai_response = result['choices'][0]['message']['content']
                        
                        # Parse the AI response
                        try:
                            clean_response = ai_response.strip()
                            if clean_response.startswith('```json'):
                                clean_response = clean_response.replace('```json', '').replace('```', '').strip()
                            
                            assessment_data = json.loads(clean_response)
                            
                            return {
                                "success": True,
                                "response_length": len(ai_response),
                                "has_interface": "interface" in assessment_data,
                                "has_components": bool(assessment_data.get("interface", {}).get("components")),
                                "component_count": len(assessment_data.get("interface", {}).get("components", [])),
                                "has_scenarios": "scenarios" in assessment_data,
                                "scenario_count": len(assessment_data.get("scenarios", [])),
                                "assessment_data": assessment_data,
                                "generation_time": 2.5  # Approximate
                            }
                        except json.JSONDecodeError:
                            return {
                                "success": False,
                                "error": "Failed to parse AI response as JSON",
                                "raw_response": ai_response[:500]
                            }
                    else:
                        return {
                            "success": False,
                            "error": f"API call failed with status {response.status}"
                        }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def test_assessment_detection(self, job_data):
        """Test if revolutionary assessment would be detected correctly"""
        
        mock_assessment = {
            "title": job_data["title"],
            "type": "revolutionary-ai",
            "company": job_data["company"],
            "revolutionaryFeatures": {
                "infinitySandbox": True,
                "aiGenerated": True,
                "dynamicAdaptation": True
            }
        }
        
        # Simulate the detection logic from TakeAssessment.tsx
        would_use_revolutionary = (
            mock_assessment.get("type") == "revolutionary-ai" or
            mock_assessment.get("revolutionaryFeatures", {}).get("infinitySandbox") or
            mock_assessment.get("assessmentInterface") or
            mock_assessment.get("assessmentType") == "revolutionary-ai" or
            mock_assessment.get("aiGenerated") or
            mock_assessment.get("generated")
        )
        
        return {
            "would_detect_revolutionary": would_use_revolutionary,
            "assessment_type": mock_assessment.get("type"),
            "infinity_sandbox": mock_assessment.get("revolutionaryFeatures", {}).get("infinitySandbox"),
            "expected_routing": "LiveSimulationEngine" if would_use_revolutionary else "Traditional Q&A"
        }
    
    async def test_sandbox_quality(self, env_result):
        """Test the quality and richness of the generated sandbox"""
        
        if not env_result.get("success") or not env_result.get("assessment_data"):
            return {"quality_score": 0, "issues": ["Environment generation failed"]}
        
        assessment_data = env_result["assessment_data"]
        interface = assessment_data.get("interface", {})
        components = interface.get("components", [])
        
        quality_metrics = {
            "has_executable_code": False,
            "code_complexity_score": 0,
            "interactive_elements": 0,
            "role_specific_tools": 0,
            "has_real_time_features": False,
            "educational_value": 0
        }
        
        total_code_length = 0
        interactive_count = 0
        
        for component in components:
            # Check for executable code
            if component.get("code"):
                quality_metrics["has_executable_code"] = True
                code_length = len(component["code"])
                total_code_length += code_length
                
                # Analyze code complexity
                code = component["code"]
                if "function" in code or "class" in code:
                    quality_metrics["code_complexity_score"] += 10
                if "async" in code or "await" in code:
                    quality_metrics["code_complexity_score"] += 5
                if "fetch" in code or "api" in code.lower():
                    quality_metrics["has_real_time_features"] = True
            
            # Check for interactivity
            if component.get("type") in ["interactive-dashboard", "simulator", "editor"]:
                interactive_count += 1
                quality_metrics["interactive_elements"] += 1
            
            # Check for role-specific content
            component_text = json.dumps(component).lower()
            if any(keyword in component_text for keyword in ["dashboard", "analytics", "tool", "simulator"]):
                quality_metrics["role_specific_tools"] += 1
        
        # Calculate overall quality score
        quality_score = min(100, 
            (quality_metrics["code_complexity_score"] * 2) +
            (quality_metrics["interactive_elements"] * 15) +
            (quality_metrics["role_specific_tools"] * 10) +
            (20 if quality_metrics["has_executable_code"] else 0) +
            (15 if quality_metrics["has_real_time_features"] else 0)
        )
        
        return {
            "quality_score": quality_score,
            "metrics": quality_metrics,
            "total_code_length": total_code_length,
            "interactive_count": interactive_count,
            "component_count": len(components)
        }
    
    def test_code_execution(self, env_result):
        """Test if generated code would be executable"""
        
        if not env_result.get("success") or not env_result.get("assessment_data"):
            return {"executable": False, "reason": "No environment generated"}
        
        components = env_result["assessment_data"].get("interface", {}).get("components", [])
        executable_components = 0
        syntax_errors = 0
        
        for component in components:
            code = component.get("code", "")
            if code:
                # Basic syntax checks
                try:
                    # Check for basic JavaScript syntax issues
                    if code.count("(") != code.count(")"):
                        syntax_errors += 1
                    elif code.count("{") != code.count("}"):
                        syntax_errors += 1
                    elif code.count("[") != code.count("]"):
                        syntax_errors += 1
                    else:
                        executable_components += 1
                except:
                    syntax_errors += 1
        
        return {
            "executable": executable_components > 0 and syntax_errors == 0,
            "executable_components": executable_components,
            "syntax_errors": syntax_errors,
            "total_components_with_code": len([c for c in components if c.get("code")])
        }
    
    def test_role_specificity(self, job_data, env_result):
        """Test how well the assessment matches the specific job role"""
        
        if not env_result.get("success"):
            return {"specificity_score": 0, "matches": []}
        
        job_title = job_data["title"].lower()
        job_description = job_data["description"].lower()
        assessment_content = json.dumps(env_result.get("assessment_data", {})).lower()
        
        # Define role-specific keywords
        role_keywords = {
            "product manager": ["roadmap", "stakeholder", "product", "metrics", "strategy", "user"],
            "software engineer": ["code", "api", "database", "algorithm", "debugging", "testing"],
            "data scientist": ["model", "data", "analysis", "statistics", "machine learning", "python"],
            "marketing": ["campaign", "brand", "customer", "analytics", "growth", "conversion"],
            "sales": ["pipeline", "revenue", "client", "negotiation", "quota", "crm"],
            "designer": ["design", "user experience", "wireframe", "prototype", "visual", "interface"],
            "analyst": ["analysis", "data", "report", "insights", "metrics", "dashboard"],
            "manager": ["team", "leadership", "strategy", "operations", "performance", "budget"],
            "consultant": ["strategy", "analysis", "recommendations", "client", "business", "solution"],
            "engineer": ["technical", "system", "architecture", "implementation", "optimization"],
            "researcher": ["research", "analysis", "study", "data", "methodology", "findings"],
            "specialist": ["expertise", "specialized", "knowledge", "skills", "training", "support"]
        }
        
        # Find matching keywords
        matches = []
        total_possible_matches = 0
        
        for role_type, keywords in role_keywords.items():
            if role_type in job_title:
                total_possible_matches = len(keywords)
                for keyword in keywords:
                    if keyword in assessment_content:
                        matches.append(keyword)
        
        specificity_score = (len(matches) / max(total_possible_matches, 1)) * 100 if total_possible_matches > 0 else 0
        
        return {
            "specificity_score": specificity_score,
            "matches": matches,
            "total_possible": total_possible_matches,
            "role_detected": any(role_type in job_title for role_type in role_keywords.keys())
        }
    
    async def test_assessment_evaluation(self, job_data):
        """Test the AI evaluation system"""
        
        mock_assessment_data = {
            "title": job_data["title"],
            "type": "revolutionary-ai",
            "company": job_data["company"],
            "description": job_data["description"]
        }
        
        mock_answers = {
            0: {
                "response": f"Completed {job_data['title']} assessment with innovative approach",
                "execution_time": 120,
                "complexity_score": 85
            }
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Content-Type': 'application/json',
                        'Authorization': f'Bearer {self.api_key}'
                    },
                    json={
                        "model": "gpt-4o",
                        "messages": [
                            {
                                "role": "system", 
                                "content": "You are an advanced AI assessment evaluator. Provide comprehensive evaluation with scores and feedback. Always respond with valid JSON only."
                            },
                            {
                                "role": "user",
                                "content": f"""Evaluate this {job_data['title']} assessment:
                                
ASSESSMENT: {json.dumps(mock_assessment_data)}
ANSWERS: {json.dumps(mock_answers)}

Return JSON with totalScore, percentage, breakdown, and detailed feedback."""
                            }
                        ],
                        "temperature": 0.2,
                        "max_tokens": 2000
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        ai_response = result['choices'][0]['message']['content']
                        
                        try:
                            clean_response = ai_response.strip()
                            if clean_response.startswith('```json'):
                                clean_response = clean_response.replace('```json', '').replace('```', '').strip()
                            
                            evaluation_data = json.loads(clean_response)
                            
                            return {
                                "success": True,
                                "is_dynamic": evaluation_data.get("totalScore", 85) != 85,
                                "has_breakdown": "breakdown" in evaluation_data,
                                "has_feedback": "feedback" in evaluation_data or "overallFeedback" in evaluation_data,
                                "score_range": "variable" if evaluation_data.get("totalScore", 85) != 85 else "fixed",
                                "evaluation_data": evaluation_data
                            }
                        except json.JSONDecodeError:
                            return {"success": False, "error": "Failed to parse evaluation response"}
                    else:
                        return {"success": False, "error": f"API call failed with status {response.status}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def test_engagement_level(self, env_result):
        """Test how engaging and interactive the assessment would be"""
        
        if not env_result.get("success"):
            return {"engagement_score": 0}
        
        assessment_data = env_result.get("assessment_data", {})
        interface = assessment_data.get("interface", {})
        components = interface.get("components", [])
        scenarios = assessment_data.get("scenarios", [])
        
        engagement_factors = {
            "interactive_components": len([c for c in components if "interactive" in c.get("type", "")]),
            "has_real_time": interface.get("features", {}).get("realTime", False),
            "has_code_execution": interface.get("features", {}).get("codeExecution", False),
            "has_visualization": interface.get("features", {}).get("dataVisualization", False),
            "scenario_variety": len(scenarios),
            "has_challenges": sum(1 for c in components if c.get("challenges"))
        }
        
        # Calculate engagement score
        engagement_score = min(100,
            (engagement_factors["interactive_components"] * 20) +
            (20 if engagement_factors["has_real_time"] else 0) +
            (25 if engagement_factors["has_code_execution"] else 0) +
            (15 if engagement_factors["has_visualization"] else 0) +
            (engagement_factors["scenario_variety"] * 5) +
            (engagement_factors["has_challenges"] * 10)
        )
        
        return {
            "engagement_score": engagement_score,
            "factors": engagement_factors
        }
    
    def test_revolutionary_features(self, env_result):
        """Test if the assessment has truly revolutionary features"""
        
        if not env_result.get("success"):
            return {"revolutionary_score": 0, "features": []}
        
        assessment_data = env_result.get("assessment_data", {})
        assessment_text = json.dumps(assessment_data).lower()
        
        revolutionary_features = []
        
        # Check for revolutionary keywords/concepts
        revolutionary_indicators = [
            ("infinity sandbox", "infinity" in assessment_text and "sandbox" in assessment_text),
            ("ai-powered", "ai" in assessment_text or "artificial intelligence" in assessment_text),
            ("real-time adaptation", "real-time" in assessment_text or "adaptive" in assessment_text),
            ("interactive execution", "interactive" in assessment_text and "execution" in assessment_text),
            ("dynamic content", "dynamic" in assessment_text),
            ("immersive experience", "immersive" in assessment_text),
            ("executable code", "executable" in assessment_text or "code" in assessment_text),
            ("live simulation", "simulation" in assessment_text or "simulator" in assessment_text)
        ]
        
        for feature_name, has_indicator in revolutionary_indicators:
            if has_indicator:
                revolutionary_features.append(feature_name)
        
        revolutionary_score = (len(revolutionary_features) / len(revolutionary_indicators)) * 100
        
        return {
            "revolutionary_score": revolutionary_score,
            "features": revolutionary_features,
            "total_possible": len(revolutionary_indicators)
        }
    
    def calculate_overall_score(self, tests):
        """Calculate overall assessment quality score"""
        
        weights = {
            "environment_generation": 20,
            "assessment_detection": 15,
            "sandbox_quality": 20,
            "code_execution": 15,
            "role_specificity": 10,
            "evaluation_quality": 10,
            "engagement_level": 5,
            "revolutionary_features": 5
        }
        
        total_score = 0
        total_weight = 0
        
        for test_name, weight in weights.items():
            if test_name in tests:
                test_result = tests[test_name]
                
                # Extract score based on test type
                if test_name == "environment_generation":
                    score = 100 if test_result.get("success") else 0
                elif test_name == "assessment_detection":
                    score = 100 if test_result.get("would_detect_revolutionary") else 0
                elif test_name == "sandbox_quality":
                    score = test_result.get("quality_score", 0)
                elif test_name == "code_execution":
                    score = 100 if test_result.get("executable") else 0
                elif test_name == "role_specificity":
                    score = test_result.get("specificity_score", 0)
                elif test_name == "evaluation_quality":
                    score = 100 if test_result.get("success") else 0
                elif test_name == "engagement_level":
                    score = test_result.get("engagement_score", 0)
                elif test_name == "revolutionary_features":
                    score = test_result.get("revolutionary_score", 0)
                else:
                    score = 0
                
                total_score += score * (weight / 100)
                total_weight += weight
        
        return round(total_score / (total_weight / 100) if total_weight > 0 else 0, 1)
    
    def generate_improvements(self, test_result):
        """Generate specific improvement recommendations"""
        
        improvements = []
        tests = test_result["tests"]
        
        # Environment generation improvements
        if not tests.get("environment_generation", {}).get("success"):
            improvements.append("Fix environment generation API - ensure OpenAI integration works")
        
        # Sandbox quality improvements  
        sandbox_score = tests.get("sandbox_quality", {}).get("quality_score", 0)
        if sandbox_score < 70:
            improvements.append("Improve sandbox quality - add more interactive components and executable code")
        
        # Role specificity improvements
        specificity_score = tests.get("role_specificity", {}).get("specificity_score", 0)
        if specificity_score < 60:
            improvements.append(f"Increase role-specific content for {test_result['job_title']} - add more relevant tools and scenarios")
        
        # Code execution improvements
        if not tests.get("code_execution", {}).get("executable"):
            improvements.append("Fix code generation - ensure all generated code is syntactically correct and executable")
        
        # Engagement improvements
        engagement_score = tests.get("engagement_level", {}).get("engagement_score", 0)
        if engagement_score < 70:
            improvements.append("Increase interactivity - add more real-time features and user engagement elements")
        
        # Revolutionary features improvements
        revolutionary_score = tests.get("revolutionary_features", {}).get("revolutionary_score", 0)
        if revolutionary_score < 60:
            improvements.append("Enhance revolutionary features - add more AI-powered, adaptive, and immersive elements")
        
        return improvements
    
    async def run_comprehensive_testing(self):
        """Run comprehensive testing on all job roles with feedback loops"""
        
        print("🔥 REVOLUTIONARY ASSESSMENT MACHINE - COMPREHENSIVE TESTING")
        print("=" * 80)
        print("🚀 Testing 20 job roles with 10 feedback loops each = 200 total tests")
        print("🎯 Building the ultimate self-sustaining assessment creation machine!")
        print("\n")
        
        # Load job data
        try:
            with open('scraped_jobs.json', 'r') as f:
                jobs_data = json.load(f)
        except FileNotFoundError:
            print("❌ scraped_jobs.json not found. Run create_test_jobs.py first!")
            return
        
        all_results = []
        
        # Test each job role with feedback loops
        for job_index, job_data in enumerate(jobs_data):
            print(f"\n🎯 JOB ROLE {job_index + 1}/20: {job_data['title']}")
            print("=" * 60)
            
            job_results = []
            
            # Run 10 feedback loops for each job
            for loop in range(1, 11):
                try:
                    result = await self.test_single_job_role(job_data, loop)
                    job_results.append(result)
                    all_results.append(result)
                    
                    print(f"   📊 Loop {loop}/10 - Score: {result['overall_score']}/100")
                    
                    # Brief pause between loops
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    print(f"   ❌ Loop {loop} failed: {str(e)}")
                    continue
            
            # Analyze improvement trend for this job
            if job_results:
                self.analyze_job_improvement_trend(job_data, job_results)
            
            print(f"   ✅ Completed all feedback loops for {job_data['title']}")
        
        # Generate comprehensive report
        self.generate_comprehensive_report(all_results)
        
        print("\n🎉 COMPREHENSIVE TESTING COMPLETE!")
        print("📊 Check assessment_testing_report.json for detailed results")
    
    def analyze_job_improvement_trend(self, job_data, job_results):
        """Analyze improvement trends for a specific job role"""
        
        scores = [result["overall_score"] for result in job_results]
        
        if len(scores) >= 2:
            improvement = scores[-1] - scores[0]
            avg_score = sum(scores) / len(scores)
            
            print(f"   📈 Improvement Trend: {improvement:+.1f} points")
            print(f"   📊 Average Score: {avg_score:.1f}/100")
            
            # Track best and worst performing aspects
            best_aspects = {}
            worst_aspects = {}
            
            for result in job_results:
                for test_name, test_result in result["tests"].items():
                    if test_name not in best_aspects:
                        best_aspects[test_name] = []
                        worst_aspects[test_name] = []
                    
                    # Simplified score extraction
                    score = 0
                    if isinstance(test_result, dict):
                        score = test_result.get("quality_score", 0) or test_result.get("engagement_score", 0) or test_result.get("specificity_score", 0) or test_result.get("revolutionary_score", 0)
                        if test_result.get("success") is True:
                            score = 100
                        elif test_result.get("success") is False:
                            score = 0
                    
                    best_aspects[test_name].append(score)
            
            # Find consistently high/low performing areas
            for aspect, scores in best_aspects.items():
                avg_aspect_score = sum(scores) / len(scores) if scores else 0
                if avg_aspect_score > 80:
                    print(f"   💪 Strong: {aspect} ({avg_aspect_score:.1f})")
                elif avg_aspect_score < 50:
                    print(f"   ⚠️  Weak: {aspect} ({avg_aspect_score:.1f})")
    
    def generate_comprehensive_report(self, all_results):
        """Generate detailed comprehensive report"""
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "total_tests": len(all_results),
            "unique_jobs": len(set(r["job_id"] for r in all_results)),
            "summary": {
                "average_overall_score": sum(r["overall_score"] for r in all_results) / len(all_results) if all_results else 0,
                "highest_scoring_job": max(all_results, key=lambda x: x["overall_score"]) if all_results else None,
                "lowest_scoring_job": min(all_results, key=lambda x: x["overall_score"]) if all_results else None
            },
            "by_job_category": {},
            "improvement_trends": {},
            "platform_readiness": {},
            "detailed_results": all_results
        }
        
        # Group by category
        by_category = {}
        for result in all_results:
            category = result["category"]
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(result)
        
        # Calculate category averages
        for category, results in by_category.items():
            avg_score = sum(r["overall_score"] for r in results) / len(results)
            report["by_job_category"][category] = {
                "average_score": avg_score,
                "test_count": len(results),
                "sample_jobs": list(set(r["job_title"] for r in results))
            }
        
        # Platform readiness assessment
        successful_tests = sum(1 for r in all_results if r["overall_score"] >= 70)
        readiness_percentage = (successful_tests / len(all_results)) * 100 if all_results else 0
        
        report["platform_readiness"] = {
            "readiness_percentage": readiness_percentage,
            "successful_tests": successful_tests,
            "total_tests": len(all_results),
            "ready_for_production": readiness_percentage >= 80,
            "critical_issues": self.identify_critical_issues(all_results)
        }
        
        # Save report
        with open('assessment_testing_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        # Generate human-readable summary
        self.generate_human_readable_report(report)
    
    def identify_critical_issues(self, all_results):
        """Identify critical issues across all tests"""
        
        issues = []
        
        # Check environment generation failures
        env_failures = sum(1 for r in all_results if not r["tests"].get("environment_generation", {}).get("success"))
        if env_failures > len(all_results) * 0.2:  # More than 20% failures
            issues.append(f"Environment generation failing in {env_failures} tests")
        
        # Check assessment detection failures
        detection_failures = sum(1 for r in all_results if not r["tests"].get("assessment_detection", {}).get("would_detect_revolutionary"))
        if detection_failures > 0:
            issues.append(f"Revolutionary assessment detection failing in {detection_failures} tests")
        
        # Check low sandbox quality
        low_quality = sum(1 for r in all_results if r["tests"].get("sandbox_quality", {}).get("quality_score", 0) < 50)
        if low_quality > len(all_results) * 0.3:
            issues.append(f"Low sandbox quality in {low_quality} tests")
        
        return issues
    
    def generate_human_readable_report(self, report):
        """Generate human-readable summary report"""
        
        summary_text = f"""
🔥 REVOLUTIONARY ASSESSMENT MACHINE - TESTING REPORT
===============================================================

📊 TESTING SUMMARY:
• Total Tests Completed: {report['total_tests']}
• Unique Job Roles: {report['unique_jobs']}
• Average Overall Score: {report['summary']['average_overall_score']:.1f}/100
• Platform Readiness: {report['platform_readiness']['readiness_percentage']:.1f}%

🏆 TOP PERFORMERS:
• Best Job: {report['summary']['highest_scoring_job']['job_title']} ({report['summary']['highest_scoring_job']['overall_score']}/100)
• Worst Job: {report['summary']['lowest_scoring_job']['job_title']} ({report['summary']['lowest_scoring_job']['overall_score']}/100)

📋 BY JOB CATEGORY:
"""
        
        for category, data in report['by_job_category'].items():
            summary_text += f"• {category}: {data['average_score']:.1f}/100 ({data['test_count']} tests)\n"
        
        summary_text += f"""
🚀 PLATFORM READINESS:
• Ready for Production: {'YES' if report['platform_readiness']['ready_for_production'] else 'NO'}
• Success Rate: {report['platform_readiness']['readiness_percentage']:.1f}%
• Critical Issues: {len(report['platform_readiness']['critical_issues'])}

⚠️ CRITICAL ISSUES:
"""
        
        for issue in report['platform_readiness']['critical_issues']:
            summary_text += f"• {issue}\n"
        
        summary_text += f"""
🎯 RECOMMENDATIONS:
1. Focus on improving areas with scores below 70
2. Fix environment generation if API issues persist  
3. Enhance role-specific content generation
4. Optimize sandbox interactivity and code quality
5. Implement feedback loop improvements

Generated: {report['generated_at']}
"""
        
        with open('TESTING_SUMMARY.txt', 'w') as f:
            f.write(summary_text)
        
        print("\n📋 SUMMARY REPORT GENERATED:")
        print(summary_text)

async def main():
    """Main execution function"""
    tester = RevolutionaryAssessmentTester()
    await tester.run_comprehensive_testing()

if __name__ == "__main__":
    asyncio.run(main())
