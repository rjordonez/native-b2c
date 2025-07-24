import React from 'react';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

const PrivacyPage = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <button
              onClick={() => window.location.href = '/'}
              className="mb-8 inline-flex items-center text-gray-500 hover:text-primary transition-colors text-base font-medium focus:outline-none"
              style={{ background: 'none', border: 'none', padding: 0, boxShadow: 'none', cursor: 'pointer' }}
              aria-label="Back to Home"
            >
              ← Back to Home
            </button>
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Personal Information Protection Policy
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  <strong>Effective Date:</strong> March 1st, 2025
                </p> 
                <p className="text-sm text-gray-500 mb-4">
                  Operated by J&R Innovations, Inc.<br />
                  1337 Isengard Court, San Jose, CA 95112
                </p>
                <p className="text-sm text-primary">
                  📧 support@nativespeaking.ai
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {/* Article 1 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 1: Purpose
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    This policy explains how Native ("we", "our", or "us") collects, uses, manages, and protects 
                    personal information provided by users, including teachers, students, and guardians. We are 
                    committed to safeguarding your data in accordance with laws such as COPPA, FERPA, CCPA, and GDPR. 
                    This policy also describes how we use certain data—only with appropriate safeguards—to improve 
                    our AI models and learning services.
                  </p>
                </section>

                {/* Article 2 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 2: Definition of Personal Information
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "Personal information" includes any data that identifies an individual directly or indirectly, such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>School or institutional affiliation</li>
                    <li>Audio recordings or speech submissions</li>
                    <li>Feedback or analytics linked to identifiable users</li>
                    <li>IP address, cookies, and device/browser identifiers</li>
                  </ul>
                </section>

                {/* Article 3 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 3: Scope of Application
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This policy applies to all users of the Native platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Teachers and instructors</li>
                    <li>Students submitting speech recordings</li>
                    <li>Legal guardians authorizing student participation</li>
                    <li>Visitors interacting with Native services</li>
                  </ul>
                </section>

                {/* Article 4 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 4: Purpose of Use
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect and process personal data to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Deliver educational and speaking evaluation services</li>
                    <li>Provide users with personalized feedback</li>
                    <li>Improve overall product quality and user experience</li>
                    <li>Support technical troubleshooting and respond to inquiries</li>
                    <li>Notify users of updates, issues, or new features</li>
                    <li>Train and enhance the performance of our AI models, including speech recognition, feedback generation, and language assessment systems</li>
                  </ul>
                </section>

                {/* Article 5 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 5: Legal Grounds for Processing
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We rely on the following legal bases:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Explicit user or guardian consent (e.g., at signup or class enrollment)</li>
                    <li>Performance of educational services under our terms of use</li>
                    <li>Legal obligations, especially related to minors and data protection</li>
                    <li>Legitimate interests in improving service quality and ensuring platform security</li>
                  </ul>
                </section>

                {/* Article 6 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 6: Data Security and Management
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use industry-standard practices to protect your data:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Encrypted transmission and secure cloud storage</li>
                    <li>Role-based access controls and monitoring</li>
                    <li>Routine security audits and vulnerability management</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    We take steps to ensure data accuracy and prevent unauthorized access, misuse, or loss.
                  </p>
                </section>

                {/* Article 7 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 7: Handling of Children's Data
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Native is intended for use under adult supervision. We do not knowingly collect data from 
                    users under 18 without parental or guardian consent. Teachers must:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Obtain verifiable guardian consent for students before use</li>
                    <li>Comply with COPPA, FERPA, CCPA, and GDPR</li>
                    <li>Acknowledge responsibility for any submitted student data</li>
                  </ul>
                  <div className="p-4">
                    <p className="text-gray-700">
                      <strong>⚠️ Notice:</strong> Failure to comply may result in data deletion or account suspension.
                    </p>
                  </div>
                </section>

                {/* Article 8 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 8: Use of Data for Model Training
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To improve our AI models and deliver better learning tools:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>We may use anonymized or pseudonymized user data (such as audio recordings and feedback logs) to train and evaluate our AI systems</li>
                    <li>All model training follows strict internal review processes</li>
                    <li>Personally identifiable data is never sold or shared for commercial advertising</li>
                    <li>Users and guardians may opt out of model training by contacting us (see Article 10)</li>
                  </ul>
                </section>

                {/* Article 9 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 9: Provision to Third Parties
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We never sell or rent user data. Data may be shared only:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>With trusted service providers (e.g., cloud hosting, analytics) under data processing agreements</li>
                    <li>As required by law or legal requests</li>
                    <li>In business transitions (e.g., mergers), under continued data protection guarantees</li>
                  </ul>
                </section>

                {/* Article 10 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 10: User Rights
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may at any time:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Request access to your personal data</li>
                    <li>Correct or delete inaccurate information</li>
                    <li>Withdraw consent (including use for AI training)</li>
                    <li>Request data export or copies</li>
                    <li>Contact regulatory bodies to file complaints</li>
                  </ul>
                  <div className="p-4">
                    <p className="text-gray-700">
                      <strong>💡 How to Exercise Your Rights:</strong> To exercise these rights, email us at support@nativespeaking.ai
                    </p>
                  </div>
                </section>

                {/* Article 11 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 11: Retention Period
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We keep personal data only as long as needed to fulfill the purposes above, or as required by law. 
                    Anonymized or aggregated data may be stored for research or statistical improvement of our services.
                  </p>
                </section>

                {/* Article 12 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 12: Policy Revisions
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may revise this policy due to legal, operational, or technical updates. Major changes will be 
                    clearly communicated via the platform or email. Continued use indicates your agreement to the 
                    updated terms.
                  </p>
                </section>

                {/* Article 13 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 13: Student Privacy Notice
                  </h2>
                  <div className="p-6 rounded-lg mb-4">
                    <p className="text-gray-700 font-semibold mb-2">
                      📚 Student Privacy Notice
                    </p>
                    <p className="text-gray-700">
                      This notice outlines how Native uses and protects your information as required by law.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        1. Who collects and controls your data?
                      </h3>
                      <p className="text-gray-700">
                        Your teacher is responsible for managing your account. Native (J&R Innovations, Inc.) processes your data only to provide the learning services.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        2. What data is collected?
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Your name (if entered)</li>
                        <li>Audio recordings of your speaking</li>
                        <li>AI feedback (fluency, pronunciation, grammar, vocabulary)</li>
                        <li>Usage activity, such as when and how often you submit recordings</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        3. Why is this data collected?
                      </h3>
                      <p className="text-gray-700">
                        To give you feedback, track your progress, and help your teacher support your learning. We may also use de-identified data to improve our AI models and make the system better for all learners.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        4. Who can see your data?
                      </h3>
                      <p className="text-gray-700">
                        Only your teacher and authorized members of Native's support and engineering teams (under strict access controls).
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        5. Do you need permission to use Native?
                      </h3>
                      <p className="text-gray-700">
                        Yes. If you're under 18, your teacher must receive permission from your parent or guardian before you use Native.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        6. How is your data protected?
                      </h3>
                      <p className="text-gray-700">
                        Your data is encrypted and securely stored. Native follows strict data protection rules and never sells your data.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        7. Can your data help improve the platform?
                      </h3>
                      <p className="text-gray-700">
                        We may use de-identified and aggregated student data to train and improve our speech analysis models. This data is never linked to your name or identity.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        8. Can you ask for your data to be deleted?
                      </h3>
                      <p className="text-gray-700">
                        Yes. You or your teacher can request deletion at any time by contacting support@nativespeaking.ai.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Article 14 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 14: Contact
                  </h2>
                  <div className="p-6 rounded-lg">
                    <p className="text-gray-700 font-semibold mb-2">J&R Innovations, Inc.</p>
                    <p className="text-gray-700 mb-2">📍 1337 Isengard Court, San Jose, CA 95112</p>
                    <p className="text-gray-700">📧 support@nativespeaking.ai</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
};

export default PrivacyPage;