import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="text-white mt-20" style={{backgroundColor: '#101435'}}>
      <div className="accent-bar"></div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h3 className="font-black text-2xl mb-6 text-white">{SITE_NAME}</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-4">Sections</h4>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/section/Politics" className="text-gray-300 hover:text-white transition-colors">Politics</Link>
              <Link href="/section/Economics" className="text-gray-300 hover:text-white transition-colors">Economics</Link>
              <Link href="/section/Elections" className="text-gray-300 hover:text-white transition-colors">Elections</Link>
              <Link href="/section/Trade" className="text-gray-300 hover:text-white transition-colors">Trade</Link>
              <Link href="/section/Finance" className="text-gray-300 hover:text-white transition-colors">Finance</Link>
              <Link href="/section/Sport" className="text-gray-300 hover:text-white transition-colors">Sport</Link>
              <Link href="/section/Culture" className="text-gray-300 hover:text-white transition-colors">Culture</Link>
              <Link href="/section/World Events" className="text-gray-300 hover:text-white transition-colors">World Events</Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}