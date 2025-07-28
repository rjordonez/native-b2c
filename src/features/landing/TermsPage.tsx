import React from 'react';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

const TermsPage = () => {
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
                  Terms & Conditions of Use
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
                    Article 1: Scope & Applicability
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms apply when you access or use Native's website, mobile apps, or services ("Platform"). 
                    Whether you're registering, recording, teaching, or reviewing, your use constitutes acceptance of 
                    all Terms—including any future updates.
                  </p>
                </section>

                {/* Article 2 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 2: Account Types & Eligibility
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Native offers distinct account roles to align with your use case while ensuring compliance and safety:
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Account Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Minimum Age</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role Descriptions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Teacher</td>
                          <td className="border border-gray-300 px-4 py-2">≥18</td>
                          <td className="border border-gray-300 px-4 py-2">Creates classes, assigns tasks, reviews student submissions</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Student</td>
                          <td className="border border-gray-300 px-4 py-2">Any age via class code</td>
                          <td className="border border-gray-300 px-4 py-2">Submits responses; if under 18, use requires teacher-provided consent</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Guest</td>
                          <td className="border border-gray-300 px-4 py-2">Any age</td>
                          <td className="border border-gray-300 px-4 py-2">Can view public features (if any) without submitting content</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700">
                      <strong>🛑 Important:</strong> Students under 18 in select regions may only participate through Teacher-issued 
                      class codes, with parental consent. Teachers guarantee this consent is in place.
                    </p>
                  </div>
                </section>

                {/* Article 3 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 3: Registration & Consent
                  </h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Your registration information is complete and accurate.</li>
                    <li>Teachers must confirm they are 18+ and have secured required consent for student use.</li>
                    <li>Students enroll using a valid class code. The Teacher confirms that parental consent is obtained for minors.</li>
                    <li>We reserve the right to refuse or suspend accounts based on misuse or policy violations.</li>
                  </ul>
                </section>

                {/* Article 4 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 4: Platform Use Guidelines
                  </h2>
                  <p className="text-gray-700 mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Upload or distribute illegal, abusive, or copyrighted content.</li>
                    <li>Impersonate others or misuse the identity or data of minors.</li>
                    <li>Reverse-engineer, scrape, or otherwise exploit the Platform.</li>
                    <li>Transfer or share your account credentials.</li>
                  </ul>
                </section>

                {/* Article 5 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 5: Third‑Party Content & Links
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may include links to third-party sites, offers, or integrations. These are for convenience only. 
                    You're responsible for reviewing and complying with any third-party terms. Native isn't responsible 
                    for content or services outside our Platform.
                  </p>
                </section>

                {/* Article 6 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 6: Parental Consent & Data Protection
                  </h2>
                  <p className="text-gray-700 mb-4">Native is designed for teacher-guided use. If students under 18 participate:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Teachers must have verifiable parental or guardian consent before collecting or submitting student data.</li>
                    <li>Data includes voice recordings, names, evaluations, transcripts.</li>
                    <li>Teachers must comply with COPPA, CCPA, GDPR, and other relevant child protections.</li>
                    <li>We will delete non-compliant data and reserve the right to suspend or terminate accounts involved.</li>
                  </ul>
                </section>

                {/* Article 7 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 7: Fees, Payments & Promotions
                  </h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Pricing is listed on our Platform and may change with notice.</li>
                    <li>All payments are upfront unless stated otherwise.</li>
                    <li>No refunds for unused services or early termination, except as required by law.</li>
                    <li>Promotions may be offered at our discretion; they are non-transferable and may expire.</li>
                  </ul>
                </section>

                {/* Article 8 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 8: Intellectual Property & License
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    All Platform elements—code, UI, content, trademarks—belong to J&R Innovations, Inc. Native grants 
                    users a limited, non-exclusive, revocable license to use the Platform as intended. Unauthorized use 
                    (e.g., copying, redistributing) is prohibited.
                  </p>
                </section>

                {/* Article 9 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 9: DMCA & Infringement Policy
                  </h2>
                  <p className="text-gray-700 mb-4">If you believe your copyright has been infringed through the Platform:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Send a DMCA takedown notice, including all required elements (your info, infringing content URL, etc.).</li>
                    <li>Eduling's process serves as a model for copyright compliance and takedown procedure.</li>
                    <li>We reserve the right to terminate repeat infringers.</li>
                  </ul>
                </section>

                {/* Article 10 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 10: Disclaimers & Limitations of Liability
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Platform is offered "as is" without warranties. We do not guarantee service uptime or AI feedback accuracy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    To the fullest extent under California law, J&R Innovations, Inc. is not liable for indirect, 
                    incidental, or consequential damages. All liability caps at the fees you have paid.
                  </p>
                </section>

                {/* Article 11 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 11: Governing Law & Dispute Resolution
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms are governed by the laws of California. Any dispute will be subject to the exclusive 
                    jurisdiction of courts in Santa Clara County.
                  </p>
                </section>

                {/* Article 12 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 12: Arbitration & Class‑Action Waiver
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    (Optional) To reduce legal expenses, parties may agree to individual arbitration rather than 
                    class-action litigation. This clause must comply with California's arbitration rules.
                  </p>
                </section>

                {/* Article 13 */}
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Article 13: Updates to Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update these Terms by posting the revised version and notifying users via email. 
                    Continued use implies acceptance.
                  </p>
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

export default TermsPage; 