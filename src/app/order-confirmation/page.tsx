import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  const confirmed = Boolean(order_id);

  return (
    <section className="min-h-[60vh] py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 hidden md:flex items-start justify-center w-44">
            <div className="relative w-36 h-64 bg-muted rounded-[2rem] border-4 border-border flex items-center justify-center shadow-lg">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-border rounded-full" />
              <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center">
                {confirmed ? (
                  <CheckCircle2 className="w-14 h-14 text-primary" />
                ) : (
                  <Mail className="w-14 h-14 text-primary" />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5">
            {confirmed ? (
              <div className="bg-primary rounded-lg px-6 py-4 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
                <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
                  Payment confirmed — thank you!
                </h2>
              </div>
            ) : (
              <div className="bg-amber-500 rounded-lg px-6 py-4">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
                  Almost there — please complete your payment!
                </h2>
              </div>
            )}

            <div className="border border-border rounded-lg p-6 space-y-5 bg-card">
              {confirmed ? (
                <div className="space-y-2 text-sm text-foreground">
                  <p>Your payment has been received and your application is now being processed.</p>
                  <p className="font-semibold text-primary">
                    A confirmation email has been sent to your email address with your application details.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-foreground">
                  <p>
                    A payment page has been opened in a <strong>new tab</strong>. Please complete your payment
                    there to finalize your application.
                  </p>
                  <p className="font-semibold text-primary">
                    Once your payment is confirmed, you will receive a confirmation email with your application
                    details.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-heading font-bold text-foreground">
                  {confirmed ? "What happens now?" : "What happens after payment?"}
                </h3>
                <div className="space-y-0">
                  {[
                    confirmed
                      ? "A confirmation email has been sent with your application details."
                      : "You will receive a confirmation email with your application details.",
                    "We will carefully review your Fishing Licence application for any mistakes and notify you if there are any errors that need to be corrected.",
                    "We will then submit your verified application to the relevant provincial department for processing. The processing time typically takes up to 12 hours.",
                    "Once processed, you'll receive your digital fishing licence by email. Start fishing!",
                  ].map((step, i) => (
                    <div key={step} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {i + 1}
                        </div>
                        {i < 3 && <div className="w-px h-6 bg-border" />}
                      </div>
                      <p className="text-sm text-foreground pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {order_id && (
                <p className="text-xs text-muted-foreground">
                  Order reference: <span className="font-mono">{order_id}</span>
                </p>
              )}

              <Link href="/" className="gov-btn-primary rounded px-5 py-2.5 text-sm font-semibold inline-block">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
