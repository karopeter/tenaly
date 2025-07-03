import { useRouter } from 'next/navigation';

export default function MessageSellerButton({ sellerId, productId, openAuthModal }) {
  const router = useRouter();
  

  const handleClick = () => {
    if (!sellerId || !productId) {
      alert("Missing seller or product info");
      return;
    }

    // Navigate to the messaging page with both sellerId and productId as query params
    router.push(`/Message?sellerId=${sellerId}&productId=${productId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Message Seller
    </button>
  );
}
