'use client'

import { AlertTriangle, Database, ExternalLink } from 'lucide-react'

export default function DatabaseNotConfigured() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Database Not Configured
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            The application is running with placeholder database credentials. Some features will be limited.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.open('https://cloud.mongodb.com/', '_blank')}
              className="inline-flex items-center text-sm text-yellow-800 hover:text-yellow-900 font-medium"
            >
              <Database className="h-4 w-4 mr-1" />
              Set up MongoDB Atlas
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
            <span className="text-yellow-600">•</span>
            <button
              onClick={() => {
                const element = document.createElement('div')
                element.innerHTML = `
                  <div style="background: #1f2937; color: #f3f4f6; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; line-height: 1.4;">
                    <div style="color: #10b981; margin-bottom: 8px;">📝 Quick Setup Instructions:</div>
                    <div>1. Create MongoDB Atlas account at cloud.mongodb.com</div>
                    <div>2. Create a new cluster (free tier available)</div>
                    <div>3. Get your connection string</div>
                    <div>4. Update MONGODB_URI in .env.local</div>
                    <div style="margin-top: 8px; color: #fbbf24;">MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname</div>
                  </div>
                `
                const modal = document.createElement('div')
                modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;'
                modal.appendChild(element)
                modal.onclick = () => modal.remove()
                document.body.appendChild(modal)
                setTimeout(() => modal.remove(), 10000)
              }}
              className="text-sm text-yellow-800 hover:text-yellow-900 font-medium"
            >
              Show setup guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
