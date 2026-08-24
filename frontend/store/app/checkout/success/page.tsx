'use client'
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setMessage('Invalid order reference.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/payment/guest-verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId })
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Payment successful! Your order has been placed.');
          // Clear the cart
          localStorage.removeItem('ecompitch_cart');
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed. Please try again.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'An error occurred while verifying the payment.');
      }
    };

    verifyPayment();
  }, [orderId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg, #f7f7f7)', fontFamily: 'var(--f-inter)' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        {status === 'loading' && <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto 20px', color: '#666' }} />}
        {status === 'success' && <CheckCircle2 size={48} style={{ margin: '0 auto 20px', color: '#10b981' }} />}
        {status === 'error' && <XCircle size={48} style={{ margin: '0 auto 20px', color: '#ef4444' }} />}
        
        <h1 style={{ fontSize: '24px', margin: '0 0 10px', color: '#111' }}>
          {status === 'loading' ? 'Processing...' : status === 'success' ? 'Order Confirmed' : 'Payment Failed'}
        </h1>
        <p style={{ color: '#666', margin: '0 0 24px', lineHeight: '1.5' }}>{message}</p>
        
        {orderId && status === 'success' && (
          <p style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace', marginBottom: '24px' }}>
            Order ID: {orderId}
          </p>
        )}
        
        <button onClick={() => router.push('/')} style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, width: '100%' }}>
          Back to Store
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
