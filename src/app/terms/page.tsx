import { BRAND, brandNameStop } from "@/lib/brand";

export default function TermsPage() {
  return (
    <>
      <section className="gov-banner py-10 md:py-14">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Terms and Conditions</h1>
        </div>
      </section>
      <article className="container mx-auto px-4 py-12 max-w-3xl space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-heading text-lg font-bold mb-2">1. Introduction</h2>
          <p>
            These Terms and Conditions (&quot;Terms&quot;) govern your use of {BRAND.name} website
            (&quot;Website&quot;), available at https://{BRAND.domain}. By accessing, using, recommending, signing
            up, referring others to, or opening a link to the Website, you agree to these Terms. If you disagree
            with any part of these Terms, please do not use our Website.
          </p>
          <p className="mt-3">
            The Website is owned and operated by {BRAND.legalEntity}, headquartered in The Netherlands, offering a
            wide range of consultancy services and tools designed to support fishing enthusiasts and professionals.
          </p>
          <p className="mt-3 font-medium">Government Affiliation Disclaimer</p>
          <p>
            {BRAND.name} is a consultancy assistance platform and is not affiliated with, endorsed by, sponsored
            by, or supported by any governmental or regulatory entity. We function as an independent organization
            providing consultancy services. Services, information, or guidance provided by {BRAND.name} should not
            be seen as endorsed by or affiliated with any government agency.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">2. Definitions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>{BRAND.name}</strong> or &quot;we&quot; or &quot;us&quot; refers to the platform
              providing you with consulting assistance and other related services.
            </li>
            <li>
              <strong>Services</strong> include the consultancy, guidance, and other related services offered by{" "}
              {brandNameStop()}
            </li>
            <li>
              <strong>Intellectual Property Rights</strong> encompass all current and future rights globally
              conferred by statute, common law, or equity concerning copyright, trademarks, designs, patents,
              circuit layouts, business and domain names, inventions, confidential information, trade secrets, and
              other intellectual achievements.
            </li>
            <li>
              <strong>Onboarding</strong> means the online registration process on the Platform.
            </li>
            <li>
              <strong>Site Content</strong> comprises all materials, content, and information available on the
              Platform and/or {BRAND.name}&apos;s official social media accounts.
            </li>
            <li>
              <strong>Support</strong> means the technical support, resources and information, payment and
              maintenance services for the Platform.
            </li>
            <li>
              <strong>Terms</strong> means the terms and conditions set out in this document.
            </li>
            <li>
              <strong>You</strong> or &quot;your&quot; means a person who is a customer of the Platform and uses
              and accesses the Platform.
            </li>
            <li>
              <strong>User Account</strong> means a profile created on the Platform by you and includes your title,
              full name, and email.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">3. Terms of Use</h2>
          <p>{BRAND.name} grants you a revocable, non-exclusive, and non-transferable licence to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>View the Website;</li>
            <li>Print pages from the Website in its original form; and</li>
            <li>Download any material from the Website for personal, non-commercial use.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">4. Acceptable Use</h2>
          <p className="font-medium mt-3 mb-1">4.1 Platform Usage Restrictions</p>
          <p>While using the platform, you must refrain from:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Violating any terms mentioned herein.</li>
            <li>Infringing upon the intellectual property of {BRAND.name} or any third party.</li>
            <li>Engaging in fraudulent or illegal activities.</li>
            <li>Disrupting the platform&apos;s accessibility or availability.</li>
          </ul>
          <p className="font-medium mt-3 mb-1">4.2 Prohibited Software</p>
          <p>
            You should not use or introduce spyware, computer viruses, Trojans, worms, keystroke loggers, or any
            malicious software.
          </p>
          <p className="font-medium mt-3 mb-1">4.3 Legal and Consultancy Compliance</p>
          <p>
            Your activities on the platform must comply with all applicable legal, regulatory, and tax
            requirements. You are also expected to utilise {BRAND.name}&apos;s consultancy services for ensuring
            adherence to these obligations.
          </p>
          <p className="font-medium mt-3 mb-1">4.4 Platform Conduct</p>
          <p>You must not:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Bypass any laws, third-party agreements, rights, or our terms and policies.</li>
            <li>Misrepresent an association or partnership with {brandNameStop()}</li>
            <li>Misuse user information, violate privacy rights, or contradict our Privacy Policy.</li>
            <li>Send unsolicited commercial messages through the platform.</li>
            <li>Engage in activities that are discriminatory, harassing, or abusive.</li>
            <li>Copy, mirror, or exploit any aspect of the platform without explicit authorisation.</li>
            <li>Employ automated means, such as robots or scrapers, to access or gather data from the platform.</li>
            <li>Attempt to disrupt, decode, or otherwise interfere with the platform&apos;s underlying technology.</li>
          </ul>
          <p className="font-medium mt-3 mb-1">4.5 Accountability for Misconduct</p>
          <p>Engaging in prohibited acts holds you accountable for any consequences.</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">5. Indemnity and Liability</h2>
          <p className="font-medium mt-3 mb-1">5.1 General Indemnity</p>
          <p>
            You agree to indemnify {BRAND.name} and its owners against any claims, damages, losses, liabilities,
            and expenses arising from your violation of these Terms.
          </p>
          <p className="font-medium mt-3 mb-1">5.2 General Limitation of Liability</p>
          <p>
            {BRAND.name} and its owning entity will not be liable for any direct, indirect, incidental, or
            consequential damages resulting from your use of or reliance on the platform or its content.
          </p>
          <p className="font-medium mt-3 mb-1">5.3 Information Accuracy</p>
          <p>
            We do not guarantee the accuracy of information provided on the platform by users or third parties. It
            is intended as general information and should not replace professional advice where necessary.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">6. Cancellation Policy</h2>
          <p className="font-medium mt-3 mb-1">6.1 Right to Cancel</p>
          <p>
            You have the right to cancel your order for a fishing licence application within 20 minutes of
            completing the payment. To exercise your right to cancel, you must notify us immediately by sending a
            clear statement to {BRAND.email}.
          </p>
          <p className="font-medium mt-3 mb-1">6.2 How to Cancel</p>
          <p>
            To cancel your order, contact us at {BRAND.email} with your order details, including your order number
            and full name. If the cancellation request is received within the allowed time frame, a full refund
            will be issued to your original payment method.
          </p>
          <p className="font-medium mt-3 mb-1">6.3 No Refunds After Processing</p>
          <p>
            Once the 20-minute cancellation window has passed, and if your order has been processed, no refunds
            will be issued. Processing begins as soon as we start working on your application, which may occur
            immediately after payment confirmation.
          </p>
          <p className="font-medium mt-3 mb-1">6.4 Exceptions to Cancellation</p>
          <p>
            In certain exceptional cases, such as evident errors in the application details or other significant
            issues, {BRAND.name} reserves the right to consider cancellation and refund requests on a
            case-by-case basis, solely at our discretion.
          </p>
          <p className="font-medium mt-3 mb-1">6.5 Processing Times and Refunds</p>
          <p>
            If you successfully cancel your order within the allowed time, refunds will be processed promptly.
            Depending on your payment method and financial institution, it may take several business days for the
            refunded amount to appear in your account.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">7. Refund Policy</h2>
          <p className="font-medium mt-3 mb-1">7.1 Right of Withdrawal</p>
          <p>
            You have the right to cancel your order within 20 minutes of making the payment to receive a full
            refund.
          </p>
          <p className="font-medium mt-3 mb-1">7.2 Exercising Your Right of Withdrawal</p>
          <p>
            To exercise your right of withdrawal, inform us of your decision to cancel by a clear statement (e.g.,
            a letter sent by post or email) to {BRAND.email}.
          </p>
          <p className="font-medium mt-3 mb-1">7.3 Effects of Withdrawal</p>
          <p>
            Reimbursement will be carried out using the same means of payment as the initial transaction, unless
            otherwise agreed. No fees will be incurred as a result of such reimbursement.
          </p>
          <p className="font-medium mt-3 mb-1">7.4 No Refund After Processing</p>
          <p>
            Once the 20-minute window has passed and the order has been processed, there is a strict no-refund
            policy.
          </p>
          <p className="font-medium mt-3 mb-1">7.5 Negotiation for Partial Refunds</p>
          <p>
            In certain situations, you may contact us to discuss the possibility of a partial refund. While not
            guaranteed, each case will be reviewed individually.
          </p>
          <p className="font-medium mt-3 mb-1">7.6 Amendments</p>
          <p>
            {BRAND.name} reserves the right to amend this refund policy at any time. Changes will be posted
            on our website, and continued use of our services signifies acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">8. Warranties and Representations</h2>
          <p>
            Using the Platform is at your own risk. Everything provided by {BRAND.name} is on an &quot;as is&quot;
            and &quot;as available&quot; basis, without any warranties. No representatives of {BRAND.name},
            including directors, officers, employees, or licensors, offer any warranty regarding the platform or
            its content.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">9. Notices</h2>
          <p>
            For all notices or communications, please contact:
          </p>
          <p className="mt-3">
            {BRAND.legalEntity}
            <br />
            Operating as: {BRAND.name}
            <br />
            {BRAND.address}
            <br />
            {BRAND.city}
            <br />
            {BRAND.country}
            <br />
            Company Registration Number: {BRAND.registration}
            <br />
            Email: {BRAND.email}
          </p>
          <p className="mt-3">
            Notices and communications must be in writing in English and can be sent personally, by post, or by
            email.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">10. General Provisions</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Any Terms provision that is prohibited in any jurisdiction is ineffective only to the extent of that
              prohibition.
            </li>
            <li>
              The validity, legality, or enforceability of any Terms provision in any jurisdiction does not affect
              its validity in another jurisdiction or the validity of the remaining provisions.
            </li>
            <li>
              If a provision is found to be void, illegal, or unenforceable, it can be severed without affecting
              the enforceability of other provisions.
            </li>
            <li>
              These Terms are governed by and construed in accordance with the laws of the Netherlands, and you
              agree to submit to the non-exclusive jurisdiction of the Courts of the Netherlands.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">11. Reservation of Rights</h2>
          <p>
            We reserve the right to request the removal of all links or any specific link to our Website. We also
            reserve the right to amend these Terms and linking policies at any time. By continuing to link to our
            Website, you agree to adhere to these updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">12. Confidential Information</h2>
          <p>
            By using this Website, you agree to keep any acquired confidential information strictly confidential.
            You must not disclose any conversation, images, or videos provided to you without the written consent
            of the involved individuals. You are responsible for any disputes arising from a breach of confidential
            information.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">13. General Disclaimer</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              These Terms do not limit or exclude any guarantees, warranties, representations, or conditions
              implied or imposed by Dutch law that cannot be lawfully limited or excluded.
            </li>
            <li>
              Subject to this clause and as permitted by law, {BRAND.name} will not be liable for any
              indirect or consequential damages arising from the services or these Terms.
            </li>
            <li>
              The information on the Website is for general informational purposes only. Any reliance you place on
              such information is strictly at your own risk.
            </li>
            <li>
              Use of the Website and Services is at your discretion and risk, provided &quot;as is&quot; without
              any warranties.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold mb-2">14. Contact Us</h2>
          <p>For inquiries or questions regarding these Terms, please contact us at {BRAND.email}.</p>
        </section>
      </article>
    </>
  );
}
