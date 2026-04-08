CyberLens – AI-Powered Threat Detection System

Project Name
CyberLens – Real-Time AI-Based Threat Detection for Web and Browser Environments

Problem Statement
Users are increasingly exposed to sophisticated cyber threats while browsing the web, including phishing attacks, malicious links, prompt injection attempts, and unsafe file downloads. These threats are often disguised within normal user interactions and are difficult to detect in real time.

Existing solutions are largely reactive, relying on blacklists or post-execution detection. They do not provide intelligent, real-time analysis of content before it is accessed.

There is a need for a proactive system that can analyze web content and user interactions before execution, helping users make informed security decisions.

Project Description
CyberLens is an AI-powered security system implemented as a web application and browser extension. It intercepts user actions such as opening links or files and performs real-time analysis using an AI model before allowing execution.

The system integrates with the browser workflow and presents users with a risk assessment based on AI-driven analysis. Users can then choose to proceed or block the action.

CyberLens is designed with a modular architecture that can be extended to mobile platforms in the future. The smartphone-based forensic interception system, including call analysis and deep file inspection, is part of the planned future scope and is not included in the current implementation.

Core Features
Link Analysis
CyberLens analyzes URLs before navigation. It detects phishing attempts and prompt injection patterns and provides a risk assessment to the user.

Prompt Injection Detection
The system uses AI to identify malicious inputs designed to manipulate AI systems, including instruction override attacks and attempts to extract sensitive information.

File Inspection (Basic)
CyberLens inspects file metadata and basic characteristics before allowing downloads or opening. This helps identify suspicious or potentially unsafe files.

Browser Extension Integration
The extension integrates directly with the browser, allowing seamless interception of links and user actions without disrupting the browsing experience.

 Risk Decision Interface
Users are presented with a clear decision interface showing risk levels and explanations, allowing them to choose whether to proceed or block an action.

Smartphone Security System (Future Scope)
CyberLens is designed to be extended into a mobile forensic system with capabilities such as call analysis, image threat detection, and device-level monitoring. These features are part of future development.

Technology Stack

Frontend
React is used to build a responsive and interactive user interface, including dashboards and warning screens.

Backend
Firebase is used for backend services, including authentication, database storage, and Cloud Functions for handling AI requests.

 AI Layer
Google Gemini 1.5 Flash is used for real-time threat detection and classification. It enables fast and efficient analysis of web content and user inputs.

Development Tools
Antigravity IDE was used for development and rapid prototyping.

Google AI Usage

Tools and Models Used
Google Gemini 2.5 Flash

How Google AI Was Used
Gemini 2.5 Flash is integrated as the core intelligence layer of CyberLens. It analyzes links, text inputs, and contextual data to detect phishing attempts, prompt injection attacks, and suspicious patterns.

The AI model generates structured outputs including risk scores, threat classifications, and recommended actions. These outputs are used by the system to guide user decisions.

Firebase Cloud Functions are used to securely connect to the Gemini API and process requests.

Proof of Google AI Usage

The project includes a proof folder containing:





Screenshots



Demo Video

A demonstration video is available at the following link: 
Add your Google Drive link here

Installation Steps
Clone the repository
git clone <your-repo-link>
Navigate to the project directory
cd cyberlens
Install dependencies
npm install
Run the project
npm start

Security and Privacy

CyberLens follows a user-driven approach, ensuring that all actions are transparent and require user consent. Only minimal data is processed for AI analysis, and results are clearly explained to the user.

Challenges Faced

Key challenges included integrating real-time AI analysis with low latency, designing a seamless browser interception flow, and minimizing false positives in threat detection.

Unique Value Proposition

CyberLens provides proactive, AI-driven threat detection at the point of interaction. By analyzing content before execution and involving the user in decision-making, it enhances both security and transparency.

Future Scope

Future development will focus on extending CyberLens to mobile platforms, including real-time call analysis, advanced file inspection, image threat detection, and device-level monitoring.

Conclusion

CyberLens is a proactive AI-based security system that helps users identify and avoid threats
