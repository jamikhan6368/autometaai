'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from '@/lib/auth-client';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  Sparkles,
  ImageIcon
} from 'lucide-react';

function PaymentPageContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [credits, setCredits] = useState('');
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [location, setLocation] = useState('pakistan');
  const [creditType, setCreditType] = useState<'GENERAL' | 'BG_REMOVAL'>('GENERAL');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      redirect('/signin');
      return;
    }

    const creditsParam = searchParams.get('credits');
    const amountParam = searchParams.get('amount');
    const qrCodeParam = searchParams.get('qrCode');
    const currencyParam = searchParams.get('currency');
    const locationParam = searchParams.get('location');
    const creditTypeParam = searchParams.get('creditType') as 'GENERAL' | 'BG_REMOVAL';

    if (!creditsParam || !amountParam) {
      router.push('/buy-credits');
      return;
    }

    setCredits(creditsParam);
    setAmount(amountParam);
    setQrCode(qrCodeParam || '');
    setCurrency(currencyParam || 'PKR');
    setLocation(locationParam || 'pakistan');
    setCreditType(creditTypeParam || 'GENERAL');
  }, [session, isPending, router, searchParams]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      setScreenshot(file);
      setError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      setError('Please enter the transaction ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }
      formData.append('credits', credits);
      formData.append('amount', amount);
      formData.append('transactionId', transactionId.trim());
      formData.append('qrCode', qrCode);
      formData.append('currency', currency);
      formData.append('location', location);
      formData.append('creditType', creditType);

      const response = await fetch('/api/payment/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit payment request');
      }

      setSuccess('Payment request submitted successfully! Our team will review it within 24 hours.');

      setTimeout(() => {
        router.push('/payment-requests');
      }, 3000);

    } catch (error) {
      console.error('Payment submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit payment request');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session || !credits || !amount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Shield className="w-4 h-4" />
            Secure Payment
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Complete Your <span className="text-blue-600">Purchase</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Scan the QR code, make your payment, and enter the transaction details below
          </p>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Alert className="border-2 border-red-200 bg-red-50 rounded-2xl p-4">
              <div className="text-red-700 font-medium">{error}</div>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Alert className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl p-4">
              <div className="flex items-center gap-3 text-emerald-700 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                {success}
              </div>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary & QR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Order Summary Card */}
            <Card className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Credit Type</span>
                  <span className={cn(
                    "font-bold px-3 py-1 rounded-full text-sm",
                    creditType === 'BG_REMOVAL'
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  )}>
                    {creditType === 'BG_REMOVAL' ? '🎨 BG Removal' : '⚡ General AI'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Credits</span>
                  <span className="font-black text-2xl text-slate-900">{Number(credits).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="font-black text-3xl text-emerald-600">
                    {currency === 'PKR' ? 'Rs.' : '$'}{Number(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-500 font-medium">Payment Method</span>
                  <span className="font-bold text-slate-900">
                    {location === 'pakistan' ? '🏦 Bank / QR Code' : '💎 Binance'}
                  </span>
                </div>
              </div>
            </Card>

            {/* QR Code Card */}
            <Card className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/50 p-8 text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Payment QR Code
              </h2>

              {qrCode ? (
                <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border-2 border-slate-100">
                  <Image
                    src={`/qrcodes/${qrCode}`}
                    alt="Payment QR Code"
                    width={220}
                    height={220}
                    className="rounded-xl"
                  />
                </div>
              ) : (
                <div className="inline-block p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm">No QR code available</p>
                  <p className="text-slate-500 text-xs mt-2">Contact support for payment details</p>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <p className="text-slate-500 text-sm">
                  {location === 'pakistan'
                    ? 'Scan with your banking app or mobile wallet'
                    : 'Send payment to the Binance address'}
                </p>
                <p className="font-black text-2xl text-slate-900">
                  {currency === 'PKR' ? 'Rs.' : '$'}{Number(amount).toLocaleString()}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-[2rem] border-0 shadow-xl shadow-slate-200/50 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                Payment Verification
              </h2>

              <div className="space-y-6">
                {/* Transaction ID Input */}
                <div>
                  <Label htmlFor="transactionId" className="text-slate-700 font-bold mb-2 block">
                    Transaction ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                    className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-blue-500 text-lg font-medium"
                  />
                  <p className="text-slate-400 text-sm mt-2">
                    Find this in your payment confirmation
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <Label htmlFor="screenshot" className="text-slate-700 font-bold mb-2 block">
                    Payment Screenshot <span className="text-slate-400 font-normal">(Optional)</span>
                  </Label>
                  <div className={cn(
                    "relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50/50",
                    screenshotPreview ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-slate-50"
                  )}>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {screenshotPreview ? (
                      <div className="space-y-3">
                        <Image
                          src={screenshotPreview}
                          alt="Payment screenshot preview"
                          width={200}
                          height={150}
                          className="mx-auto rounded-xl object-contain max-h-32 shadow-lg"
                        />
                        <p className="text-emerald-600 font-medium text-sm">✓ Screenshot uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">Drop screenshot here or click to upload</p>
                          <p className="text-slate-400 text-sm">Max 5MB • PNG, JPG, WebP</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Quick Steps
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Scan QR code with your payment app',
                      `Pay ${currency === 'PKR' ? 'Rs.' : '$'}${Number(amount).toLocaleString()}`,
                      'Copy the transaction ID',
                      'Paste it above and submit'
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-blue-800 font-medium text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitPayment}
                  disabled={loading || !transactionId.trim() || !!success}
                  className={cn(
                    "w-full h-16 rounded-2xl font-bold text-lg transition-all",
                    success
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : success ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Request Submitted
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Submit Payment Request
                    </span>
                  )}
                </Button>

                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={() => router.push('/buy-credits')}
                  disabled={loading}
                  className="w-full h-12 rounded-xl border-2 border-slate-200 font-bold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Packages
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Reviewed within 24 hours</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure & verified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#fafafa]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}